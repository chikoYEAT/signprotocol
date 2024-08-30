/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gradient-start': '#6e45e2', // Light purple
        'gradient-end': '#88d3ce', // Darker purple
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(at top left, var(--gradient-start), var(--gradient-end))',
      },
      textColor: {
        'gradient': 'linear-gradient(90deg, #6e45e2, #88d3ce)',
      },
    },
  },
  plugins: [],
}
