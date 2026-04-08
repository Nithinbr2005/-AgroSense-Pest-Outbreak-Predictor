/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                agro: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                earth: {
                    50: '#fdf8f0',
                    100: '#faebd7',
                    200: '#f5d5ae',
                    300: '#edb97b',
                    400: '#e49443',
                    500: '#d97b1e',
                    600: '#c46314',
                    700: '#a34d12',
                    800: '#843e16',
                    900: '#6b3415',
                    950: '#3a190a',
                }
            }
        },
    },
    plugins: [],
}
