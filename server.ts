import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Serve static assets and media files
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use('/audio', express.static(path.join(process.cwd(), 'public/audio')));
app.use(express.static(path.join(process.cwd(), 'public')));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const GUAKY_SYSTEM_INSTRUCTION = `You are Güaky the Macaw (Güaky el Guacamayo Rojo 🦜), the official mascot, cultural ambassador, academic advisor, and AI English coach of "Güakytopia" (the revolutionary English learning campus).

PERSONALITY & COMMUNICATION STYLE:
- Warm, enthusiastic, encouraging, empathetic, witty, and pedagogical.
- 100% BILINGUAL FLUENCY:
  * If the user speaks or asks in ENGLISH: Respond in natural, expressive, native-level English. You can explain grammar, idioms, pronunciation, roleplay conversations, or guide them through Güakytopia in English.
  * If the user speaks or asks in SPANISH: Respond in warm, clear, Latin American / Venezuelan-friendly Spanish, naturally weaving in useful English phrases, idioms, and vocabulary.
  * If the user wants to PRACTICE CONVERSATIONAL ENGLISH: Enthusiastically take on the role of their conversation partner! Ask follow-up questions, encourage them, give gentle constructive corrections when helpful, and celebrate their streak.
- Motto: "Open the World. Start where you are. Keep going."
- Catchphrases / Touches: Occasional cheerful bird calls like "¡Squawk! 🦜", "Let's spread our wings!", "¡A soltar la lengua!".

================================================================
COMPLETE GÜAKYTOPIA KNOWLEDGE BASE
================================================================

1. GÜAKYPEDIA (THE 6 PILLARS & CORE POLICIES)
• Pillar 1: Metodología & 12 Niveles
  - Curriculum powered by McGraw Hill Education:
    * SuperGoal (SuperGoal 1 to 4): Junior / Teens / Foundation.
    * MegaGoal (MegaGoal 1 to 8): Adults / Professional / Career communication.
  - 12 CEFR-aligned levels structured into 4 Progressive Modules:
    1. Module 1: "Conquer Your Fear" (Levels I, II, III • Beginner A1 to Elementary A2).
    2. Module 2: "Build Your Voice" (Levels IV, V, VI • Pre-Intermediate to Intermediate B1).
    3. Module 3: "Expand Your Horizon" (Levels VII, VIII, IX • Upper-Intermediate B2).
    4. Module 4: "Master Your World" (Levels X, XI, XII • Advanced C1/C2).
  - Micro-chunking: Short, high-retention sessions without cognitive fatigue.
  - 8-Phase Classroom lesson structure:
    1. Warm-up & Contextual hook
    2. Vocabulary & Grammar Spark
    3. Native Audio Immersion
    4. Controlled Drills
    5. Guided Speaking & Pronunciation
    6. Collaborative / Real-life communicative task
    7. Unit Quiz (requires at least 70% to unlock next unit)
    8. Habit Reflection & XP celebration
  - Lab Güakytalkie: 100 graduated drills per unit for listening, pronunciation, sentence building, and grammar.
  - Boss Fights & Assessments: Milestone challenges (>80% required on final level assessments) awarding special badges.

• Pillar 2: Modalidades, Tarifas & Hour Bag
  - Pase Digital ($4.99 USD / mes):
    * Promo de lanzamiento de entrada para aprendizaje 100% autónomo.
    * Acceso total a los 12 niveles, student books, workbooks, audios nativos, 100 lab drills por unidad, unit quizzes y The Flock Arena.
  - Hour Bag (Bolsa de Horas Prepagadas):
    * $10 USD por hora. Compra mínima: paquete de 6 horas = $60 USD.
    * Validez: 30 días continuos desde la fecha de compra.
    * Tutoría privada 1 a 1 para speaking, preparación de exámenes o revisión curricular.
    * "Escudo de las 12 Horas" (12-Hour Shield): Beneficio exclusivo que permite reprogramar 1 sesión al mes avisando con solo 12 horas de anticipación (la cancelación estándar requiere 24 horas).
    * Política de emergencia en sesión: Si una clase de 60 min se interrumpe antes del minuto 45 por causa de fuerza mayor, se compensa un bloque de 15 min de crédito. Después del minuto 45 la clase se considera completada.
  - Planes Fijos Mensuales (Clases en Vivo con Mentor):
    * Básico (2 h/sem), Regular (3 h/sem), Intensivo (4 h/sem), Express (6 h/sem).
    * Modalidades: Individual, Dúo (compartir tarifa con pareja o amigo), Trío o Flock Squad.
    * Horarios fijos reservados en agenda. Política de pausa temporal de hasta 15 días con aviso previo.
  - Seven Day Pass: Pase de cortesía de 7 días con inducción los lunes (4:00 PM o 7:00 PM VET vía Google Meet) y clase modelo a solicitud.
  - Formas de Pago Oficiales:
    * PayPal ($ USD internacional).
    * Pago Móvil: En bolívares a tasa oficial del Banco Central de Venezuela (BCV), actualizada automáticamente a medianoche.
    * Efectivo en dólares ($ USD).

• Pillar 3: FAQ & Rutinas de Alumnos
  - Se puede empezar desde cero (Nivel 1) o presentar la prueba diagnóstica opcional de 50 preguntas.
  - Selector Adult / Junior: Adapta el tema visual (sombrerito para adultos, JR con cohete para junior) sin alterar el récord académico ni el nivel.
  - Ambientes de estudio (Theme selector): Walkitalkie Oficial, Calma Menta, Soft Bloom, Hyperfocus Dark.
  - Fórmula ideal de estudio: 4 horas semanales recomendadas (ej. 2 horas de clase con teacher + 2 horas de Lab y audios).
  - Unidades bloqueadas: Se desbloquean al aprobar el Unit Quiz previo con un mínimo de 70%.

• Pillar 4: Teachers & Mentorship
  - Los profesores cuentan con panel privado con candado para registrar asistencia, gestionar slots de Google Meet, evaluar dossiers y asignar XP.

• Pillar 5: Soporte Técnico
  - Audios: Comprobar volumen y permisos del navegador.
  - Sincronización: El progreso se respalda en la nube y sincroniza automáticamente.

• Pillar 6: Glosario & Checklist del Día 1
  - Checklist: 1. Conocer Home, 2. Elegir tema de ambiente, 3. Abrir Hub/Pathway, 4. Explorar Classroom de 8 fases, 5. Resolver 5 drills en el Lab, 6. Jugar en la Arena, 7. Asistir a la Inducción de los Lunes.
  - Conceptos clave: Academic Library, Agenda, Boss Fight, Classroom, Cokitö (el cerebro pedagógico), Daily Missions, Daily Streak (Racha), Drill, Escudo de 12h, Flock, Güaky, Güakytalkie, Hour Bag, Hub, Mastery, Pase Digital, Seven Day Pass, Unit Quiz, XP.

2. THE HUB (LEARNING PATHWAY)
• Centro neurálgico con los 12 niveles de inglés alineados al marco CEFR (A1 a C2).
• Libros oficiales SuperGoal 1-4 y MegaGoal 1-8 con Student Book y Workbook integrados (códigos SG01-SB-U01, SG01-WB-U01, etc.).
• Cada unidad incluye 3 sesiones guiadas (A, B, C), pistas de audio nativas, gramática enfocada y vocabulario temático.
• Owl Culture Corner: Anécdotas culturales, modismos y reglas prácticas (como las preposiciones "in, on, at").
• Tips Cokitö: Reglas mnemotécnicas y trucos cognitivos para acelerar la fluidez.

3. THE ARENA (GAMIFICACIÓN, LEAGUE & ARCADE)
• 3 Daily Quests (Misiones Diarias): Micro-retos diarios de fonética/saludos, gramática y modismos conversacionales que otorgan 15, 20 y 25 XP.
• Racha Diaria (Daily Streak): Contador de días continuos de estudio para forjar el hábito sin romper la cadena.
• Cokitö League & Leaderboards: Tabla de posiciones en vivo con el cuadro de honor de alumnos inscritos y exploradores generales clasificados por XP acumulados.
• Arcade Games:
  * "WW: Where's Güaky?": Juego interactivo de estilo wimmelbild ochentero donde el alumno busca a Güaky y objetos del vocabulario curricular en escenas ilustradas vibrantes.
  * Word Scramble: Desafío de agilidad mental para ordenar letras y formar vocabulario en inglés contra reloj.
  * Vocab Match: Emparejamiento veloz de palabras en inglés con su significado e imagen.
  * Hangman (Ahorcado): Clásico juego de adivinar la palabra con pistas contextuales y fonéticas.
• Cuenta Gamer (Gamer Account): Registro rápido para jugadores de la Arena que preserva vidas, racha y puntos XP.

4. ATENCIÓN OFICIAL & COMUNIDAD:
• Welcome Lounge en WhatsApp: Espacio oficial de bienvenida y soporte directo con La Teacher Cokitö (CokitöVZLA).
• Inducciones en vivo los lunes a las 4:00 PM y 7:00 PM (hora de Venezuela, VET) por Google Meet.
• Cuando un alumno tenga dudas de inscripción, horarios a medida, soporte administrativo o verificación de pagos, recomiéndale cordialmente conectarse al Welcome Lounge en WhatsApp a través del botón en pantalla. Nunca inventes números telefónicos personales.`;

