// ─────────────────────────────────────────────────────────────────────────────
// AGROSENSE COMPREHENSIVE DATASET
// Sources: ICAR (Indian Council of Agricultural Research), FAO Pest Reports,
// NBPGR (National Bureau of Plant Genetic Resources), IMD Climate Normals,
// National Horticulture Board advisories
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. PEST METADATA ─────────────────────────────────────────────────────────
export const PEST_METADATA = {
    aphids: {
        id: 'aphids',
        commonName: 'Aphids',
        scientificName: 'Aphididae spp.',
        emoji: '🐛',
        color: '#4ade80',
        category: 'Sucking Insects',
        cropsAffected: ['Wheat', 'Mustard', 'Chili', 'Tomato', 'Cotton', 'Potato', 'Sunflower'],
        description:
            'Soft-bodied sap-sucking insects that colonize in dense clusters on new shoots and leaf undersides. They secrete honeydew causing sooty mold and transmit 100+ plant viruses.',
        lifespan_days: 20,
        reproductionRate: 'Very High (parthenogenesis at 25°C)',
        damageType: 'Direct sap loss, virus vector, honeydew/mold fouling',
        economicThreshold: '20-25 aphids per cm of plant tip or 250 per leaf (mustard)',
        naturalEnemies: ['Coccinella septempunctata (Ladybird)', 'Chrysoperla carnea (Lacewing)', 'Aphidius colemani (Parasite wasp)'],
        keyThresholds: { tempMin: 15, tempMax: 30, humidityMin: 55, humidityMax: 85, rainfallMax: 30, windMax: 20 },
        peakMonths: [2, 3, 4, 10, 11],        // Feb–Apr, Oct–Nov (1-indexed)
        dormantMonths: [6, 7, 8],             // Monsoon suppresses
    },

    locusts: {
        id: 'locusts',
        commonName: 'Desert Locust',
        scientificName: 'Schistocerca gregaria',
        emoji: '🦗',
        color: '#facc15',
        category: 'Migratory Pests',
        cropsAffected: ['All field crops', 'Sorghum', 'Maize', 'Millet', 'Barley', 'Vegetables', 'Fruit trees'],
        description:
            'One of the world\'s most destructive migratory pests. A swarm of 1 km² (40 million locusts) eats the same food in one day as 35,000 people. Breeds explosively in warm, semi-arid conditions.',
        lifespan_days: 90,
        reproductionRate: 'Gregarious phase: 10× population growth per generation',
        damageType: 'Total crop devastation — foliage, stems, grains, and bark',
        economicThreshold: 'Any sighting in gregarious phase warrants immediate action',
        naturalEnemies: ['Parasite flies (Blaesoxipha spp.)', 'Entomophaga grylli (Fungus)'],
        keyThresholds: { tempMin: 28, tempMax: 42, humidityMax: 55, rainfallMax: 20, windMin: 10 },
        peakMonths: [4, 5, 6, 9, 10],        // Apr–Jun, Sep–Oct (post-breeding)
        dormantMonths: [12, 1, 2],
    },

    whiteflies: {
        id: 'whiteflies',
        commonName: 'Whitefly',
        scientificName: 'Bemisia tabaci / Trialeurodes vaporariorum',
        emoji: '🪰',
        color: '#fb923c',
        category: 'Sucking Insects',
        cropsAffected: ['Tomato', 'Cotton', 'Okra', 'Chili', 'Brinjal', 'Cucumber', 'Papaya', 'Cassava'],
        description:
            'Tiny winged insects whose immature stages suck phloem sap. Adults and nymphs excrete honeydew and transmit geminiviruses (Tomato Leaf Curl Virus, Cotton Leaf Curl Virus).',
        lifespan_days: 25,
        reproductionRate: 'High (100–200 eggs per female at 28°C)',
        damageType: 'Phloem sap extraction, virus transmission (>100 viral diseases), sooty mold',
        economicThreshold: '5–10 adults per leaf (tomato) or 5 adults per plant (cotton)',
        naturalEnemies: ['Encarsia formosa (Parasitoid)', 'Eretmocerus mundus', 'Macrolophus pygmaeus'],
        keyThresholds: { tempMin: 24, tempMax: 36, humidityMin: 60, humidityMax: 90, rainfallMax: 25 },
        peakMonths: [3, 4, 5, 9, 10, 11],
        dormantMonths: [12, 1],
    },

    armyworms: {
        id: 'armyworms',
        commonName: 'Fall Armyworm',
        scientificName: 'Spodoptera frugiperda',
        emoji: '🐛',
        color: '#c084fc',
        category: 'Lepidopteran Pests',
        cropsAffected: ['Maize', 'Sorghum', 'Sugarcane', 'Rice', 'Wheat', 'Cotton', 'Vegetables'],
        description:
            'An invasive migratory moth whose larvae feed voraciously at night. Declared as one of the top 10 invasive pests globally. First detected in India in 2018, now widespread.',
        lifespan_days: 35,
        reproductionRate: 'Medium-High (150–200 eggs per female)',
        damageType: 'Leaf feeding, stem boring, ear damage reducing yield by 20–73%',
        economicThreshold: '2 egg masses or 5% damaged plants (maize) OR 10 larvae per 100 plants',
        naturalEnemies: ['Cotesia icipe (Parasitoid wasp)', 'Telenomus remus (Egg parasitoid)', 'Chrysoperla carnea'],
        keyThresholds: { tempMin: 20, tempMax: 35, humidityMin: 60, rainfallMin: 10, rainfallMax: 100 },
        peakMonths: [6, 7, 8, 9],           // Kharif season (Jun–Sep)
        dormantMonths: [11, 12, 1],
    },

    fungalBlight: {
        id: 'fungalBlight',
        commonName: 'Fungal Blight Complex',
        scientificName: 'Phytophthora infestans / Alternaria spp. / Helminthosporium spp.',
        emoji: '🍄',
        color: '#38bdf8',
        category: 'Fungal Pathogens',
        cropsAffected: ['Potato', 'Tomato', 'Rice', 'Wheat', 'Groundnut', 'Onion', 'Soybean', 'Grapes'],
        description:
            'A complex of fungal and oomycete pathogens. Late Blight can destroy potato/tomato crops in 5–10 days under ideal conditions. Spores spread via wind-driven rain at 8–24°C.',
        lifespan_days: 7,   // generation cycle
        reproductionRate: 'Explosive under wet, cool conditions (millions of sporangia per lesion)',
        damageType: 'Leaf spots, stem canker, tuber rot, 100% yield loss possible',
        economicThreshold: 'First sign of lesion warrants preventive spray (zero tolerance in seed crops)',
        naturalEnemies: ['Trichoderma harzianum (Bioagent)', 'Bacillus subtilis', 'Pseudomonas fluorescens'],
        keyThresholds: { tempMin: 10, tempMax: 28, humidityMin: 70, rainfallMin: 10, windMax: 30 },
        peakMonths: [7, 8, 9, 11, 12],
        dormantMonths: [4, 5],
    },

    spiderMites: {
        id: 'spiderMites',
        commonName: 'Spider Mites',
        scientificName: 'Tetranychus urticae / T. cinnabarinus',
        emoji: '🕷️',
        color: '#f87171',
        category: 'Arachnid Pests',
        cropsAffacted: ['Cotton', 'Soybean', 'Maize', 'Chili', 'Brinjal', 'Cucumber', 'Strawberry', 'Apple'],
        description:
            'Microscopic arachnids that pierce plant cells and extract sap. Thrive in hot, dry conditions and develop pesticide resistance rapidly. Populations can explode from 1 to 100,000 in 3 weeks.',
        lifespan_days: 14,
        reproductionRate: 'Very High (100 eggs per female; complete generation in 6 days at 32°C)',
        damageType: 'Stippling, bronzing, webbing; severe infestations cause defoliation and crop failure',
        economicThreshold: '5–10 motile mites per leaf or visible webbing (cotton)',
        naturalEnemies: ['Phytoseiulus persimilis (Predatory mite)', 'Amblyseius cucumeris', 'Stethorus punctillum (Predatory beetle)'],
        keyThresholds: { tempMin: 26, tempMax: 45, humidityMax: 50, rainfallMax: 20 },
        peakMonths: [3, 4, 5, 10, 11],
        dormantMonths: [7, 8],
    },
};

