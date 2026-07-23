/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class', // Importante: modo escuro baseado em classe para compatibilidade com o sistema de temas
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      // ===== CORES OTIMIZADAS =====
      colors: {
        // Cor primária - Roxo Innova (única cor de marca)
        primary: {
          DEFAULT: '#5E3BFF',
          50: '#F4F1FF',
          100: '#E8E2FF', 
          200: '#D1C5FF',
          300: '#B2A0FF',
          400: '#9F7AFF',
          500: '#5E3BFF', // Cor principal
          600: '#4A2BE6',
          700: '#3B1FCC',
          800: '#2E18A3',
          900: '#251485',
        },

        // Neutros refinados (melhor contraste para dark mode)
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0', 
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155', // Bom para texto em fundo claro
          800: '#1E293B', // Bom para backgrounds escuros
          900: '#0F172A', // Muito escuro para contraste
        },

        // Estados do sistema (mantidos como referência)
        success: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0', 
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D', 
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        danger: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        // Cores específicas do produto (remoção de cores desnecessárias)
        transparent: 'transparent',
        current: 'currentColor',
      },

      // ===== GRADIENTES SIMPLIFICADOS =====
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5E3BFF 0%, #8A65FF 100%)',
        'gradient-primary-vertical': 'linear-gradient(180deg, #5E3BFF 0%, #8A65FF 100%)', 
        'gradient-primary-subtle': 'linear-gradient(135deg, rgba(94,59,255,0.06) 0%, rgba(138,101,255,0.06) 100%)',
        'gradient-dark-subtle': 'linear-gradient(135deg, rgba(94,59,255,0.1) 0%, rgba(138,101,255,0.1) 100%)',
      },

      // ===== SOMBRAS PERSONALIZADAS =====
      boxShadow: {
        'innova': '0 4px 6px -1px rgba(94, 59, 255, 0.1), 0 2px 4px -2px rgba(94, 59, 255, 0.06)',
        'innova-md': '0 8px 14px -3px rgba(94, 59, 255, 0.15), 0 4px 6px -2px rgba(94, 59, 255, 0.08)',
        'innova-lg': '0 20px 25px -5px rgba(94, 59, 255, 0.15), 0 8px 10px -6px rgba(94, 59, 255, 0.1)',
        'innova-glow': '0 0 20px rgba(94, 59, 255, 0.3)',
      },

      // ===== ANIMAÇÕES SUAVES =====
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1', 
            transform: 'translateY(0)',
          },
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'pulse-subtle': {
          '0%, 100%': { 
            opacity: '1' 
          },
          '50%': { 
            opacity: '0.8' 
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },

      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out', 
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
      },

      // ===== MELHORIAS DE TYPOGRAPHY =====
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }], // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      },

      // ===== ESPAÇAMENTO OTIMIZADO =====
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },

      // ===== BORDER RADIUS CONSISTENTE =====
      borderRadius: {
        'xl': '0.75rem',  // 12px - padrão para cards
        '2xl': '1rem',    // 16px - para containers maiores
        '3xl': '1.5rem',  // 24px - para seções especiais
      },

      // ===== CONFIGURAÇÕES DE BACKDROP =====
      backdropBlur: {
        '3xl': '64px',
      },
    },
  },

  // ===== PLUGINS CUSTOMIZADOS =====
  plugins: [
    function ({ addComponents, addUtilities, addBase, theme }) {
      // ===== BASE STYLES =====
      addBase({
        '*': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.primary.500')}`,
            outlineOffset: '2px',
          },
        },
        'html': {
          scrollBehavior: 'smooth',
        },
        'body': {
          fontFamily: theme('fontFamily.sans'),
        },
      });

      // ===== COMPONENTES CORE =====
      addComponents({
        // Card system unificado
        '.card-base': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.innova'),
          border: '1px solid rgb(226 232 240)', // slate-200
          transition: 'all 300ms ease',
        },
        '.dark .card-base': {
          backgroundColor: 'rgb(30 41 59)', // slate-800
          borderColor: 'rgb(51 65 85)',     // slate-700
        },
        
        // Buttons system
        '.btn-base': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '500',
          borderRadius: theme('borderRadius.lg'),
          transition: 'all 200ms ease',
          cursor: 'pointer',
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.primary.500')}`,
            outlineOffset: '2px',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          background: theme('backgroundImage.gradient-primary'),
          color: 'white',
          boxShadow: theme('boxShadow.innova'),
          '&:hover:not(:disabled)': {
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.innova-md'),
          },
        },
        '.btn-secondary': {
          backgroundColor: 'rgb(248 250 252)', // slate-50
          color: 'rgb(51 65 85)',              // slate-700
          border: '1px solid rgb(226 232 240)', // slate-200
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgb(241 245 249)', // slate-100
          },
        },
        '.dark .btn-secondary': {
          backgroundColor: 'rgb(51 65 85)',    // slate-700
          color: 'rgb(248 250 252)',           // slate-50
          borderColor: 'rgb(71 85 105)',       // slate-600
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgb(71 85 105)',  // slate-600
          },
        },

        // Input system
        '.input-base': {
          width: '100%',
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          borderRadius: theme('borderRadius.lg'),
          border: '1px solid rgb(203 213 225)', // slate-300
          backgroundColor: 'white',
          color: 'rgb(15 23 42)',               // slate-900
          transition: 'all 150ms ease',
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px rgba(94, 59, 255, 0.15)`,
          },
          '&::placeholder': {
            color: 'rgb(148 163 184)', // slate-400
          },
        },
        '.dark .input-base': {
          backgroundColor: 'rgb(51 65 85)',    // slate-700
          borderColor: 'rgb(71 85 105)',       // slate-600  
          color: 'rgb(248 250 252)',           // slate-50
          '&::placeholder': {
            color: 'rgb(148 163 184)',          // slate-400
          },
        },
      });

      // ===== UTILITÁRIOS ESPECIAIS =====
      addUtilities({
        '.text-gradient-primary': {
          background: theme('backgroundImage.gradient-primary'),
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass-effect': {
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.dark .glass-effect': {
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(94, 59, 255, 0.2)',
        },
        '.hover-lift': {
          transition: 'transform 200ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      });
    }
  ],
};