// Official BCV Exchange Rate Service
interface BcvCache {
  rate: number;
  source: string;
  effectiveDate: string;
  fechaActualizacion: string;
  lastChecked: string;
  status: 'official' | 'cached' | 'fallback';
}

let bcvCache: BcvCache = {
  rate: 875.65,
  source: 'Banco Central de Venezuela (BCV)',
  effectiveDate: new Date().toISOString().split('T')[0],
  fechaActualizacion: new Date().toISOString(),
  lastChecked: new Date().toISOString(),
  status: 'fallback'
};

async function fetchBcvRateFromSource(): Promise<BcvCache> {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Guakytopia-Academic-Portal' },
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.promedio === 'number' && data.promedio > 0) {
        bcvCache = {
          rate: Number(data.promedio.toFixed(4)),
          source: 'Banco Central de Venezuela (BCV)',
          effectiveDate: data.fechaActualizacion ? data.fechaActualizacion.split('T')[0] : new Date().toISOString().split('T')[0],
          fechaActualizacion: data.fechaActualizacion || new Date().toISOString(),
          lastChecked: new Date().toISOString(),
          status: 'official'
        };
        console.log(`[BCV] Official rate updated: Bs. ${bcvCache.rate} (Vigente: ${bcvCache.effectiveDate})`);
        return bcvCache;
      }
    }
  } catch (error) {
    console.warn('[BCV] Warning fetching official rate, using cached:', error);
  }
  bcvCache.lastChecked = new Date().toISOString();
  return bcvCache;
}