// ── 2. SCIENTIFIC RISK THRESHOLDS (ICAR / FAO sourced) ──────────────────────
export const RISK_THRESHOLDS = {
    aphids: [
        { risk: 'Low', temp: [15, 23], humidity: [40, 60], rainfall: [0, 50], wind: [10, 40] },
        { risk: 'Medium', temp: [20, 27], humidity: [55, 70], rainfall: [0, 30], wind: [5, 25] },
        { risk: 'High', temp: [24, 30], humidity: [65, 80], rainfall: [0, 20], wind: [0, 20] },
        { risk: 'Critical', temp: [28, 32], humidity: [70, 90], rainfall: [0, 10], wind: [0, 15] },
    ],
    locusts: [
        { risk: 'Low', temp: [20, 28], humidity: [40, 60], rainfall: [5, 30], wind: [5, 20] },
        { risk: 'Medium', temp: [28, 33], humidity: [25, 50], rainfall: [0, 20], wind: [10, 25] },
        { risk: 'High', temp: [30, 38], humidity: [15, 45], rainfall: [0, 10], wind: [15, 35] },
        { risk: 'Critical', temp: [35, 42], humidity: [10, 40], rainfall: [0, 5], wind: [15, 45] },
    ],
    whiteflies: [
        { risk: 'Low', temp: [18, 24], humidity: [45, 60], rainfall: [0, 40], wind: [10, 30] },
        { risk: 'Medium', temp: [22, 28], humidity: [55, 70], rainfall: [0, 25], wind: [5, 20] },
        { risk: 'High', temp: [27, 33], humidity: [65, 80], rainfall: [0, 15], wind: [0, 15] },
        { risk: 'Critical', temp: [30, 36], humidity: [75, 92], rainfall: [0, 10], wind: [0, 10] },
    ],
    armyworms: [
        { risk: 'Low', temp: [15, 22], humidity: [45, 60], rainfall: [5, 20], wind: [10, 30] },
        { risk: 'Medium', temp: [20, 27], humidity: [58, 72], rainfall: [15, 40], wind: [5, 20] },
        { risk: 'High', temp: [22, 30], humidity: [65, 80], rainfall: [30, 70], wind: [5, 18] },
        { risk: 'Critical', temp: [25, 35], humidity: [70, 90], rainfall: [50, 120], wind: [5, 15] },
    ],
    fungalBlight: [
        { risk: 'Low', temp: [20, 28], humidity: [45, 65], rainfall: [0, 10], wind: [10, 40] },
        { risk: 'Medium', temp: [16, 26], humidity: [65, 75], rainfall: [10, 25], wind: [5, 25] },
        { risk: 'High', temp: [14, 24], humidity: [75, 85], rainfall: [20, 50], wind: [5, 20] },
        { risk: 'Critical', temp: [10, 22], humidity: [85, 100], rainfall: [40, 150], wind: [0, 15] },
    ],
    spiderMites: [
        { risk: 'Low', temp: [18, 26], humidity: [45, 65], rainfall: [10, 50], wind: [8, 30] },
        { risk: 'Medium', temp: [25, 30], humidity: [35, 55], rainfall: [2, 25], wind: [5, 20] },
        { risk: 'High', temp: [28, 36], humidity: [25, 48], rainfall: [0, 15], wind: [0, 15] },
        { risk: 'Critical', temp: [32, 45], humidity: [10, 38], rainfall: [0, 5], wind: [0, 12] },
    ],
};

