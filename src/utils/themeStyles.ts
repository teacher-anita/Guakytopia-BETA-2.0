import { StudyThemeId } from '../components/ThemeSelectorModal';

export const getThemeBannerClass = (theme: StudyThemeId, isKids: boolean = false): string => {
  if (isKids) {
    return 'bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-950 border-violet-500/30 text-white';
  }
  switch (theme) {
    case 'hyperfocus':
      return 'bg-gradient-to-br from-slate-950 via-teal-950 to-indigo-950 border-teal-500/30 text-white';
    case 'calm_mint':
      return 'bg-gradient-to-br from-[#1F3634] via-[#284E4B] to-[#38A397] border-teal-500/30 text-white';
    case 'soft_pastel':
      return 'bg-gradient-to-br from-[#381E2C] via-[#5C2E46] to-[#D05D84] border-pink-400/30 text-white';
    case 'official':
    default:
      return 'bg-gradient-to-br from-[#243447] via-[#1a3a4b] to-[#0f5c56] border-teal-500/40 text-white';
  }
};

export const getThemeBackgroundClass = (theme: StudyThemeId, isKids: boolean = false): string => {
  if (isKids) {
    return 'bg-gradient-to-b from-indigo-50/70 via-purple-50/40 to-sky-50/60 text-slate-800';
  }
  switch (theme) {
    case 'hyperfocus':
      return 'bg-[#121A24] text-slate-100';
    case 'calm_mint':
      return 'bg-[#F2F8F6] text-[#1F3634]';
    case 'soft_pastel':
      return 'bg-[#FDF4F7] text-[#381E2C]';
    case 'official':
    default:
      return 'bg-[#FFF9F0] text-slate-900';
  }
};

export const getThemeHeaderClass = (theme: StudyThemeId): string => {
  switch (theme) {
    case 'hyperfocus':
      return 'bg-[#18232F]/95 border-slate-800 text-white';
    case 'calm_mint':
      return 'bg-[#F2F8F6]/95 border-emerald-200/80 text-[#1F3634]';
    case 'soft_pastel':
      return 'bg-[#FDF4F7]/95 border-pink-200/80 text-[#381E2C]';
    case 'official':
    default:
      return 'bg-white/95 border-slate-200/90 text-slate-900';
  }
};
