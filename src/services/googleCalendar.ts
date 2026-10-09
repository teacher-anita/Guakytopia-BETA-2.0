import { getAccessToken } from './firebaseAuth';

export interface CalendarEventPayload {
  summary: string;
  description: string;
  dayString: string; // e.g. "2026-10-05"
  startTime: string; // e.g. "16:00"
  endTime: string;   // e.g. "17:00"
  studentEmail?: string;
  meetLink?: string;
}

/**
 * Creates a real Google Calendar event using the authorized access token.
 */
export async function createGoogleCalendarEvent(payload: CalendarEventPayload): Promise<{ success: boolean; eventId?: string; htmlLink?: string; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, error: 'NO_AUTH' };
    }

    // Build ISO dates
    const startDateTime = `${payload.dayString}T${payload.startTime}:00`;
    const endDateTime = `${payload.dayString}T${payload.endTime}:00`;

    const body: any = {
      summary: payload.summary,
      description: payload.description,
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    if (payload.studentEmail) {
      body.attendees = [{ email: payload.studentEmail }];
    }

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      eventId: data.id,
      htmlLink: data.htmlLink
    };
  } catch (err: any) {
    console.error('Error creating Google Calendar event:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Generates an instant web link to open Google Calendar with prefilled fields.
 */
export function buildGoogleCalendarUrl(payload: CalendarEventPayload): string {
  const [year, month, day] = payload.dayString.split('-').map(Number);
  const [startHour, startMin] = payload.startTime.split(':').map(Number);
  const [endHour, endMin] = payload.endTime.split(':').map(Number);

  const startUtc = new Date(Date.UTC(year, month - 1, day, startHour, startMin)).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endUtc = new Date(Date.UTC(year, month - 1, day, endHour, endMin)).toISOString().replace(/-|:|\.\d\d\d/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: payload.summary,
    details: payload.description,
    dates: `${startUtc}/${endUtc}`,
    location: payload.meetLink || 'Google Meet / Online'
  });

  if (payload.studentEmail) {
    params.set('add', payload.studentEmail);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates and downloads a standard .ics calendar file.
 */
export function downloadIcsFile(payload: CalendarEventPayload) {
  const [year, month, day] = payload.dayString.split('-');
  const startCompact = `${year}${month}${day}T${payload.startTime.replace(':', '')}00`;
  const endCompact = `${year}${month}${day}T${payload.endTime.replace(':', '')}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EnglishMastery Pro//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${payload.summary}`,
    `DESCRIPTION:${payload.description.replace(/\n/g, '\\n')}`,
    `DTSTART:${startCompact}`,
    `DTEND:${endCompact}`,
    `LOCATION:${payload.meetLink || 'Google Meet'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `clase_ingles_${payload.dayString}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