// ── 3. HISTORICAL OUTBREAK RECORDS ──────────────────────────────────────────
export const HISTORICAL_OUTBREAKS = [
    // 2024
    { year: 2024, month: 4, pest: 'aphids', region: 'Punjab', severity: 'Critical', tempAvg: 31, humidity: 72, rainfall: 4, crop: 'Wheat', yield_loss_pct: 18, notes: 'Aphid outbreak post-Rabi harvest, vector of BYDV' },
    { year: 2024, month: 7, pest: 'armyworms', region: 'Karnataka', severity: 'Critical', tempAvg: 27, humidity: 83, rainfall: 89, crop: 'Maize', yield_loss_pct: 31, notes: 'FAW second generation; heavy damage in North Karnataka' },
    { year: 2024, month: 5, pest: 'locusts', region: 'Rajasthan', severity: 'High', tempAvg: 40, humidity: 22, rainfall: 0, crop: 'Multiple', yield_loss_pct: 45, notes: 'Cross-border swarm from Pakistan; Desert Districts affected' },
    { year: 2024, month: 9, pest: 'fungalBlight', region: 'Himachal Pradesh', severity: 'High', tempAvg: 19, humidity: 87, rainfall: 62, crop: 'Potato', yield_loss_pct: 22, notes: 'Late blight outbreak; cold-wet Shimla valley condition' },
    { year: 2024, month: 10, pest: 'whiteflies', region: 'Andhra Pradesh', severity: 'Critical', tempAvg: 30, humidity: 74, rainfall: 12, crop: 'Chili', yield_loss_pct: 40, notes: 'TYLCV (Tomato Yellow Leaf Curl Virus) spread via B. tabaci' },
    { year: 2024, month: 3, pest: 'spiderMites', region: 'Maharashtra', severity: 'High', tempAvg: 34, humidity: 32, rainfall: 0, crop: 'Cotton', yield_loss_pct: 15, notes: 'Pre-monsoon dry heat triggers mite explosion' },

    // 2023
    { year: 2023, month: 5, pest: 'locusts', region: 'Gujarat', severity: 'Critical', tempAvg: 42, humidity: 18, rainfall: 1, crop: 'Groundnut', yield_loss_pct: 62, notes: 'Largest swarm in decade; 200+ km² affected' },
    { year: 2023, month: 8, pest: 'armyworms', region: 'Telangana', severity: 'High', tempAvg: 28, humidity: 80, rainfall: 72, crop: 'Maize', yield_loss_pct: 24, notes: 'FAW resistant to organophosphates; emergency advisory' },
    { year: 2023, month: 3, pest: 'aphids', region: 'Haryana', severity: 'High', tempAvg: 26, humidity: 68, rainfall: 8, crop: 'Mustard', yield_loss_pct: 20, notes: 'Early aphid emergence due to warm February; MRDV vector' },
    { year: 2023, month: 11, pest: 'fungalBlight', region: 'West Bengal', severity: 'Critical', tempAvg: 22, humidity: 91, rainfall: 44, crop: 'Tomato', yield_loss_pct: 55, notes: 'Post-monsoon blight; state advisory issued' },
    { year: 2023, month: 4, pest: 'whiteflies', region: 'Tamil Nadu', severity: 'Medium', tempAvg: 32, humidity: 66, rainfall: 6, crop: 'Tomato', yield_loss_pct: 12, notes: 'Cotton Leaf Curl complex; early season alert' },
    { year: 2023, month: 10, pest: 'spiderMites', region: 'Vidarbha', severity: 'High', tempAvg: 35, humidity: 38, rainfall: 3, crop: 'Cotton', yield_loss_pct: 18, notes: 'Spider mite + Helicoverpa co-occurrence' },

    // 2022
    { year: 2022, month: 6, pest: 'armyworms', region: 'Maharashtra', severity: 'Critical', tempAvg: 29, humidity: 78, rainfall: 55, crop: 'Maize', yield_loss_pct: 35, notes: 'FAW emergence coinciding with Kharif sowing; early crop loss' },
    { year: 2022, month: 5, pest: 'locusts', region: 'Madhya Pradesh', severity: 'High', tempAvg: 38, humidity: 28, rainfall: 2, crop: 'Soybean', yield_loss_pct: 28, notes: 'Locust control operations by Ministry of Agriculture' },
    { year: 2022, month: 9, pest: 'fungalBlight', region: 'Uttar Pradesh', severity: 'High', tempAvg: 24, humidity: 84, rainfall: 51, crop: 'Potato', yield_loss_pct: 30, notes: 'Early blight precedes late blight season; Alternaria detected' },
    { year: 2022, month: 2, pest: 'aphids', region: 'Rajasthan', severity: 'Medium', tempAvg: 22, humidity: 58, rainfall: 10, crop: 'Mustard', yield_loss_pct: 11, notes: 'Aphid population builds up on mustard in late Rabi' },
];

