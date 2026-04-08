import { useState, useCallback, useEffect, useRef } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend,
} from 'recharts';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const OWM_KEY = '90e6dc63971558c58281dd4ae5ac3c53';
const OWM_URL = 'https://api.openweathermap.org/data/2.5/weather';

const SEASONS = ['Summer', 'Monsoon', 'Winter', 'Spring'];

const PESTS = [
    { id: 'aphids', name: 'Aphids', emoji: '🐛', color: '#4ade80' },
    { id: 'locusts', name: 'Locusts', emoji: '🦗', color: '#facc15' },
    { id: 'whiteflies', name: 'Whiteflies', emoji: '🪰', color: '#fb923c' },
    { id: 'armyworms', name: 'Armyworms', emoji: '🐛', color: '#c084fc' },
    { id: 'fungalBlight', name: 'Fungal Blight', emoji: '🍄', color: '#38bdf8' },
    { id: 'spiderMites', name: 'Spider Mites', emoji: '🕷️', color: '#f87171' },
];

// Crop list
const CROPS = [
    { id: 'all', name: 'All Crops', emoji: '🌾' },
    { id: 'rice', name: 'Rice', emoji: '🌾', season: 'Kharif' },
    { id: 'wheat', name: 'Wheat', emoji: '🌾', season: 'Rabi' },
    { id: 'cotton', name: 'Cotton', emoji: '🪡', season: 'Kharif' },
    { id: 'maize', name: 'Maize', emoji: '🌽', season: 'Kharif' },
    { id: 'tomato', name: 'Tomato', emoji: '🍅', season: 'All' },
    { id: 'potato', name: 'Potato', emoji: '🥔', season: 'Rabi' },
    { id: 'sugarcane', name: 'Sugarcane', emoji: '🎋', season: 'Annual' },
    { id: 'mustard', name: 'Mustard', emoji: '🟡', season: 'Rabi' },
];

// Which pests threaten each crop (based on ICAR pest calendars)
const CROP_PEST_MAP = {
    all: ['aphids', 'locusts', 'whiteflies', 'armyworms', 'fungalBlight', 'spiderMites'],
    rice: ['armyworms', 'fungalBlight', 'aphids'],
    wheat: ['aphids', 'fungalBlight', 'armyworms'],
    cotton: ['whiteflies', 'spiderMites', 'aphids', 'armyworms'],
    maize: ['armyworms', 'aphids', 'fungalBlight', 'spiderMites'],
    tomato: ['whiteflies', 'fungalBlight', 'aphids', 'spiderMites'],
    potato: ['fungalBlight', 'aphids', 'whiteflies'],
    sugarcane: ['armyworms', 'aphids', 'spiderMites'],
    mustard: ['aphids', 'whiteflies', 'fungalBlight'],
};

