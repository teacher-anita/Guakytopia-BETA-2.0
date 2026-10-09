import { getAccessToken } from './firebaseAuth';

export interface EmailPayload {
  to: string;
  subject: string;
  bodyText: string;
  studentName?: string;
  classTime?: string;
}

/**
 * Builds RFC 2822 formatted email and encodes to URL-safe base64.
 */
function createRawEmail(to: string, subject: string, bodyText: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText
  ];
  const email = messageParts.join('\r\n');
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using Gmail API.
 */
export async function sendGmailEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, error: 'NO_AUTH' };
    }

    const rawMessage = createRawEmail(payload.to, payload.subject, payload.bodyText);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: rawMessage })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('Error sending email via Gmail API:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Generates email templates for automated class notifications.
 */
export function generateEmailTemplate(type: 'welcome' | 'reminder_24h' | 'reminder_1h' | 'progress_report', data: {
  studentName: string;
  levelName: string;
  book: string;
  planName: string;
  slotTime: string;
  meetLink?: string;
  unit?: number;
  xp?: number;
}) {
  switch (type) {
    case 'welcome':
      return {
        subject: `¡Bienvenido(a) a tu curso de inglés! Confirmación de plan y horario`,
        bodyText: `Hola ${data.studentName},\n\n¡Es un gusto darte la bienvenida a nuestras clases personalizadas de inglés!\n\nDetalles de tu inscripción:\n- Nivel: ${data.levelName} (${data.book})\n- Modalidad de Estudio: ${data.planName}\n- Horario reservado: ${data.slotTime}\n- Enlace de Google Meet: ${data.meetLink || 'https://meet.google.com/eng-class'}\n\nRecuerda ingresar a Google Classroom para ver los materiales y repasar tus retos diarios en la plataforma para acumular puntos XP y mantener tu racha.\n\n¡Nos vemos en clase!\nTeacher Ana Teresa Sandoval`
      };

    case 'reminder_24h':
      return {
        subject: `⏰ Recordatorio: Mañana tienes clase de inglés (${data.slotTime})`,
        bodyText: `Hola ${data.studentName},\n\nTe recordamos que mañana tenemos nuestra sesión programada:\n\n📅 Horario: ${data.slotTime}\n📚 Material sugerido: ${data.book} - Unidad ${data.unit || 1}\n🔗 Link de acceso: ${data.meetLink || 'https://meet.google.com/eng-class'}\n\nPor favor ten a mano tus notas y dudas sobre las lecciones anteriores. Si necesitas reprogramar, hazlo con al menos 6 horas de anticipación.\n\nSaludos,\nTeacher Ana Teresa`
      };

    case 'reminder_1h':
      return {
        subject: `🚀 Tu clase de inglés comienza en 1 hora`,
        bodyText: `Hola ${data.studentName},\n\nFalta solo una hora para nuestra clase personalizada.\n\n- Horario: ${data.slotTime}\n- Enlace directo a la videollamada: ${data.meetLink || 'https://meet.google.com/eng-class'}\n\nPrepárate un vaso de agua, tus audífonos y tu mejor energía para hablar en inglés.\n\n¡Nos conectamos en breve!\nTeacher Ana Teresa`
      };

    case 'progress_report':
      return {
        subject: `📊 Resumen de progreso semanal y nueva tarea - ${data.studentName}`,
        bodyText: `Hola ${data.studentName},\n\nQueremos felicitarte por el avance demostrado durante las sesiones de esta semana.\n\nResumen de tu rendimiento:\n- Nivel actual: ${data.levelName}\n- Puntos XP acumulados: ${data.xp || 120} XP\n- Unidad en progreso: Unidad ${data.unit || 1}\n\nRevisa los ejercicios asignados en Google Classroom y completa el Reto Diario de hoy para proteger tu racha de aprendizaje.\n\n¡Sigue así!\nTeacher Ana Teresa`
      };
  }
}