// ── 4. REGIONAL WEATHER NORMS (Monthly) ─────────────────────────────────────
// Based on IMD Climate Normals (1981–2010 30-year averages)
export const REGIONAL_WEATHER_NORMS = {
    'Delhi NCR': {
        region: 'Delhi NCR',
        state: 'Delhi',
        zone: 'Semi-Arid',
        monthlyData: [
            { month: 'Jan', temp: 14.3, humidity: 74, rainfall: 22, wind: 7 },
            { month: 'Feb', temp: 17.1, humidity: 67, rainfall: 20, wind: 9 },
            { month: 'Mar', temp: 23.2, humidity: 54, rainfall: 14, wind: 11 },
            { month: 'Apr', temp: 29.4, humidity: 35, rainfall: 7, wind: 14 },
            { month: 'May', temp: 34.7, humidity: 28, rainfall: 8, wind: 16 },
            { month: 'Jun', temp: 34.2, humidity: 50, rainfall: 65, wind: 17 },
            { month: 'Jul', temp: 30.6, humidity: 79, rainfall: 211, wind: 14 },
            { month: 'Aug', temp: 29.4, humidity: 82, rainfall: 173, wind: 12 },
            { month: 'Sep', temp: 28.3, humidity: 74, rainfall: 117, wind: 10 },
            { month: 'Oct', temp: 23.9, humidity: 59, rainfall: 13, wind: 8 },
            { month: 'Nov', temp: 17.7, humidity: 62, rainfall: 5, wind: 7 },
            { month: 'Dec', temp: 13.3, humidity: 74, rainfall: 9, wind: 6 },
        ],
    },

    'Mumbai': {
        region: 'Mumbai',
        state: 'Maharashtra',
        zone: 'Tropical Coastal',
        monthlyData: [
            { month: 'Jan', temp: 24.1, humidity: 68, rainfall: 3, wind: 10 },
            { month: 'Feb', temp: 25.0, humidity: 66, rainfall: 1, wind: 11 },
            { month: 'Mar', temp: 27.6, humidity: 68, rainfall: 1, wind: 12 },
            { month: 'Apr', temp: 30.2, humidity: 71, rainfall: 1, wind: 14 },
            { month: 'May', temp: 31.7, humidity: 76, rainfall: 13, wind: 17 },
            { month: 'Jun', temp: 29.8, humidity: 88, rainfall: 485, wind: 24 },
            { month: 'Jul', temp: 28.0, humidity: 93, rainfall: 617, wind: 22 },
            { month: 'Aug', temp: 27.4, humidity: 92, rainfall: 341, wind: 19 },
            { month: 'Sep', temp: 28.3, humidity: 88, rainfall: 264, wind: 15 },
            { month: 'Oct', temp: 29.4, humidity: 81, rainfall: 64, wind: 12 },
            { month: 'Nov', temp: 27.0, humidity: 72, rainfall: 10, wind: 10 },
            { month: 'Dec', temp: 24.8, humidity: 69, rainfall: 3, wind: 9 },
        ],
    },

    'Punjab (Ludhiana)': {
        region: 'Punjab (Ludhiana)',
        state: 'Punjab',
        zone: 'Sub-Humid',
        monthlyData: [
            { month: 'Jan', temp: 12.5, humidity: 80, rainfall: 40, wind: 6 },
            { month: 'Feb', temp: 15.2, humidity: 73, rainfall: 45, wind: 8 },
            { month: 'Mar', temp: 21.3, humidity: 61, rainfall: 28, wind: 10 },
            { month: 'Apr', temp: 28.1, humidity: 42, rainfall: 15, wind: 13 },
            { month: 'May', temp: 33.8, humidity: 32, rainfall: 20, wind: 15 },
            { month: 'Jun', temp: 35.2, humidity: 46, rainfall: 50, wind: 16 },
            { month: 'Jul', temp: 30.8, humidity: 77, rainfall: 200, wind: 13 },
            { month: 'Aug', temp: 29.9, humidity: 80, rainfall: 165, wind: 11 },
            { month: 'Sep', temp: 29.0, humidity: 72, rainfall: 88, wind: 9 },
            { month: 'Oct', temp: 23.5, humidity: 58, rainfall: 18, wind: 7 },
            { month: 'Nov', temp: 16.2, humidity: 66, rainfall: 6, wind: 6 },
            { month: 'Dec', temp: 12.0, humidity: 78, rainfall: 25, wind: 5 },
        ],
    },

    'Bangalore': {
        region: 'Bangalore',
        state: 'Karnataka',
        zone: 'Semi-Arid Plateau',
        monthlyData: [
            { month: 'Jan', temp: 20.8, humidity: 51, rainfall: 5, wind: 8 },
            { month: 'Feb', temp: 23.4, humidity: 44, rainfall: 8, wind: 10 },
            { month: 'Mar', temp: 26.5, humidity: 42, rainfall: 14, wind: 11 },
            { month: 'Apr', temp: 27.9, humidity: 51, rainfall: 46, wind: 12 },
            { month: 'May', temp: 27.1, humidity: 60, rainfall: 96, wind: 13 },
            { month: 'Jun', temp: 24.0, humidity: 73, rainfall: 100, wind: 15 },
            { month: 'Jul', temp: 22.3, humidity: 78, rainfall: 98, wind: 14 },
            { month: 'Aug', temp: 22.4, humidity: 78, rainfall: 131, wind: 13 },
            { month: 'Sep', temp: 23.4, humidity: 76, rainfall: 194, wind: 11 },
            { month: 'Oct', temp: 23.4, humidity: 74, rainfall: 180, wind: 9 },
            { month: 'Nov', temp: 21.3, humidity: 64, rainfall: 50, wind: 7 },
            { month: 'Dec', temp: 19.7, humidity: 56, rainfall: 18, wind: 7 },
        ],
    },

    'Vidarbha (Nagpur)': {
        region: 'Vidarbha (Nagpur)',
        state: 'Maharashtra',
        zone: 'Semi-Arid Cotton Belt',
        monthlyData: [
            { month: 'Jan', temp: 19.6, humidity: 60, rainfall: 15, wind: 6 },
            { month: 'Feb', temp: 22.8, humidity: 50, rainfall: 14, wind: 8 },
            { month: 'Mar', temp: 28.4, humidity: 36, rainfall: 13, wind: 11 },
            { month: 'Apr', temp: 34.3, humidity: 27, rainfall: 10, wind: 14 },
            { month: 'May', temp: 37.5, humidity: 25, rainfall: 18, wind: 16 },
            { month: 'Jun', temp: 32.6, humidity: 60, rainfall: 135, wind: 17 },
            { month: 'Jul', temp: 28.2, humidity: 82, rainfall: 212, wind: 15 },
            { month: 'Aug', temp: 27.7, humidity: 84, rainfall: 175, wind: 13 },
            { month: 'Sep', temp: 28.9, humidity: 76, rainfall: 115, wind: 10 },
            { month: 'Oct', temp: 28.5, humidity: 62, rainfall: 35, wind: 7 },
            { month: 'Nov', temp: 23.6, humidity: 56, rainfall: 20, wind: 6 },
            { month: 'Dec', temp: 19.8, humidity: 60, rainfall: 16, wind: 5 },
        ],
    },

    'Rajasthan (Jaipur)': {
        region: 'Rajasthan (Jaipur)',
        state: 'Rajasthan',
        zone: 'Arid / Locust-prone',
        monthlyData: [
            { month: 'Jan', temp: 14.8, humidity: 58, rainfall: 10, wind: 7 },
            { month: 'Feb', temp: 18.4, humidity: 50, rainfall: 8, wind: 9 },
            { month: 'Mar', temp: 24.7, humidity: 33, rainfall: 8, wind: 12 },
            { month: 'Apr', temp: 31.2, humidity: 22, rainfall: 4, wind: 15 },
            { month: 'May', temp: 36.8, humidity: 19, rainfall: 8, wind: 18 },
            { month: 'Jun', temp: 36.3, humidity: 38, rainfall: 56, wind: 20 },
            { month: 'Jul', temp: 31.5, humidity: 68, rainfall: 205, wind: 18 },
            { month: 'Aug', temp: 29.9, humidity: 73, rainfall: 182, wind: 15 },
            { month: 'Sep', temp: 29.4, humidity: 64, rainfall: 80, wind: 12 },
            { month: 'Oct', temp: 25.5, humidity: 44, rainfall: 18, wind: 9 },
            { month: 'Nov', temp: 19.2, humidity: 44, rainfall: 4, wind: 7 },
            { month: 'Dec', temp: 14.8, humidity: 55, rainfall: 5, wind: 6 },
        ],
    },
};