function getMsUntilMidnightVET(): number {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vetOffsetMs = -4 * 60 * 60 * 1000; // Venezuela is UTC-4
  const vetTime = new Date(utcMs + vetOffsetMs);
  
  const nextMidnightVET = new Date(vetTime);
  nextMidnightVET.setDate(nextMidnightVET.getDate() + 1);
  nextMidnightVET.setHours(0, 0, 5, 0); // 12:00:05 AM in Venezuela
  
  const msDiff = nextMidnightVET.getTime() - vetTime.getTime();
  return msDiff > 0 ? msDiff : 24 * 60 * 60 * 1000;
}

function scheduleMidnightBcvFetch() {
  const ms = getMsUntilMidnightVET();
  console.log(`[BCV] Automatic midnight sync scheduled in ${(ms / 3600000).toFixed(2)} hours (12:00:05 AM VET)`);
  setTimeout(async () => {
    console.log('[BCV] 12:00 AM Midnight in Venezuela reached! Executing automated daily rate update...');
    await fetchBcvRateFromSource();
    scheduleMidnightBcvFetch();
  }, ms);
}

// Initial fetch and scheduled jobs
fetchBcvRateFromSource();
scheduleMidnightBcvFetch();
// Safety hourly poll to guarantee parity with afternoon announcements
setInterval(() => {
  fetchBcvRateFromSource();
}, 60 * 60 * 1000);

// Endpoint to retrieve current official BCV rate
app.get('/api/bcv', async (_req: Request, res: Response) => {
  res.json({
    ...bcvCache,
    nextMidnightInHours: Number((getMsUntilMidnightVET() / 3600000).toFixed(2))
  });
});

