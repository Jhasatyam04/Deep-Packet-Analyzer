module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#040a14',
        card: '#081428',
        cardBorder: 'rgba(251, 188, 4, 0.15)',
        primaryText: '#FFFFFF',
        secondaryText: '#9CA3AF',
        accent: '#fbbc04',
        accentDark: '#d9a200',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}