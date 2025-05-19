
import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Add new soft pastel color palette for vitals
				vital: {
					spo2: "#4CC9F0",       // Soft blue for SpO2
					heartRate: "#F72585",   // Soft pink for heart rate
					respiratory: "#90BE6D", // Soft green for respiratory
					bloodPressure: "#9D4EDD", // Soft purple for BP
					muted: "#F8EDEB",       // Very soft background
				},
				// Gradient backgrounds
				glass: {
					card: "rgba(255, 255, 255, 0.15)",
					border: "rgba(255, 255, 255, 0.2)",
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				"accordion-up": {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-animation': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.85', transform: 'scale(0.98)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
				},
				'wave': {
					'0%': { transform: 'translateX(0) translateY(0)' },
					'25%': { transform: 'translateX(10px) translateY(-5px)' },
					'50%': { transform: 'translateX(20px) translateY(0)' },
					'75%': { transform: 'translateX(10px) translateY(5px)' },
					'100%': { transform: 'translateX(0) translateY(0)' },
				},
				'subtle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
				'slideInLeft': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
				'glowPulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(155, 135, 245, 0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(155, 135, 245, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(155, 135, 245, 0)' },
        },
				'iconPulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        }
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				'pulse': 'pulse-animation 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'breathe': 'breathe 4s ease-in-out infinite',
				'wave': 'wave 6s ease-in-out infinite',
				'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
				'shimmer': 'shimmer 3s linear infinite',
				'slideInLeft': 'slideInLeft 0.4s ease-out forwards',
        'glowPulse': 'glowPulse 2s infinite',
        'iconPulse': 'iconPulse 1.5s ease-in-out',
			},
			boxShadow: {
				'neumorph': '7px 7px 15px #d9d9d9, -7px -7px 15px #ffffff',
				'neumorph-sm': '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff',
				'neumorph-inset': 'inset 2px 2px 5px #d9d9d9, inset -2px -2px 5px #ffffff',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
