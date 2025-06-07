/** @type {import('tailwindcss').Config} */

export default {
  content:  [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',       // Blue-700
        primaryFocus: '#1E40AF',  // Blue-800
        secondary: '#9333EA',     // Purple-600
        secondaryFocus: '#7E22CE',// Purple-700
        accent: '#F59E0B',        // Amber-500
        accentFocus: '#B45309',   // Amber-700
        neutral: '#374151',       // Gray-700
        neutralFocus: '#1F2937',  // Gray-800
        base100: '#FFFFFF',
        base200: '#F3F4F6',       // Gray-100
        base300: '#E5E7EB',       // Gray-200
        info: '#3B82F6',          // Blue-500
        success: '#22C55E',       // Green-500
        warning: '#FBBF24',       // Yellow-400
        error: '#EF4444',         // Red-500
      },
    },
  },
  plugins: [],
}
