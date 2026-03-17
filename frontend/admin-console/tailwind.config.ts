import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#E94560',
        'accent-hover': '#d63d56',
        sidebar: '#0f172a',
        'sidebar-hover': '#1e293b',
        'sidebar-active': '#1e293b',
      },
    },
  },
  plugins: [],
};
export default config;
