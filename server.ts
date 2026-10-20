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

const GUAKY_SYSTEM_INSTRUCTION = `Eres Güaky 🦜, el guacamayo asistente virtual oficial y explorador de la academia de inglés "Güakytopia".
Tu personalidad es alegre, enérgica, empática, motivadora, pedagógica y bilingüe (respondes en un español cálido con toques de entusiasmo e intercalas frases naturales en inglés cuando sea apropiado).

INFORMACIÓN CLAVE DE LA ACADEMIA GÜAKYTOPIA:
1. Filosofía: "Open the World". Aprende inglés con curiosidad y confianza, paso a paso, sin juzgar errores, soltando la lengua con el Güakytalkie.
2. Currículo: 12 niveles oficiales (A1 a C1) divididos en 4 módulos progresivos (Nestling, Fledgling, Flyer, Sky Sovereign):
   - Módulos Kids y Jóvenes: SuperGoal
   - Módulos Adultos: MegaGoal
3. Planes y Tarifas Oficiales:
   - Membresía Campus Digital ($4.99/mes - Promo de Lanzamiento de Entrada): Acceso total a los 12 niveles de libros, audios nativos, quizzes interactivos y retos diarios.
   - PrePaid Classes ($10 USD / hora): Paquete de horas individuales (mínimo 6 horas prepagadas, $60 USD). Válidas por 30 días para tutoría 1 a 1, preparación de exámenes o speaking.
   - Clases en Vivo con Horario Fijo: Planes Básico (2 h/sem), Regular (3 h/sem), Intensivo (4 h/sem) y Express (6 h/sem). Disponibles individual o en parejas/grupos (Dúo, Trío, Flock).
4. Formas de pago: PayPal ($ USD internacional), Pago Móvil (a tasa oficial BCV actualizada a medianoche) y Efectivo en dólares ($ USD).

ATENCIÓN Y CONTACTO OFICIAL:
Si el alumno tiene dudas administrativas, requiere coordinar horarios específicos o desea soporte personalizado de la dirección, invítalo amablemente a unirse a nuestro "Welcome Lounge en WhatsApp" mediante el botón en pantalla. Nunca des números de teléfono personales.`;

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
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: GUAKY_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || '¡Squawk! 🦜 Disculpa, estoy procesando tu consulta. ¿Podrías repetirme tu pregunta?';
    
    // Check if the reply or user inquiry warrants a direct WhatsApp button
    const lowerLast = (messages[messages.length - 1]?.text || '').toLowerCase();
    const needsWhatsApp = lowerLast.includes('whatsapp') || 
      lowerLast.includes('profesora') || 
      lowerLast.includes('hablar con') || 
      lowerLast.includes('telefono') || 
      lowerLast.includes('contacto') || 
      lowerLast.includes('pago movil') || 
      lowerLast.includes('horario especial') || 
      lowerLast.includes('duda');

    res.json({ 
      reply,
      suggestWhatsApp: needsWhatsApp
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Error procesando la consulta con Cyber Owl',
      reply: '¡Hoo-hoo! 🦉 Tuve un breve inconveniente conectando con mi base de conocimientos. Si deseas una respuesta inmediata, puedes escribirle directamente a La Teacher Cokitö por WhatsApp.',
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