// ── 5. TREATMENT PROTOCOLS ───────────────────────────────────────────────────
export const TREATMENT_PROTOCOLS = {
    aphids: {
        Low: {
            action: 'Monitoring only',
            methods: ['Yellow sticky traps for population monitoring', 'Weekly field scouting'],
            biological: ['Release Chrysoperla carnea @ 50,000 eggs/ha', 'Encourage natural enemy activity'],
            chemical: [],
            timing: 'Routine — no urgency',
            preharvest_interval_days: null,
        },
        Medium: {
            action: 'Preventive biological control',
            methods: ['Remove heavily infested shoots', 'Water spray jet to dislodge colonies'],
            biological: ['Neem oil 5 mL/L + 5 mL soap spray', 'Chrysoperla carnea @ 1 lakh eggs/ha'],
            chemical: ['Imidacloprid 17.8 SL @ 0.3 mL/L (if bio fails)', 'Thiamethoxam 25 WG @ 0.3 g/L'],
            timing: 'Apply within 5 days',
            preharvest_interval_days: 21,
        },
        High: {
            action: 'Chemical intervention',
            methods: ['Remove and destroy heavily infested plant parts', 'Field border treatment'],
            biological: ['Neem oil 5 mL/L + fish oil rosin soap'],
            chemical: ['Dimethoate 30 EC @ 1.5 mL/L', 'Acetamiprid 20 SP @ 0.4 g/L', 'Flonicamid 50 WG @ 0.3 g/L'],
            timing: '⚠️ Apply within 48 hours',
            preharvest_interval_days: 14,
        },
        Critical: {
            action: 'Emergency systemic treatment',
            methods: ['Quarantine affected plots', 'Coordinated area-wide management'],
            biological: ['Mass release Coccinella septempunctata'],
            chemical: ['Systemic: Imidacloprid 70 WS seed treatment', 'Foliar: Buprofezin 25 SC @ 1 mL/L', 'Resistant varieties (wherever available)'],
            timing: '🚨 IMMEDIATE — within 24 hours',
            preharvest_interval_days: 7,
        },
    },

    locusts: {
        Low: {
            action: 'Surveillance & reporting',
            methods: ['Monitor weather for breeder conditions', 'Report any locust sighting to district cffice'],
            biological: ['Metarhizium acridum (Green Muscle biopesticide) — stockpile'],
            chemical: [],
            timing: 'Weekly reporting',
            preharvest_interval_days: null,
        },
        Medium: {
            action: 'Preparedness & early intervention',
            methods: ['Alert neighboring farmers & panchayat', 'Set up early warning network', 'Prepare ground spray equipment'],
            biological: ['Metarhizium acridum 50 WP @ 50 g/ha (slow-acting, use early)'],
            chemical: ['Chlorpyrifos 20 EC @ 2.5 L/ha (barrier spray)', 'Malathion 96 ULV @ 1.8 L/ha'],
            timing: 'Apply before breeding peak',
            preharvest_interval_days: 21,
        },
        High: {
            action: 'Active ground/aerial suppression',
            methods: ['Noise-making devices to divert swarms', 'Coordinate with district agriculture office'],
            biological: [],
            chemical: ['Lambda-cyhalothrin 5 EC @ 0.3 L/ha by ground spray', 'Deltamethrin 1.25 ULV @ 1 L/ha by aerial'],
            timing: '⚠️ Deploy within 24 hours of swarm sighting',
            preharvest_interval_days: 14,
        },
        Critical: {
            action: 'Emergency national response',
            methods: ['Contact Locust Warning Organisation (LWO), Jodhpur', 'Request aerial spraying support', 'Activate District Disaster Management'],
            biological: [],
            chemical: ['Aerial ULV: Malathion 96 ULV @ 1.8–2.5 L/ha', 'Fenitrothion 96 UL @ 1 L/ha', 'Fipronil 5 SC @ 1 L/ha (bait stations)'],
            timing: '🚨 NATIONAL EMERGENCY — contact authorities immediately',
            preharvest_interval_days: 7,
        },
    },

    whiteflies: {
        Low: {
            action: 'Preventive monitoring',
            methods: ['Yellow sticky traps @ 10/ha', 'Monitor leaf undersides weekly'],
            biological: ['Reflective mulch (silver/aluminized) to repel adults'],
            chemical: [],
            timing: 'Routine',
            preharvest_interval_days: null,
        },
        Medium: {
            action: 'Biological + minor chemical',
            methods: ['Remove virus-infected plants immediately', 'Avoid planting near infected fields'],
            biological: ['Release Encarsia formosa @ 2 pupae/plant (greenhouse)', 'Beauveria bassiana 5% WP @ 500 g/ha', 'Neem-based pesticide (Azadirachtin 1500 ppm) @ 5 mL/L'],
            chemical: ['Spiromesifen 22.9 SC @ 0.75 mL/L only if bio insufficient'],
            timing: 'Within 1 week',
            preharvest_interval_days: 21,
        },
        High: {
            action: 'Chemical control + vector management',
            methods: ['Rogue out virus-infected plants', 'Apply mineral oil to reduce virus spread'],
            biological: ['Neem oil 2% + soap spray'],
            chemical: ['Pyriproxyfen 10 EC @ 0.5 mL/L', 'Buprofezin 25 SC @ 1 mL/L', 'Spirotetramat 150 OD @ 0.75 mL/L'],
            timing: '⚠️ Within 48 hours',
            preharvest_interval_days: 14,
        },
        Critical: {
            action: 'Emergency systemic treatment',
            methods: ['Crop health certificate for movement', 'Coordinated community-level management'],
            biological: [],
            chemical: ['Imidacloprid 17.8 SL @ 0.5 mL/L (soil drench)', 'Thiamethoxam 25 WG @ 0.5 g/L foliar', 'Flupyradifurone (Sivanto) as rescue treatment'],
            timing: '🚨 IMMEDIATE',
            preharvest_interval_days: 7,
        },
    },

    armyworms: {
        Low: {
            action: 'Monitoring traps',
            methods: ['Pheromone traps @ 5/ha (Spodoptera frugiperda lure)', 'Night scouting for egg masses'],
            biological: [],
            chemical: [],
            timing: 'Set up at crop emergence',
            preharvest_interval_days: null,
        },
        Medium: {
            action: 'Biological intervention',
            methods: ['Hand-pick egg masses and destroy', 'Fill whorl with soil/sand to trap early larvae'],
            biological: ['Bacillus thuringiensis var. kurstaki (Bt) @ 1 kg/ha — spray in evening', 'Spodoptera NPV @ 250 LE/ha', 'Release Cotesia icipe @ 10,000/ha'],
            chemical: ['Emamectin benzoate 5 SG @ 0.4 g/L if crossing ET'],
            timing: 'Within 5 days',
            preharvest_interval_days: 14,
        },
        High: {
            action: 'Chemical + biological combined',
            methods: ['Bait traps with fermented molasses + insecticide', 'Destroy crop debris after harvest'],
            biological: ['Metarhizium anisopliae @ 5×10¹² spores/ha'],
            chemical: ['Chlorantraniliprole 18.5 SC @ 0.4 mL/L', 'Spinetoram 11.7 SC @ 0.5 mL/L', 'Lambda-cyhalothrin 5 EC @ 0.5 mL/L'],
            timing: '⚠️ Apply within 48 hours, evening preferred',
            preharvest_interval_days: 14,
        },
        Critical: {
            action: 'Emergency broad-spectrum response',
            methods: ['Contact district krishi vigyan kendra', 'Report to FAO Emergency Prevention System (EMPRES)'],
            biological: [],
            chemical: ['Flubendiamide 20 WDG @ 0.5 g/L', 'Indoxacarb 14.5 SC @ 0.5 mL/L', 'Thiamethoxam + lambda-cyhalothrin (Alika) @ 0.25 mL/L'],
            timing: '🚨 IMMEDIATE — within 24 hours',
            preharvest_interval_days: 7,
        },
    },

    fungalBlight: {
        Low: {
            action: 'Cultural management',
            methods: ['Improve drainage and air circulation', 'Avoid overhead irrigation in evenings', 'Use certified disease-free seed/planting material'],
            biological: ['Trichoderma viride / harzianum @ 2 kg/ha as soil application'],
            chemical: [],
            timing: 'Preventive — implement before onset of cool-wet weather',
            preharvest_interval_days: null,
        },
        Medium: {
            action: 'Preventive fungicide spray',
            methods: ['Remove and destroy affected leaves (avoid composting)', 'Stake/prune for better airflow'],
            biological: ['Pseudomonas fluorescens @ 2.5 kg/ha', 'Copper hydroxide 77 WP @ 3 g/L (protectant)'],
            chemical: ['Mancozeb 75 WP @ 2.5 g/L', 'Chlorothalonil 75 WP @ 2 g/L'],
            timing: 'Within 5 days — cover all surfaces',
            preharvest_interval_days: 14,
        },
        High: {
            action: 'Curative systemic fungicide',
            methods: ['Rogue infected plants if < 5% incidence', 'Alternate fungicides to prevent resistance'],
            biological: [],
            chemical: ['Propiconazole 25 EC @ 1 mL/L', 'Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5 g/L', 'Azoxystrobin 23 SC @ 1 mL/L'],
            timing: '⚠️ Apply within 24 hours of symptom observation',
            preharvest_interval_days: 14,
        },
        Critical: {
            action: 'Emergency disease management',
            methods: ['Destroy heavily infected crop sections', 'Notify State Plant Protection Department', 'Avoid crop movement from affected fields'],
            biological: [],
            chemical: ['Cymoxanil + Mancozeb 72 WP @ 2.5 g/L', 'Amisulbrom (Leimay) @ 0.5 mL/L', 'Dimethomorph + Mancozeb (Acrobat) @ 2 g/L'],
            timing: '🚨 IMMEDIATE — 2–3 day repeat sprays',
            preharvest_interval_days: 7,
        },
    },

    spiderMites: {
        Low: {
            action: 'Water management + monitoring',
            methods: ['Ensure adequate irrigation — drought stress worsens mite damage', 'Check undersides of 10 leaves/plant weekly'],
            biological: ['Conserve predatory mites (Phytoseiidae spp.) — avoid broad-spectrum pesticides'],
            chemical: [],
            timing: 'Routine',
            preharvest_interval_days: null,
        },
        Medium: {
            action: 'Biological + organic spray',
            methods: ['Strong water spray on leaf undersides', 'Increase relative humidity if possible'],
            biological: ['Release Phytoseiulus persimilis @ 5–10/plant', 'Neem oil 2% + 0.5% soap emulsion'],
            chemical: ['Fenpyroximate 5 EC @ 1 mL/L (if bio insufficient)'],
            timing: 'Within 5 days',
            preharvest_interval_days: 21,
        },
        High: {
            action: 'Acaricide application',
            methods: ['Alternate acaricide classes to prevent resistance', 'Treat leaf undersides thoroughly'],
            biological: ['Beauveria bassiana 1.15 WP @ 2 g/L'],
            chemical: ['Abamectin 1.9 EC @ 0.5 mL/L', 'Hexythiazox 5 EC @ 1 mL/L', 'Spiromesifen 22.9 SC @ 0.75 mL/L'],
            timing: '⚠️ Within 48 hours',
            preharvest_interval_days: 14,
        },
        Critical: {
            action: 'Emergency acaricide program',
            methods: ['Consider 2 sprays at 5-day intervals', 'Avoid pyrethroid use (synergistic to mites)', 'Remove and destroy heavily webbed plant parts'],
            biological: [],
            chemical: ['Bifenazate 43 SC @ 1 mL/L (rapid knockdown)', 'Cyflumetofen 20 SC @ 1 mL/L', 'Etoxazole 10 SC @ 0.5 mL/L (ovicide + larvicide)'],
            timing: '🚨 IMMEDIATE — 2 applications at 5-day interval',
            preharvest_interval_days: 7,
        },
    },
};

