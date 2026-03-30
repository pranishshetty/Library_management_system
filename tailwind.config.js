/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-blue-50', 'text-blue-500', 'bg-blue-600',
    'bg-amber-50', 'text-amber-500',
    'bg-emerald-50', 'text-emerald-500',
    'bg-violet-50', 'text-violet-500',
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}