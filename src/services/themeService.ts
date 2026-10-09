// Theme & Appearance Engine for Coquitos Academy (Neurodivergent & Sports Personalization)

export interface ThemeConfig {
  id: string;
  name: string;
  category: 'official' | 'sports' | 'pastels' | 'neurodivergent';
  emoji: string;
  tagline: string;
  colors: {
    primary: string;       // Primary buttons, active highlights
    primaryHover: string;
    secondary: string;     // Secondary accents (e.g. mint, gold, red)
    bgBody: string;        // Main background color
    bgCard: string;        // Card & modal background
    textMain: string;      // Main heading & body text
    textMuted: string;     // Subtitle text
    border: string;        // Borders
    badgeBg: string;       // Status badge backgrounds
    badgeText: string;
  };
  bgPattern?: string;      // Optional subtle watermark or themed SVG background
}

export const COQUITOS_THEMES: ThemeConfig[] = [
  // 1. BRAND OFFICIAL & NEURODIVERGENT MODES
  {
    id: 'coquitos-official',
    name: 'Coquitos Classic (Oficial)',
    category: 'official',
    emoji: '🥥',
    tagline: 'Paleta oficial: Crema Suave, Grafito, Naranja Coquitos & Menta Fresh.',
    colors: {
      primary: '#FF6B4A',
      primaryHover: '#EA5A39',
      secondary: '#4ECDC4',
      bgBody: '#F7F9F9',
      bgCard: '#FFFFFF',
      textMain: '#2C3E50',
      textMuted: '#64748B',
      border: '#E2E8F0',
      badgeBg: '#FFF0ED',
      badgeText: '#C84323'
    }
  },
  {
    id: 'calm-mint',
    name: 'Calm Mode (Zero Overwhelm)',
    category: 'neurodivergent',
    emoji: '🌿',
    tagline: 'Bajo estímulo sensorial: Reduce fatiga mental, ansiedad y sobrecarga visual.',
    colors: {
      primary: '#0D9488',
      primaryHover: '#0F766E',
      secondary: '#5EEAD4',
      bgBody: '#F0FDFA',
      bgCard: '#FFFFFF',
      textMain: '#134E4A',
      textMuted: '#2DD4BF',
      border: '#CCFBF1',
      badgeBg: '#CCFBF1',
      badgeText: '#115E59'
    }
  },
  {
    id: 'hyperfocus-dark',
    name: 'Hyperfocus Cyber (Modo Oscuro)',
    category: 'neurodivergent',
    emoji: '⚡',
    tagline: 'Grafito profundo con acentos neón para sesiones nocturnas e hiperfoco.',
    colors: {
      primary: '#FF6B4A',
      primaryHover: '#FF8266',
      secondary: '#FFD166',
      bgBody: '#1E293B',
      bgCard: '#0F172A',
      textMain: '#F8FAFC',
      textMuted: '#94A3B8',
      border: '#334155',
      badgeBg: '#334155',
      badgeText: '#FFD166'
    }
  },

  // 2. WAKY'S FAVORITE SPORTS TEAMS
  {
    id: 'boston-celtics',
    name: 'Boston Celtics',
    category: 'sports',
    emoji: '☘️',
    tagline: 'Verde Trébol #007A33, Oro Campeón #BA9653 y espíritu de campeonato.',
    colors: {
      primary: '#007A33',
      primaryHover: '#006228',
      secondary: '#BA9653',
      bgBody: '#F3FBF5',
      bgCard: '#FFFFFF',
      textMain: '#062B16',
      textMuted: '#4B6B56',
      border: '#C2E8D0',
      badgeBg: '#E0F7E9',
      badgeText: '#007A33'
    }
  },
  {
    id: 'ne-patriots',
    name: 'New England Patriots',
    category: 'sports',
    emoji: '🏈',
    tagline: 'Azul Marino Profundo #002244, Rojo Patriota #C60C30 y Plata.',
    colors: {
      primary: '#002244',
      primaryHover: '#0B335E',
      secondary: '#C60C30',
      bgBody: '#F1F5F9',
      bgCard: '#FFFFFF',
      textMain: '#002244',
      textMuted: '#475569',
      border: '#CBD5E1',
      badgeBg: '#FEE2E2',
      badgeText: '#991B1B'
    }
  },
  {
    id: 'boston-redsox',
    name: 'Boston Red Sox',
    category: 'sports',
    emoji: '⚾',
    tagline: 'Rojo Fenway #BD3039, Azul Navy Clásico #0C2340 y tradición.',
    colors: {
      primary: '#BD3039',
      primaryHover: '#A3242C',
      secondary: '#0C2340',
      bgBody: '#FAFAFA',
      bgCard: '#FFFFFF',
      textMain: '#0C2340',
      textMuted: '#64748B',
      border: '#F1D5D7',
      badgeBg: '#FEE2E2',
      badgeText: '#991B1B'
    }
  },

  // 3. PASTEL & COZY MOODS (Para niñas, niños y descanso visual)
  {
    id: 'moradito-lavender',
    name: 'Moradito Pastel (Lavender)',
    category: 'pastels',
    emoji: '💜',
    tagline: 'Lilas y violetas suaves, acogedores y mágicos para estudiar con dulzura.',
    colors: {
      primary: '#8B5CF6',
      primaryHover: '#7C3AED',
      secondary: '#C084FC',
      bgBody: '#FAF5FF',
      bgCard: '#FFFFFF',
      textMain: '#3B0764',
      textMuted: '#7E22CE',
      border: '#F3E8FF',
      badgeBg: '#F3E8FF',
      badgeText: '#6B21A8'
    }
  },
  {
    id: 'rosadito-rose',
    name: 'Rosadito Pastel (Rose Blossom)',
    category: 'pastels',
    emoji: '🌸',
    tagline: 'Rosa pastel cálido y brillante, lleno de ternura y alegría.',
    colors: {
      primary: '#EC4899',
      primaryHover: '#DB2777',
      secondary: '#F472B6',
      bgBody: '#FFF1F2',
      bgCard: '#FFFFFF',
      textMain: '#4C0519',
      textMuted: '#9F1239',
      border: '#FCE7F3',
      badgeBg: '#FCE7F3',
      badgeText: '#BE185D'
    }
  },
  {
    id: 'amarillo-lemon',
    name: 'Amarillo Pastel (Lemon Cream)',
    category: 'pastels',
    emoji: '🍋',
    tagline: 'Crema de limón suave y optimista, estimula la creatividad sin encandilar.',
    colors: {
      primary: '#D97706',
      primaryHover: '#B45309',
      secondary: '#FBBF24',
      bgBody: '#FEFCE8',
      bgCard: '#FFFFFF',
      textMain: '#451A03',
      textMuted: '#78350F',
      border: '#FEF08A',
      badgeBg: '#FEF9C3',
      badgeText: '#854D0E'
    }
  },
  {
    id: 'azul-cielo',
    name: 'Azul Cielo (Sky Breeze)',
    category: 'pastels',
    emoji: '☁️',
    tagline: 'Frescura ligera inspirada en cielos despejados para respirar profundo.',
    colors: {
      primary: '#0284C7',
      primaryHover: '#0369A1',
      secondary: '#38BDF8',
      bgBody: '#F0F9FF',
      bgCard: '#FFFFFF',
      textMain: '#082F49',
      textMuted: '#0369A1',
      border: '#BAE6FD',
      badgeBg: '#E0F2FE',
      badgeText: '#075985'
    }
  }
];