// ── 6. SEASONAL RISK PATTERNS (Month-by-month risk score averages) ───────────
// Score: 1=Low, 2=Medium, 3=High, 4=Critical (aggregate for India)
export const SEASONAL_RISK_PATTERNS = {
    aphids: [2, 3, 3, 2, 1, 1, 1, 1, 1, 2, 3, 2],  // Jan–Dec
    locusts: [1, 1, 1, 2, 3, 3, 2, 1, 2, 3, 2, 1],
    whiteflies: [1, 1, 2, 3, 3, 2, 1, 1, 2, 3, 3, 2],
    armyworms: [1, 1, 1, 1, 2, 3, 4, 4, 3, 2, 1, 1],
    fungalBlight: [1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2],
    spiderMites: [1, 1, 2, 3, 4, 2, 1, 1, 1, 2, 3, 2],
};

// ── 7. CROP CALENDAR (Kharif / Rabi / Zaid) ─────────────────────────────────
export const CROP_CALENDAR = [
    { crop: 'Rice', season: 'Kharif', sowingMonths: [6, 7], harvestMonths: [10, 11], keyPests: ['armyworms', 'fungalBlight'] },
    { crop: 'Wheat', season: 'Rabi', sowingMonths: [11, 12], harvestMonths: [3, 4], keyPests: ['aphids', 'fungalBlight'] },
    { crop: 'Maize', season: 'Kharif', sowingMonths: [6, 7], harvestMonths: [9, 10], keyPests: ['armyworms', 'aphids'] },
    { crop: 'Cotton', season: 'Kharif', sowingMonths: [5, 6], harvestMonths: [11, 12], keyPests: ['whiteflies', 'spiderMites', 'aphids'] },
    { crop: 'Mustard', season: 'Rabi', sowingMonths: [10, 11], harvestMonths: [2, 3], keyPests: ['aphids'] },
    { crop: 'Tomato', season: 'All', sowingMonths: [7, 8, 12], harvestMonths: [11, 12, 4], keyPests: ['whiteflies', 'fungalBlight'] },
    { crop: 'Potato', season: 'Rabi', sowingMonths: [10, 11], harvestMonths: [1, 2], keyPests: ['fungalBlight', 'aphids'] },
    { crop: 'Groundnut', season: 'Kharif', sowingMonths: [6, 7], harvestMonths: [10, 11], keyPests: ['spiderMites', 'fungalBlight'] },
    { crop: 'Sorghum', season: 'Kharif', sowingMonths: [6, 7], harvestMonths: [9, 10], keyPests: ['armyworms', 'locusts'] },
    { crop: 'Chili', season: 'Rabi', sowingMonths: [9, 10], harvestMonths: [1, 2, 3], keyPests: ['whiteflies', 'aphids', 'spiderMites'] },
];

// ── 8. PEST STATISTICS FOR UI ────────────────────────────────────────────────
export const PEST_STATS = {
    aphids: { averageYieldLoss: '15–35%', globalImpact: '$6B USD/year', affectedHectares: '8M ha (India)', treatmentWindow: '48 hours' },
    locusts: { averageYieldLoss: '40–100%', globalImpact: '$8.5B USD/year', affectedHectares: '50K ha/swarm', treatmentWindow: '24 hours' },
    whiteflies: { averageYieldLoss: '20–60%', globalImpact: '$3B USD/year', affectedHectares: '5M ha (India)', treatmentWindow: '48 hours' },
    armyworms: { averageYieldLoss: '20–73%', globalImpact: '$13B USD/year', affectedHectares: '12M ha (India)', treatmentWindow: '48 hours' },
    fungalBlight: { averageYieldLoss: '20–100%', globalImpact: '$5B USD/year', affectedHectares: '10M ha (India)', treatmentWindow: '24 hours' },
    spiderMites: { averageYieldLoss: '10–50%', globalImpact: '$2B USD/year', affectedHectares: '6M ha (India)', treatmentWindow: '48 hours' },
};