// Endpoint for Principal Waky to force an immediate re-sync with BCV
app.post('/api/bcv/sync', async (_req: Request, res: Response) => {
  const fresh = await fetchBcvRateFromSource();
  res.json({
    ...fresh,
    message: 'Tasa BCV sincronizada directamente con la fuente oficial.',
    nextMidnightInHours: Number((getMsUntilMidnightVET() / 3600000).toFixed(2))
  });
});

// Coupons Backend Persistence & Real-time Mirror
const COUPONS_FILE = path.join(process.cwd(), 'coupons-data.json');
let serverCouponsCache: any[] = [];
try {
  if (fs.existsSync(COUPONS_FILE)) {
    const raw = fs.readFileSync(COUPONS_FILE, 'utf-8');
    serverCouponsCache = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[Coupons] Could not read coupons-data.json:', e);
}

function persistServerCoupons() {
  try {
    fs.writeFileSync(COUPONS_FILE, JSON.stringify(serverCouponsCache, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Coupons] Could not write coupons-data.json:', e);
  }
}

app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json(serverCouponsCache);
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const coupon = req.body;
  if (!coupon || !coupon.code) {
    return res.status(400).json({ error: 'Código de cupón requerido' });
  }
  const cleanCode = String(coupon.code).trim().toUpperCase();
  const existingIdx = serverCouponsCache.findIndex(c => c.id === coupon.id || c.code.toUpperCase() === cleanCode);
  if (existingIdx >= 0) {
    serverCouponsCache[existingIdx] = { ...serverCouponsCache[existingIdx], ...coupon };
  } else {
    serverCouponsCache.unshift(coupon);
  }
  persistServerCoupons();
  res.json({ success: true, coupon });
});

app.post('/api/coupons/:id/redeem', (req: Request, res: Response) => {
  const { id } = req.params;
  const cleanId = String(id).toUpperCase();
  const target = serverCouponsCache.find(c => c.id === id || c.code.toUpperCase() === cleanId);
  if (target) {
    target.currentUses = (target.currentUses || 0) + 1;
    persistServerCoupons();
    return res.json({ success: true, currentUses: target.currentUses });
  }
  res.json({ success: true });
});

app.delete('/api/coupons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  serverCouponsCache = serverCouponsCache.filter(c => c.id !== id);
  persistServerCoupons();
  res.json({ success: true });
});

// Students Backend Dual Persistence Mirror
const STUDENTS_FILE = path.join(process.cwd(), 'students-data.json');
const DELETED_STUDENTS_FILE = path.join(process.cwd(), 'deleted-students.json');

const INITIAL_DELETED_STUDENTS = [
  'student_carla_lira',
  'student_vanesa',
  'student_ragni_ali_new',
  'student_genesis',
  'student_ana_sandoval',
  'student_1791620647859',
  'student_aspirante',
  'student_mariana'
];

