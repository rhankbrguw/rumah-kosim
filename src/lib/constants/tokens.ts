export const DESIGN_TOKENS = {
	color: {
		brand: {
			primary: '#FBBF24',
			primaryHover: '#F59E0B'
		},
		surface: {
			primary: '#FFFFFF',
			secondary: '#FAF8F5',
			alt: '#F8FAFC'
		},
		text: {
			primary: '#0F172A',
			muted: '#64748B'
		},
		border: {
			subtle: '#E5E7EB',
			strong: '#D6D3D1'
		},
		semantic: {
			success: '#166534',
			warning: '#B45309',
			danger: '#B91C1C',
			info: '#2563EB'
		}
	},
	spacing: {
		xs: '4px',
		sm: '8px',
		md: '12px',
		lg: '16px',
		xl: '20px',
		xxl: '24px',
		huge: '40px'
	},
	radius: {
		sm: '8px',
		md: '12px',
		lg: '16px',
		xl: '24px'
	},
	font: {
		display: "'Playfair Display', serif",
		body: "'Inter', system-ui, -apple-system, sans-serif"
	},
	type: {
		micro: '0.6875rem',
		compact: '0.75rem',
		displayTracking: '0.16em'
	},
	shadow: {
		soft: '0 4px 20px rgba(15, 23, 42, 0.08)',
		primaryGlow: '0 0 40px -15px hsl(var(--color-primary) / 0.3)'
	},
	motion: {
		fast: '150ms',
		base: '200ms',
		slow: '300ms'
	},
	width: {
		contentMax: '1200px'
	}
} as const;
