import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          ghost: 'var(--color-primary-ghost)',
          dark: 'var(--color-primary-dark)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted-rgb) / <alpha-value>)',
          hover: 'var(--color-surface-hover)',
          active: 'var(--color-surface-active)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: {
          DEFAULT: 'rgb(var(--color-border-rgb) / <alpha-value>)',
          strong: 'var(--color-border-strong)',
        },
        'muted-foreground': 'var(--color-muted-foreground)',
        'subtle-foreground': 'var(--color-subtle-foreground)',
        success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
        danger: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
        info: 'rgb(var(--color-info-rgb) / <alpha-value>)',
        'sidebar-bg': 'var(--color-sidebar-bg)',
        'sidebar-text': 'var(--color-sidebar-text)',
        'sidebar-muted': 'var(--color-sidebar-muted)',
        'table-header-bg': 'var(--color-table-header-bg)',
        'table-header-text': 'var(--color-table-header-text)',
        'table-header-border': 'var(--color-table-header-border)',
      },
      spacing: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-collapsed-width)',
        header: 'var(--header-height)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
