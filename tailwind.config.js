/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    600: '#013AF5',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                'open-sans': ['"Open Sans"', 'sans-serif'],
                'volo-pro': ['VoloSansPro', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