const THEME_STORAGE_KEY = 'coquitos_active_theme_id';

export const getSavedThemeId = (): string => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && COQUITOS_THEMES.some(t => t.id === saved)) {
      return saved;
    }
  } catch {}
  return 'coquitos-official';
};

export const getThemeById = (id: string): ThemeConfig => {
  return COQUITOS_THEMES.find(t => t.id === id) || COQUITOS_THEMES[0];
};

export const applyThemeToDocument = (theme: ThemeConfig) => {
  try {
    const root = document.documentElement;
    root.style.setProperty('--color-theme-primary', theme.colors.primary);
    root.style.setProperty('--color-theme-primary-hover', theme.colors.primaryHover);
    root.style.setProperty('--color-theme-secondary', theme.colors.secondary);
    root.style.setProperty('--color-theme-bg', theme.colors.bgBody);
    root.style.setProperty('--color-theme-card', theme.colors.bgCard);
    root.style.setProperty('--color-theme-text', theme.colors.textMain);
    root.style.setProperty('--color-theme-muted', theme.colors.textMuted);
    root.style.setProperty('--color-theme-border', theme.colors.border);

    // Apply dataset attribute for styling hooks
    root.dataset.theme = theme.id;
    root.dataset.themeCategory = theme.category;
    document.body.style.backgroundColor = theme.colors.bgBody;

    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  } catch (err) {
    console.error('Error applying theme:', err);
  }
};
