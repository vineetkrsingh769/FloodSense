/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#050a14",
          900: "#0a1628",
          800: "#0d1f3c",
          700: "#112952",
        },
        brand: {
          blue: "#1e5aff",
          cyan: "#00d4ff",
          green: "#00ff88",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-ring": "pulse-ring 2s infinite",
        "glow-pulse": "glow-pulse 3s infinite",
        rain: "rain linear infinite",
        wave: "wave 9s linear infinite",
        scan: "scan 1.8s linear infinite",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-18px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        "pulse-ring": { "0%": { transform: "scale(0.8)", opacity: 1 }, "100%": { transform: "scale(2.2)", opacity: 0 } },
        "glow-pulse": { "0%,100%": { boxShadow: "0 0 20px rgba(30,90,255,.4)" }, "50%": { boxShadow: "0 0 40px rgba(30,90,255,.8)" } },
        rain: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(110vh)" } },
        wave: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        scan: { "0%": { top: "0%" }, "100%": { top: "100%" } },
      },
    },
  },
  plugins: [],
};
