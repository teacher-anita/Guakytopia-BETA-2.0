// Schedule Formatter & Multi-Month Class Generator for Güakytopia
import { BookedSession } from '../types';

export interface GeneratedMonthClass {
  date: string; // YYYY-MM-DD
  dayName: string; // 'Lunes', 'Miércoles', etc.
  dateLabel: string; // 'Lun 19 Oct'
  fullDateLabel: string; // 'Lunes 19 de Octubre 2026'
  startTime: string; // '17:00'
  endTime: string; // '18:00'
  timeLabel: string; // '5:00 pm - 6:00 pm'
  slotDisplay: string; // 'Lun 19 Oct • 5:00 pm - 6:00 pm'
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const DAY_NAMES_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Turns legacy cryptic strings like 'lun_17', 'mie_21', 'mar_16' into clear human labels:
 * 'Lunes 5:00 pm - 6:00 pm (17:00)'
 */
export function formatSlotLabel(rawSlot: string): string {
  if (!rawSlot) return 'Sin horario asignado';
  const clean = rawSlot.trim();

  // If already formatted naturally, return directly
  if (clean.includes('de ') || clean.includes('•') || clean.includes(':') && (clean.toLowerCase().includes('am') || clean.toLowerCase().includes('pm'))) {
    return clean;
  }

  // Parse pattern like 'lun_17' or 'mie_20' or 'mar_16'
  const match = clean.match(/^([a-zñ]+)_(\d{1,2})(?:_(\d{1,2}))?$/i);
  if (match) {
    const dayPrefix = match[1].toLowerCase();
    const startHourNum = parseInt(match[2], 10);
    const endHourNum = match[3] ? parseInt(match[3], 10) : startHourNum + 1;

    let dayName = 'Lunes';
    if (dayPrefix.startsWith('lun')) dayName = 'Lunes';
    else if (dayPrefix.startsWith('mar')) dayName = 'Martes';
    else if (dayPrefix.startsWith('mie')) dayName = 'Miércoles';
    else if (dayPrefix.startsWith('jue')) dayName = 'Jueves';
    else if (dayPrefix.startsWith('vie')) dayName = 'Viernes';
    else if (dayPrefix.startsWith('sab')) dayName = 'Sábado';
    else if (dayPrefix.startsWith('dom')) dayName = 'Domingo';

    const formatHour12 = (h: number) => {
      const period = h >= 12 ? 'pm' : 'am';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:00 ${period}`;
    };

    return `${dayName} de ${formatHour12(startHourNum)} a ${formatHour12(endHourNum)} (${startHourNum}:00 - ${endHourNum}:00)`;
  }

  // Parse pattern like 'Lunes-16:00'
  const dashMatch = clean.match(/^([A-Za-zñáéíóúÁÉÍÓÚ]+)-(\d{1,2}):(\d{2})$/i);
  if (dashMatch) {
    const day = dashMatch[1];
    const h = parseInt(dashMatch[2], 10);
    const endH = h + 1;
    const formatHour12 = (hour: number) => {
      const period = hour >= 12 ? 'pm' : 'am';
      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      return `${h12}:00 ${period}`;
    };
    return `${day} de ${formatHour12(h)} a ${formatHour12(endH)}`;
  }

  return clean;
}

/**
 * Formats a 24h string "17:00" or "05:00 PM" into friendly 12h label
 */
export function formatHourFriendly(timeStr: string): string {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

/**
 * Generates all class dates for a full month according to recurring days (e.g. Lunes y Miércoles)
 * @param year e.g. 2026
 * @param monthIndex 0 for Jan, 9 for Oct, 10 for Nov, etc.
 * @param targetDays ['Lunes', 'Miércoles']
 * @param startTime e.g. "17:00" or "05:00 PM"
 * @param endTime e.g. "18:00" or "06:00 PM"
 */
export function generateMonthClasses(
  year: number,
  monthIndex: number,
  targetDays: string[],
  startTime: string,
  endTime: string
): GeneratedMonthClass[] {
  const result: GeneratedMonthClass[] = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const normalizedDays = targetDays.map(d => d.trim().toLowerCase());

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dateObj = new Date(year, monthIndex, dayNum, 12, 0, 0);
    const dayOfWeekIndex = dateObj.getDay(); // 0 = Dom, 1 = Lun, etc.
    const fullDayName = DAY_NAMES_ES[dayOfWeekIndex];
    const shortDayName = DAY_SHORT_ES[dayOfWeekIndex];

    const matches = normalizedDays.some(td => {
      const tdClean = td.toLowerCase();
      return fullDayName.toLowerCase().startsWith(tdClean.slice(0, 3));
    });

    if (matches) {
      const monthShort = MONTH_SHORT_ES[monthIndex];
      const monthFull = MONTH_NAMES_ES[monthIndex];
      const mm = String(monthIndex + 1).padStart(2, '0');
      const dd = String(dayNum).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      const dateLabel = `${shortDayName} ${dd} ${monthShort}`;
      const fullDateLabel = `${fullDayName} ${dayNum} de ${monthFull} ${year}`;
      const timeLabel = `${formatHourFriendly(startTime)} - ${formatHourFriendly(endTime)}`;
      const slotDisplay = `${dateLabel} • ${timeLabel}`;

      result.push({
        date: dateStr,
        dayName: fullDayName,
        dateLabel,
        fullDateLabel,
        startTime,
        endTime,
        timeLabel,
        slotDisplay
      });
    }
  }

  return result;
}

/**
 * Creates BookedSession objects from generated month classes
 */
export function convertToBookedSessions(
  classes: GeneratedMonthClass[],
  teacherName: string,
  teacherId?: string
): BookedSession[] {
  return classes.map((c, idx) => ({
    id: `session_${c.date}_${c.startTime.replace(/\D/g, '')}_${idx}`,
    date: c.date,
    day: c.dayName,
    startTime: c.startTime,
    endTime: c.endTime,
    hours: 1,
    teacherName,
    teacherId: teacherId || 'teacher_cokito',
    title: `Clase Oficial • ${c.dateLabel}`,
    purpose: 'lesson' as const,
    purposeLabel: '📖 Clase Regular del Mes',
    isPrepaid: false,
    status: 'confirmed' as const,
    meetLink: 'https://meet.google.com/eng-cokito-room',
    notes: `Programado automáticamente para el ciclo de ${c.fullDateLabel}`
  }));
}