let serverDeletedCache: string[] = [...INITIAL_DELETED_STUDENTS];
try {
  if (fs.existsSync(DELETED_STUDENTS_FILE)) {
    const raw = fs.readFileSync(DELETED_STUDENTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      serverDeletedCache = Array.from(new Set([...serverDeletedCache, ...parsed]));
    }
  } else {
    fs.writeFileSync(DELETED_STUDENTS_FILE, JSON.stringify(serverDeletedCache, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('[Students] Could not read deleted-students.json:', e);
}

let serverStudentsCache: any[] = [];
try {
  if (fs.existsSync(STUDENTS_FILE)) {
    const raw = fs.readFileSync(STUDENTS_FILE, 'utf-8');
    serverStudentsCache = JSON.parse(raw);
    if (Array.isArray(serverStudentsCache)) {
      serverStudentsCache = serverStudentsCache.filter(s => s && s.id && !serverDeletedCache.includes(s.id));
    }
  }
} catch (e) {
  console.warn('[Students] Could not read students-data.json:', e);
}

function persistServerStudents() {
  try {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(serverStudentsCache, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Students] Could not write students-data.json:', e);
  }
}

app.get('/api/students', (_req: Request, res: Response) => {
  res.json(serverStudentsCache.filter(s => s && s.id && !serverDeletedCache.includes(s.id)));
});

app.get('/api/students/deleted', (_req: Request, res: Response) => {
  res.json(serverDeletedCache);
});

app.post('/api/students', (req: Request, res: Response) => {
  const student = req.body;
  if (!student || !student.id) {
    return res.status(400).json({ error: 'ID de alumno requerido' });
  }
  // If student was marked deleted but is being re-saved, remove from deleted
  serverDeletedCache = serverDeletedCache.filter(id => id !== student.id);
  try {
    fs.writeFileSync(DELETED_STUDENTS_FILE, JSON.stringify(serverDeletedCache, null, 2), 'utf-8');
  } catch {}

  const existingIdx = serverStudentsCache.findIndex(s => s.id === student.id);
  if (existingIdx >= 0) {
    serverStudentsCache[existingIdx] = { ...serverStudentsCache[existingIdx], ...student };
  } else {
    serverStudentsCache.unshift(student);
  }
  persistServerStudents();
  res.json({ success: true, student: serverStudentsCache[existingIdx >= 0 ? existingIdx : 0] });
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  serverStudentsCache = serverStudentsCache.filter(s => s.id !== id);
  if (!serverDeletedCache.includes(id)) {
    serverDeletedCache.push(id);
    try {
      fs.writeFileSync(DELETED_STUDENTS_FILE, JSON.stringify(serverDeletedCache, null, 2), 'utf-8');
    } catch {}
  }
  persistServerStudents();
  res.json({ success: true, deletedId: id });
});

// SLOTS PERSISTENCE
const SLOTS_FILE = path.join(process.cwd(), 'slots-data.json');
let serverSlotsCache: any[] = [];
try {
  if (fs.existsSync(SLOTS_FILE)) {
    const raw = fs.readFileSync(SLOTS_FILE, 'utf-8');
    serverSlotsCache = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[Slots] Could not read slots-data.json:', e);
}

function persistServerSlots() {
  try {
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(serverSlotsCache, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Slots] Could not write slots-data.json:', e);
  }
}

app.get('/api/slots', (_req: Request, res: Response) => {
  res.json(serverSlotsCache);
});

app.post('/api/slots', (req: Request, res: Response) => {
  const incoming = req.body;
  if (Array.isArray(incoming)) {
    serverSlotsCache = incoming;
    persistServerSlots();
    return res.json({ success: true, count: serverSlotsCache.length });
  } else if (incoming && incoming.id) {
    const idx = serverSlotsCache.findIndex(s => s.id === incoming.id);
    if (idx >= 0) {
      serverSlotsCache[idx] = { ...serverSlotsCache[idx], ...incoming };
    } else {
      serverSlotsCache.push(incoming);
    }
    persistServerSlots();
    return res.json({ success: true, slot: incoming });
  }
  res.status(400).json({ error: 'Formato de slots inválido' });
});

// Endpoint for Gemini multi-turn chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Se requiere un arreglo de mensajes.' });
    }

    // Prepare contents formatted for Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text || '') }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: GUAKY_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || '¡Squawk! 🦜 Disculpa, estoy procesando tu consulta. ¿Podrías repetirme tu pregunta? / Excuse me, could you repeat your question?';
    
    // Check if the reply or user inquiry warrants a direct WhatsApp button
    const lowerLast = (messages[messages.length - 1]?.text || '').toLowerCase();
    const needsWhatsApp = lowerLast.includes('whatsapp') || 
      lowerLast.includes('profesora') || 
      lowerLast.includes('teacher') || 
      lowerLast.includes('hablar con') || 
      lowerLast.includes('telefono') || 
      lowerLast.includes('contacto') || 
      lowerLast.includes('pago movil') || 
      lowerLast.includes('horario especial') || 
      lowerLast.includes('inscrib') || 
      lowerLast.includes('transferencia') || 
      lowerLast.includes('lounge') || 
      lowerLast.includes('duda');

    res.json({ 
      reply,
      suggestWhatsApp: needsWhatsApp
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Error procesando la consulta con Güaky',
      reply: '¡Squawk! 🦜 Tuve un breve inconveniente conectando con mi base de conocimientos. Si deseas una respuesta inmediata o coordinar con la academia, puedes unirte directamente a nuestro Welcome Lounge en WhatsApp.',
      suggestWhatsApp: true
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const port = 3000;

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