const RISK_CONFIG = {
    Low: { score: 1, bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', badge: 'bg-emerald-500', bar: '#22c55e' },
    Medium: { score: 2, bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', badge: 'bg-yellow-500', bar: '#eab308' },
    High: { score: 3, bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', badge: 'bg-orange-500', bar: '#f97316' },
    Critical: { score: 4, bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', badge: 'bg-red-500', bar: '#ef4444' },
};

const SCORE_TO_RISK = ['', 'Low', 'Medium', 'High', 'Critical'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Derive season from month (0-indexed) */
function seasonFromMonth(month) {
    if ([11, 0, 1].includes(month)) return 'Winter';
    if ([2, 3, 4].includes(month)) return 'Summer';
    if ([5, 6, 7, 8].includes(month)) return 'Monsoon';
    return 'Spring'; // Oct–Nov
}

/** Parse OWM API response into our weather state shape */
function parseOWM(data) {
    const month = new Date().getMonth();
    return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainfall: Math.round((data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0) * 10) / 10,
        wind: Math.round((data.wind?.speed ?? 0) * 3.6), // m/s → km/h
        season: seasonFromMonth(month),
    };
}

/** Fetch weather by city name */
async function fetchByCity(city) {
    const res = await fetch(`${OWM_URL}?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`);
    if (!res.ok) throw new Error(res.status === 404 ? `City "${city}" not found` : 'API error ' + res.status);
    const data = await res.json();
    return { weather: parseOWM(data), locationName: `${data.name}, ${data.sys.country}`, coords: { lat: data.coord.lat, lon: data.coord.lon } };
}

/** Fetch weather by coordinates */
async function fetchByCoords(lat, lon) {
    const res = await fetch(`${OWM_URL}?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`);
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    return { weather: parseOWM(data), locationName: `${data.name}, ${data.sys.country}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// PEST RISK ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function predictRisk({ temp, humidity, rainfall, wind, season: s }) {
    const score = {};

    { // Aphids
        let v = 1;
        if (temp > 28 && humidity > 70) v = Math.max(v, 4);
        else if (temp > 24 && humidity > 60) v = Math.max(v, 3);
        else if (temp > 20 && humidity > 50) v = Math.max(v, 2);
        if (wind > 25) v = Math.max(1, v - 1);
        if (s === 'Spring' || s === 'Summer') v = Math.min(4, v + 1);
        score.aphids = v;
    }
    { // Locusts
        let v = 1;
        if (temp > 35 && humidity < 40 && wind > 15) v = Math.max(v, 4);
        else if (temp > 30 && humidity < 50) v = Math.max(v, 3);
        else if (temp > 25 && humidity < 60) v = Math.max(v, 2);
        if (rainfall > 20) v = Math.max(1, v - 1);
        if (s === 'Summer') v = Math.min(4, v + 1);
        score.locusts = v;
    }
    { // Whiteflies
        let v = 1;
        if (temp > 30 && humidity > 75) v = Math.max(v, 4);
        else if (temp > 27 && humidity > 65) v = Math.max(v, 3);
        else if (temp > 22 && humidity > 55) v = Math.max(v, 2);
        if (s === 'Monsoon' || s === 'Summer') v = Math.min(4, v + 1);
        score.whiteflies = v;
    }
    { // Armyworms
        let v = 1;
        if (temp > 25 && rainfall > 50 && humidity > 70) v = Math.max(v, 4);
        else if (temp > 22 && rainfall > 30) v = Math.max(v, 3);
        else if (temp > 18 && rainfall > 15) v = Math.max(v, 2);
        if (s === 'Monsoon') v = Math.min(4, v + 1);
        score.armyworms = v;
    }
    { // Fungal Blight
        let v = 1;
        if (humidity > 85 && rainfall > 40 && temp < 32) v = Math.max(v, 4);
        else if (humidity > 75 && rainfall > 20) v = Math.max(v, 3);
        else if (humidity > 65 && rainfall > 10) v = Math.max(v, 2);
        if (s === 'Monsoon' || s === 'Spring') v = Math.min(4, v + 1);
        score.fungalBlight = v;
    }
    { // Spider Mites
        let v = 1;
        if (temp > 32 && humidity < 35) v = Math.max(v, 4);
        else if (temp > 28 && humidity < 45) v = Math.max(v, 3);
        else if (temp > 24 && humidity < 55) v = Math.max(v, 2);
        if (rainfall > 30) v = Math.max(1, v - 1);
        if (s === 'Summer') v = Math.min(4, v + 1);
        score.spiderMites = v;
    }

    return Object.fromEntries(
        Object.entries(score).map(([k, v]) => [k, SCORE_TO_RISK[Math.min(4, Math.max(1, v))]])
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────────────────
const RECOMMENDATIONS = {
    aphids: {
        Low: 'Monitor field borders. Install yellow sticky traps (5-10 per acre).',
        Medium: 'Release biological controls: Coccinellidae (Ladybugs). Apply 5% Neem Seed Kernel Extract (NSKE).',
        High: 'Warning: Apply Pymetrozine 50% WG @ 120g/acre or Flonicamid 50% WG @ 60g/acre.',
        Critical: '⚠️ SEVERE ALERT: Use Imidacloprid 17.8% SL @ 100ml/acre + Azadirachtin. Quarantine area.'
    },
    locusts: {
        Low: 'Routine surveillance along wind currents. Dig trenches around vulnerable crop edges.',
        Medium: 'Alert local agricultural authority. Prepare Metarhizium acridum biopesticide reserves.',
        High: 'Immediate Action: Deploy insect growth regulators (Teflubenzuron) or Malathion 50% EC.',
        Critical: '⚠️ CRITICAL RESPONSE: Vehicle-mounted ULV spraying of Chlorpyrifos 20%. Coordinate locally.'
    },
    whiteflies: {
        Low: 'Deploy yellow sticky traps (15/acre). Avoid excess nitrogen fertilizers.',
        Medium: 'Spray Neem oil (1500 ppm @ 5ml/L). Release Encarsia formosa parasites.',
        High: 'Apply Spiromesifen 22.9% SC @ 200ml/acre or Diafenthiuron 50% WP @ 250g/acre.',
        Critical: '⚠️ SEVERE OUTBREAK: Tank mix of Dinotefuran 20% SG @ 60g/acre with Pyriproxyfen.'
    },
    armyworms: {
        Low: 'Set up pheromone traps (4/acre) for moth monitoring. Deep plough to expose pupae.',
        Medium: 'Apply Bacillus thuringiensis (Bt) kurstaki @ 400g/acre in the late evening.',
        High: 'Spray Spinetoram 11.7% SC @ 100ml/acre or Chlorantraniliprole into the leaf whorls.',
        Critical: '⚠️ CRITICAL INFESTATION: Apply Emamectin benzoate 5% SG @ 80g/acre immediately.'
    },
    fungalBlight: {
        Low: 'Ensure proper row spacing for aeration. Avoid overhead irrigation during evening.',
        Medium: 'Apply preventive broad-spectrum fungicides: Mancozeb 75% WP @ 600g/acre.',
        High: 'Apply curative systemic fungicides: Azoxystrobin 23% SC @ 200ml/acre.',
        Critical: '⚠️ SEVERE BLIGHT: Apply Metalaxyl + Mancozeb WP immediately. Destroy infected crop debris.'
    },
    spiderMites: {
        Low: 'Maintain optimal soil moisture. Remove weed reservoirs from field boundaries.',
        Medium: 'Spray wettable Sulphur 80% WDG @ 1kg/acre. Release Phytoseiulus predators.',
        High: 'Target leaf undersides with specific acaricides: Spiromesifen or Abamectin 1.9% EC.',
        Critical: '⚠️ CRITICAL: Apply Propargite 57% EC @ 400ml/acre. Ensure maximum spray coverage.'
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// FORECAST GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
function generateForecast(baseWeather) {
    return Array.from({ length: 7 }, (_, i) => {
        const noise = () => (Math.random() - 0.5) * 8;
        const w = {
            temp: Math.max(5, Math.min(50, baseWeather.temp + noise())),
            humidity: Math.max(10, Math.min(100, baseWeather.humidity + noise())),
            rainfall: Math.max(0, baseWeather.rainfall + noise() * 2),
            wind: Math.max(0, baseWeather.wind + noise()),
            season: baseWeather.season,
        };
        const risks = predictRisk(w);
        const day = new Date(); day.setDate(day.getDate() + i);
        return {
            day: i === 0 ? 'Today' : day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            ...Object.fromEntries(PESTS.map(p => [p.id, RISK_CONFIG[risks[p.id]].score])),
        };
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SliderInput({ label, icon, value, min, max, unit, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-green-300 flex items-center gap-1">{icon} {label}</span>
                <span className="text-sm font-bold text-white">{value}{unit}</span>
            </div>
            <input type="range" min={min} max={max} value={value}
                onChange={e => onChange(Number(e.target.value))} className="w-full"
                style={{ background: `linear-gradient(to right,#22c55e ${pct}%,rgba(34,197,94,0.2) ${pct}%)` }} />
            <div className="flex justify-between text-xs text-green-700 mt-0.5"><span>{min}{unit}</span><span>{max}{unit}</span></div>
        </div>
    );
}

function RiskBadge({ risk, animated }) {
    const cfg = RISK_CONFIG[risk];
    if (!cfg) return null;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${cfg.badge} ${animated && risk === 'Critical' ? 'pulse-critical' : ''}`}>
            {risk === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />}
            {risk}
        </span>
    );
}

function PestCard({ pest, risk }) {
    const cfg = RISK_CONFIG[risk];
    return (
        <div className={`risk-card glass-card rounded-2xl p-4 border ${cfg.border} ${cfg.bg} relative overflow-hidden`}>
            {risk === 'Critical' && <div className="absolute inset-0 rounded-2xl border-2 border-red-500/60 pulse-critical pointer-events-none" />}
            <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{pest.emoji}</span>
                <RiskBadge risk={risk} animated />
            </div>
            <h3 className="text-white font-semibold text-sm">{pest.name}</h3>
            <div className={`mt-2 text-xs font-medium ${cfg.text}`}>Risk Level {cfg.score}/4</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${cfg.badge}`} style={{ width: `${(cfg.score / 4) * 100}%` }} />
            </div>
        </div>
    );
}

function WeatherChip({ icon, label, value, live }) {
    return (
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${live ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
            <span className="text-lg">{icon}</span>
            <div>
                <div className="text-xs text-green-400 font-medium">{label}</div>
                <div className="text-white font-bold text-sm">{value}</div>
            </div>
        </div>
    );
}

function CustomBarTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const risk = SCORE_TO_RISK[payload[0]?.value] ?? '';
    return (
        <div className="glass-card rounded-xl p-3 text-sm border border-green-500/20">
            <p className="text-green-300 font-semibold">{label}</p>
            <p className="text-white mt-1">Risk: <RiskBadge risk={risk} /></p>
        </div>
    );
}

function CustomLineTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card rounded-xl p-3 text-xs border border-green-500/20 max-w-[200px]">
            <p className="text-green-300 font-semibold mb-1">{label}</p>
            {payload.map(p => (
                <div key={p.dataKey} className="flex justify-between gap-3">
                    <span style={{ color: p.color }}>{p.name}:</span>
                    <span className="text-white font-bold">{SCORE_TO_RISK[p.value]}</span>
                </div>
            ))}
        </div>
    );
}

function AlertPanel({ risks, activePests = PESTS, weather, locationName }) {
    const alerts = activePests
        .map(p => ({ ...p, risk: risks[p.id], rec: RECOMMENDATIONS[p.id][risks[p.id]] }))
        .filter(p => p.risk === 'Critical' || p.risk === 'High' || p.risk === 'Medium')
        .sort((a, b) => RISK_CONFIG[b.risk].score - RISK_CONFIG[a.risk].score);

    if (!alerts.length) return (
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-emerald-400 font-semibold">All Clear</p>
            <p className="text-green-600 text-sm mt-1">Given the current conditions ({weather.temp}°C, {weather.humidity}% Humidity), no significant pest threats detected.</p>
        </div>
    );
    return (
        <div className="space-y-3">
            {alerts.map((a, i) => {
                // Dynamic weather context
                let context = '';
                if (a.id === 'aphids') context = `At ${weather.temp}°C and ${weather.humidity}%, aphid colonies multiply rapidly.`;
                else if (a.id === 'locusts') context = `${weather.wind} km/h winds and dry ${weather.humidity}% humidity elevate locust swarm risks.`;
                else if (a.id === 'whiteflies') context = `${weather.temp}°C heat combined with ${weather.humidity}% humidity is optimal for whitefly breeding.`;
                else if (a.id === 'armyworms') context = `${weather.rainfall}mm rainfall triggers armyworm moth emergence.`;
                else if (a.id === 'fungalBlight') context = `High moisture (${weather.humidity}%, ${weather.rainfall}mm) facilitates rapid fungal spore spread.`;
                else if (a.id === 'spiderMites') context = `Hot (${weather.temp}°C) and extremely dry (${weather.humidity}%) conditions cause aggressive spider mite foliage damage.`;

                return (
                    <div key={a.id} className={`glass-card rounded-2xl p-4 border ${RISK_CONFIG[a.risk].border} ${RISK_CONFIG[a.risk].bg} ${i === 0 && a.risk === 'Critical' ? 'animate-pulse-slow' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{a.emoji}</span>
                                <span className="text-white font-bold text-sm tracking-wide">{a.name}</span>
                            </div>
                            <RiskBadge risk={a.risk} animated />
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 mb-2 border border-white/5">
                            <p className="text-xs text-white/80 font-medium mb-1 flex gap-1.5 items-start">
                                <span>☁️</span>
                                <span><strong className="text-white">{locationName ? `${locationName}: ` : ''}</strong>{context}</span>
                            </p>
                        </div>
                        <p className={`text-xs leading-relaxed font-semibold ${RISK_CONFIG[a.risk].text} flex gap-1.5 items-start`}>
                            <span>🛡️</span> <span>{a.rec}</span>
                        </p>
                    </div>
                )
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CITY SEARCH COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_CITIES = [
    'Tumkur', 'Hassan', 'Hubbali', 'Mysore', 'Belgaum', 'Shimoga',
    'Mangalore', 'Bellary', 'Bidar', 'Davangere', 'Raichur',
    'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad',
    'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Nagpur',
    'Lucknow', 'Bhopal', 'Chandigarh', 'Patna', 'Dehradun',
    'Coimbatore', 'Madurai', 'Visakhapatnam', 'Jodhpur', 'Surat',
];

function CitySearch({ onSearch, loading, error }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.trim().length >= 2) {
            const filtered = QUICK_CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = (city) => {
        const c = city || query.trim();
        if (!c) return;
        setQuery(c);
        setSuggestions([]);
        setFocused(false);
        onSearch(c);
    };

    return (
        <div className="relative mb-4">
            <p className="text-xs font-medium text-green-300 mb-1.5">🔍 Search by Location</p>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        placeholder="e.g. Tumkur, Hassan, Hubbali…"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-green-700 focus:outline-none focus:border-green-500/60 focus:bg-white/8 transition-all"
                    />
                    {/* Suggestions dropdown */}
                    {focused && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-xl border border-green-500/20 overflow-hidden z-50 shadow-xl shadow-black/40">
                            {suggestions.map(s => (
                                <button
                                    key={s}
                                    onMouseDown={() => handleSubmit(s)}
                                    className="w-full text-left px-3 py-2 text-sm text-green-300 hover:bg-green-500/15 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <span className="text-green-600">📍</span> {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => handleSubmit()}
                    disabled={loading || !query.trim()}
                    className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-semibold transition-all flex items-center gap-1.5"
                >
                    {loading
                        ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        : '→'}
                </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1.5">⚠️ {error}</p>}

            {/* Quick city buttons */}
            <div className="mt-2">
                <p className="text-xs text-green-700 mb-1.5">Quick select (Karnataka):</p>
                <div className="flex flex-wrap gap-1.5">
                    {['Tumkur', 'Hassan', 'Hubbali', 'Mysore', 'Shimoga', 'Belgaum', 'Davangere', 'Mangalore'].map(c => (
                        <button
                            key={c}
                            onClick={() => { setQuery(c); handleSubmit(c); }}
                            className="px-2.5 py-1 rounded-lg text-xs border border-white/10 text-green-400 hover:border-green-500/50 hover:bg-green-500/10 hover:text-white transition-all"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
    const [weather, setWeather] = useState({ temp: 30, humidity: 68, rainfall: 10, wind: 12, season: 'Summer' });
    const [selectedCrop, setSelectedCrop] = useState('all');
    const [locationName, setLocationName] = useState('');
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [forecastData, setForecastData] = useState(() => generateForecast({ temp: 30, humidity: 68, rainfall: 10, wind: 12, season: 'Summer' }));

    const setW = useCallback(key => val => setWeather(p => ({ ...p, [key]: val })), []);

    function handleCropChange(e) {
        const cid = e.target.value;
        setSelectedCrop(cid);

        const crop = CROPS.find(c => c.id === cid);
        let autoSeason = '';

        if (crop?.season === 'Kharif') {
            autoSeason = 'Monsoon';
        } else if (crop?.season === 'Rabi') {
            autoSeason = 'Winter';
        } else {
            autoSeason = seasonFromMonth(new Date().getMonth());
        }

        if (autoSeason) {
            setWeather(p => ({ ...p, season: autoSeason }));
        }
    }

    useEffect(() => {
        setForecastData(generateForecast(weather));
        setIsLive(false);
    }, [weather]);

    const risks = predictRisk(weather);
    const activePestIds = CROP_PEST_MAP[selectedCrop] ?? CROP_PEST_MAP.all;
    const activePests = PESTS.filter(p => activePestIds.includes(p.id));
    const barData = activePests.map(p => ({ name: p.name, emoji: p.emoji, risk: RISK_CONFIG[risks[p.id]].score, fill: RISK_CONFIG[risks[p.id]].bar }));
    const criticalCount = activePests.filter(p => risks[p.id] === 'Critical').length;
    const highCount = activePests.filter(p => risks[p.id] === 'High').length;
    const overallRisk = SCORE_TO_RISK[Math.max(...activePests.map(p => RISK_CONFIG[risks[p.id]].score))];

    async function handleCitySearch(city) {
        setLoading(true); setSearchError('');
        try {
            const { weather: w, locationName: loc } = await fetchByCity(city);
            setWeather(w);
            setLocationName(loc);
            setIsLive(true);
            setForecastData(generateForecast(w));
        } catch (e) {
            setSearchError(e.message);
        } finally { setLoading(false); }
    }

    async function handleGeoLocation() {
        if (!navigator.geolocation) { setSearchError('Geolocation not supported.'); return; }
        setGeoLoading(true); setSearchError('');
        navigator.geolocation.getCurrentPosition(
            async pos => {
                try {
                    const { weather: w, locationName: loc } = await fetchByCoords(pos.coords.latitude, pos.coords.longitude);
                    setWeather(w);
                    setLocationName(loc);
                    setIsLive(true);
                    setForecastData(generateForecast(w));
                } catch (e) { setSearchError(e.message); }
                finally { setGeoLoading(false); }
            },
            () => { setSearchError('Location access denied.'); setGeoLoading(false); }
        );
    }

    const PRESETS = [
        { label: '🔥 Drought', w: { temp: 42, humidity: 22, rainfall: 0, wind: 25, season: 'Summer' } },
        { label: '🌊 Flood', w: { temp: 26, humidity: 95, rainfall: 120, wind: 8, season: 'Monsoon' } },
        { label: '🌿 Ideal', w: { temp: 22, humidity: 55, rainfall: 8, wind: 10, season: 'Spring' } },
        { label: '❄️ Cold Snap', w: { temp: 8, humidity: 60, rainfall: 5, wind: 20, season: 'Winter' } },
    ];

    return (
        <div className="gradient-bg min-h-screen font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-card border-b border-green-500/10 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-lg shadow-lg">🌾</div>
                        <div>
                            <h1 className="text-white font-extrabold text-lg leading-tight">AgroSense</h1>
                            <p className="text-green-500 text-xs flex items-center gap-1.5">
                                Pest Outbreak Predictor
                                {isLive && <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />LIVE</span>}
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${RISK_CONFIG[overallRisk].border} ${RISK_CONFIG[overallRisk].bg}`}>
                        <span className={`text-xs font-medium ${RISK_CONFIG[overallRisk].text}`}>Overall Field Risk</span>
                        <RiskBadge risk={overallRisk} animated />
                    </div>

                    <div className="flex gap-2 text-xs">
                        {criticalCount > 0 && <span className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full font-bold">🔴 {criticalCount} Critical</span>}
                        {highCount > 0 && <span className="bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-1 rounded-full font-bold">🟠 {highCount} High</span>}
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 pt-4">
                <div className="flex gap-2 bg-white/5 rounded-2xl p-1 w-fit border border-white/10">
                    {[{ id: 'dashboard', label: '📊 Dashboard' }, { id: 'forecast', label: '📅 7-Day Forecast' }].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-green-600 text-white shadow-lg' : 'text-green-400 hover:text-white hover:bg-white/5'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                {/* LEFT: Input Panel */}
                <aside>
                    <div className="glass-card rounded-2xl p-5 border border-green-500/15 sticky top-20 space-y-1">

                        {/* Location header */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-white font-bold text-base">🌤️ Weather Parameters</h2>
                            {locationName && (
                                <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 flex items-center gap-1 max-w-[140px] truncate">
                                    {isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block flex-shrink-0" />}
                                    📍 {locationName}
                                </span>
                            )}
                        </div>

                        {/* City Search */}
                        <CitySearch onSearch={handleCitySearch} loading={loading} error={searchError} />

                        {/* Geolocation Button */}
                        <button onClick={handleGeoLocation} disabled={geoLoading}
                            className="w-full py-2.5 mb-3 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                            {geoLoading
                                ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Detecting…</>
                                : '📡 Use My Location'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 h-px bg-green-500/15" />
                            <span className="text-xs text-green-700 font-medium">or adjust manually</span>
                            <div className="flex-1 h-px bg-green-500/15" />
                        </div>

                        {/* Sliders */}
                        <SliderInput label="Temperature" icon="🌡️" value={weather.temp} min={5} max={50} unit="°C" onChange={setW('temp')} />
                        <SliderInput label="Humidity" icon="💧" value={weather.humidity} min={10} max={100} unit="%" onChange={setW('humidity')} />
                        <SliderInput label="Rainfall" icon="🌧️" value={weather.rainfall} min={0} max={150} unit=" mm" onChange={setW('rainfall')} />
                        <SliderInput label="Wind Speed" icon="💨" value={weather.wind} min={0} max={80} unit=" km/h" onChange={setW('wind')} />

                        {/* Season Selector */}
                        <div className="mb-3">
                            <p className="text-xs font-medium text-green-300 mb-2">🗓️ Season</p>
                            <div className="grid grid-cols-2 gap-2">
                                {SEASONS.map(s => (
                                    <button key={s} onClick={() => setWeather(p => ({ ...p, season: s }))}
                                        className={`py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${weather.season === s ? 'bg-green-600 border-green-500 text-white shadow-lg' : 'border-white/10 text-green-400 hover:border-green-500/40 hover:text-white'}`}>
                                        {{ Summer: '☀️', Monsoon: '🌧️', Winter: '❄️', Spring: '🌸' }[s]} {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Crop Selector */}
                        <div className="mb-3">
                            <p className="text-xs font-medium text-green-300 mb-2">🌿 Crop Selection</p>
                            <div className="relative">
                                <select
                                    value={selectedCrop}
                                    onChange={handleCropChange}
                                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-green-500/60 transition-all cursor-pointer"
                                    style={{ backgroundImage: 'none' }}
                                >
                                    {CROPS.map(c => (
                                        <option key={c.id} value={c.id} style={{ background: '#0f2418', color: '#fff' }}>
                                            {c.emoji} {c.name}{c.season ? ` (${c.season})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">▾</span>
                            </div>
                            {selectedCrop !== 'all' && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {activePestIds.map(id => {
                                        const p = PESTS.find(p => p.id === id);
                                        return p ? (
                                            <span key={id} className="inline-flex items-center gap-1 text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-2 py-0.5">
                                                {p.emoji} {p.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick Presets */}
                        <div>
                            <p className="text-xs text-green-700 font-medium mb-2">Quick Presets</p>
                            <div className="grid grid-cols-2 gap-2">
                                {PRESETS.map(p => (
                                    <button key={p.label} onClick={() => { setWeather(p.w); setLocationName(''); setIsLive(false); }}
                                        className="py-1.5 rounded-lg text-xs font-medium border border-white/10 text-green-400 hover:border-green-500/40 hover:bg-green-500/10 hover:text-white transition-all">
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT: Main Content */}
                <main className="space-y-6">
                    {/* Weather Summary Bar */}
                    <div className="glass-card rounded-2xl p-4 border border-green-500/15">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-bold text-green-500 uppercase tracking-widest">Current Conditions</h2>
                            {isLive && locationName && (
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                                    Live · {locationName}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <WeatherChip icon="🌡️" label="Temperature" value={`${weather.temp}°C`} live={isLive} />
                            <WeatherChip icon="💧" label="Humidity" value={`${weather.humidity}%`} live={isLive} />
                            <WeatherChip icon="🌧️" label="Rainfall" value={`${weather.rainfall} mm`} live={isLive} />
                            <WeatherChip icon="💨" label="Wind Speed" value={`${weather.wind} km/h`} live={isLive} />
                        </div>
                    </div>

                    {activeTab === 'dashboard' && (
                        <>
                            {/* Pest Risk Cards */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-white font-bold text-base">🌱 Pest Risk Overview</h2>
                                    {selectedCrop !== 'all' && (
                                        <span className="text-xs bg-earth-500/20 border border-yellow-600/30 text-yellow-400 rounded-full px-3 py-1 font-semibold">
                                            {CROPS.find(c => c.id === selectedCrop)?.emoji} {CROPS.find(c => c.id === selectedCrop)?.name}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {activePests.map(p => <PestCard key={p.id} pest={p} risk={risks[p.id]} />)}
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="glass-card rounded-2xl p-5 border border-green-500/15">
                                <h2 className="text-white font-bold text-base mb-4">📊 Risk Level Comparison</h2>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.1)" />
                                        <XAxis dataKey="name" tick={{ fill: '#86efac', fontSize: 11 }} axisLine={{ stroke: 'rgba(34,197,94,0.2)' }} tickLine={false} />
                                        <YAxis tickFormatter={v => ['', 'Low', 'Med', 'High', 'Crit'][v] ?? ''} domain={[0, 4]} ticks={[1, 2, 3, 4]} tick={{ fill: '#86efac', fontSize: 11 }} axisLine={{ stroke: 'rgba(34,197,94,0.2)' }} tickLine={false} />
                                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(34,197,94,0.05)' }} />
                                        <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                                            {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-3 flex flex-wrap gap-3 justify-center">
                                    {barData.map(b => (
                                        <div key={b.name} className="flex items-center gap-1.5 text-xs">
                                            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: b.fill }} />
                                            <span className="text-green-300">{b.emoji} {b.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alerts */}
                            <div>
                                <h2 className="text-white font-bold text-base mb-3">🚨 Alerts & Recommendations</h2>
                                <AlertPanel risks={risks} activePests={activePests} weather={weather} locationName={locationName} />
                            </div>
                        </>
                    )}

                    {activeTab === 'forecast' && (
                        <div className="glass-card rounded-2xl p-5 border border-green-500/15">
                            <h2 className="text-white font-bold text-base mb-1">📅 7-Day Pest Risk Forecast</h2>
                            <p className="text-green-600 text-xs mb-5">Simulated risk trend based on weather variation. 1=Low · 2=Medium · 3=High · 4=Critical</p>
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.1)" />
                                    <XAxis dataKey="day" tick={{ fill: '#86efac', fontSize: 10 }} axisLine={{ stroke: 'rgba(34,197,94,0.2)' }} tickLine={false} />
                                    <YAxis tickFormatter={v => ['', 'Low', 'Med', 'High', 'Crit'][v] ?? ''} domain={[0.5, 4.5]} ticks={[1, 2, 3, 4]} tick={{ fill: '#86efac', fontSize: 10 }} axisLine={{ stroke: 'rgba(34,197,94,0.2)' }} tickLine={false} />
                                    <Tooltip content={<CustomLineTooltip />} />
                                    <Legend formatter={val => { const p = activePests.find(p => p.id === val); return <span className="text-xs text-green-300">{p?.emoji} {p?.name}</span>; }} wrapperStyle={{ paddingTop: '12px' }} />
                                    {activePests.map(p => (
                                        <Line key={p.id} type="monotone" dataKey={p.id} stroke={p.color} strokeWidth={2}
                                            dot={{ r: 4, fill: p.color, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                            {/* Table */}
                            <div className="mt-6 overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-green-500/20">
                                            <th className="text-left text-green-500 font-semibold pb-2 pr-4">Day</th>
                                            {activePests.map(p => <th key={p.id} className="text-center text-green-500 font-semibold pb-2 px-2" title={p.name}>{p.emoji}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {forecastData.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-2 pr-4 text-green-300 font-medium whitespace-nowrap">{row.day}</td>
                                                {activePests.map(p => <td key={p.id} className="py-2 px-2 text-center"><RiskBadge risk={SCORE_TO_RISK[row[p.id]]} /></td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <footer className="text-center py-6 text-green-800 text-xs border-t border-green-500/10 mt-4">
                AgroSense © 2026 · Weather by OpenWeatherMap · Risk estimates advisory only · Consult local agronomist
            </footer>
        </div>
    );
}
