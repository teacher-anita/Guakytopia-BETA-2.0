import React from 'react';
import { Palette, Check, Sparkles, Moon, Sun, Heart, Eye } from 'lucide-react';

export type StudyThemeId = 'official' | 'calm_mint' | 'soft_pastel' | 'hyperfocus';

export interface StudyTheme {
  id: StudyThemeId;
  name: string;
  tagline: string;
  category: string;
  bgHex: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  icon: string;
  idealFor: string;
}

export const STUDY_THEMES: StudyTheme[] = [
  {
    id: 'official',
    name: 'Güakytopia Oficial',
    tagline: 'Vibrante, cálido y equilibrado',
    category: 'Oficial de Marca',
    bgHex: '#FFF9F0',
    primaryHex: '#2EC4B6',
    secondaryHex: '#243447',
    accentHex: '#FFD166',
    icon: '🦜',
    idealFor: 'La experiencia insignia de Güakytopia. Energía y claridad.'
  },
  {
    id: 'calm_mint',
    name: 'Calma & Menta (Bajo Estímulo)',
    tagline: 'Tonos pasteles relajantes para evitar sobrecarga',
    category: 'Sensibilidad Sensorial & TDAH',
    bgHex: '#F2F8F6',
    primaryHex: '#38A397',
    secondaryHex: '#1F3634',
    accentHex: '#4ECDC4',
    icon: '🌿',
    idealFor: 'Para días de ansiedad, sobrecarga mental o fatiga visual.'
  },
  {
    id: 'soft_pastel',
    name: 'Soft Bloom / Pastel',
    tagline: 'Ambiente tierno con lavanda y rosas suaves',
    category: 'Colores Pasteles',
    bgHex: '#FDF4F7',
    primaryHex: '#D05D84',
    secondaryHex: '#381E2C',
    accentHex: '#FFAAA6',
    icon: '🌸',
    idealFor: 'Lectura amable y descansada con estética dulce y serena.'
  },
  {
    id: 'hyperfocus',
    name: 'Hyperfocus Dark (Nocturno)',
    tagline: 'Modo oscuro profundo para concentración total',
    category: 'Enfoque Profundo & Noche',
    bgHex: '#18232F',
    primaryHex: '#2EC4B6',
    secondaryHex: '#F0F4F8',
    accentHex: '#FFD166',
    icon: '🌙',
    idealFor: 'Estudios de noche o personas sensibles a pantallas brillantes.'
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentTheme: StudyThemeId;
  onSelectTheme: (themeId: StudyThemeId) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  onSelectTheme,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#243447] tracking-tight">
                Ambiente de Estudio & Modo Enfoque
              </h3>
              <p className="text-xs text-slate-500">
                Personaliza la estética visual para cuidar tu atención y evitar fatiga.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Neurodivergent / Comfort Notice */}
        <div className="p-3 bg-[#FFF9F0] border border-[#FFD166]/60 rounded-2xl text-[11px] text-[#243447] flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Diseñado para tu cerebro:</strong> Ajusta los colores según tu estado de ánimo o sensibilidad sensorial del día para mantener tu motivación alta.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {STUDY_THEMES.map(theme => {
            const isSelected = currentTheme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onSelectTheme(theme.id);
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-[#2EC4B6] bg-[#2EC4B6]/10 shadow-xs ring-2 ring-[#2EC4B6]/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{theme.icon}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-black text-[#243447]">
                        {theme.name}
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {theme.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {theme.tagline}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      💡 {theme.idealFor}
                    </span>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.primaryHex }}
                        title="Primario"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.secondaryHex }}
                        title="Secundario"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.bgHex }}
                        title="Superficie"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.accentHex }}
                        title="Acento"
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#2EC4B6] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#243447] hover:bg-[#18232F] text-white rounded-xl text-xs font-bold transition-colors"
          >
            Listo, aplicar ambiente
          </button>
        </div>

      </div>
    </div>
  );
};
