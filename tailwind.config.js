import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
					hover: 'hsl(var(--color-primary-hover) / <alpha-value>)',
					light: 'hsl(var(--color-primary-light) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
					hover: 'hsl(var(--color-secondary-hover) / <alpha-value>)'
				},
				danger: {
					DEFAULT: 'hsl(var(--color-danger) / <alpha-value>)',
					hover: 'hsl(var(--color-danger-hover) / <alpha-value>)',
					light: 'hsl(var(--color-danger-light) / <alpha-value>)'
				},
				surface: {
					DEFAULT: 'hsl(var(--color-surface) / <alpha-value>)',
					alt: 'hsl(var(--color-surface-alt) / <alpha-value>)',
					dark: 'hsl(var(--color-surface-dark) / <alpha-value>)'
				},
				text: {
					main: 'hsl(var(--color-text-main) / <alpha-value>)',
					muted: 'hsl(var(--color-text-muted) / <alpha-value>)',
					inverse: 'hsl(var(--color-text-inverse) / <alpha-value>)'
				}
			}
		}
	},
	plugins: [typography, forms]
};
