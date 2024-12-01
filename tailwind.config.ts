import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: ({ theme }: PluginAPI) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'code': {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.900'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '500'
            },
            'pre': {
              backgroundColor: 'transparent',
              padding: 0,
              marginTop: '1.5em',
              marginBottom: '1.5em',
              borderRadius: '0.375rem',
              overflow: 'hidden'
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
              fontSize: '0.875em',
              lineHeight: '1.7142857'
            },
            'a': {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            'img': {
              borderRadius: '0.375rem',
              margin: '0',
              display: 'inline-block',
            },
            'p': {
              '& img': {
                display: 'inline-block',
                margin: '0 4px',
                verticalAlign: 'middle',
              },
              '&:has(img:only-child)': {
                marginTop: '0.5em',
                marginBottom: '0.5em',
              }
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            'a': {
              color: theme('colors.blue.400'),
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: theme('colors.gray.200'),
            },
            'code': {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
              border: `1px solid ${theme('colors.gray.700')}`,
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
            'strong': {
              color: theme('colors.gray.100'),
            }
          }
        }
      })
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate")
  ],
} satisfies Config;

export default config;
