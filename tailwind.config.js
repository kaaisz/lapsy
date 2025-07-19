module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS変数から色を取得
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // カスタムアクセントカラー
        'neon-lime': {
          DEFAULT: 'var(--neon-lime)',
          hover: 'var(--neon-lime-hover)',
          active: 'var(--neon-lime-active)',
          light: 'var(--neon-lime-light)',
          disabled: 'var(--neon-lime-disabled)',
        },
        'salmon-pink': {
          DEFAULT: 'var(--salmon-pink)',
          hover: 'var(--salmon-pink-hover)',
          active: 'var(--salmon-pink-active)',
          light: 'var(--salmon-pink-light)',
        },
        'neutral-gray': {
          DEFAULT: 'var(--neutral-gray)',
          hover: 'var(--neutral-gray-hover)',
          light: 'var(--neutral-gray-light)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.5' }],
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
      },
    },
  },
  plugins: [],
}
