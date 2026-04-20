import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        coffee: {
          50: "#f8f2eb",
          100: "#efe1d2",
          200: "#debea1",
          300: "#c99a76",
          400: "#b07b58",
          500: "#8f5e41",
          600: "#754735",
          700: "#5d372c",
          800: "#432620",
          900: "#291713"
        },
        cream: "#fbf6ef",
        oat: "#f2e8dc",
        ink: "#201714"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        glow: "0 20px 60px -24px rgba(49, 28, 17, 0.35)"
      },
      backgroundImage: {
        "coffee-glow":
          "radial-gradient(circle at top, rgba(176, 123, 88, 0.32), transparent 34%), linear-gradient(180deg, rgba(251, 246, 239, 0.92), rgba(242, 232, 220, 0.9))"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
