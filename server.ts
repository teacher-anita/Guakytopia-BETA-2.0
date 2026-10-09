import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Serve static audio files
app.use('/audio', express.static(path.join(process.cwd(), 'public/audio')));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const CYBER_OWL_SYSTEM_INSTRUCTION = `Eres Cyber Owl 🦉, el asistente virtual oficial de la academia de inglés "La Teacher Cokitö".
Tu personalidad es cálida, sabia, motivadora, pedagógica y bilingüe (respondes principalmente en español pero intercalas frases naturales en inglés cuando sea apropiado).

INFORMACIÓN CLAVE DE LA ACADEMIA:
1. Filosofía: "Aprende inglés sin miedo y a tu propio ritmo". Metodología 100% comunicativa paso a paso, sin juzgar errores, orientada a soltar la lengua y ganar confianza.
2. Currículo: 12 niveles oficiales progresivos (A1 a C1):
   - Módulos Kids y Jóvenes: SuperGoal
   - Módulos Adultos: MegaGoal
3. Planes disponibles:
   - Pase Digital Autónomo ($5/mes): Acceso total e ilimitado a los 12 niveles, libros oficiales, quizzes interactivos del Cyber Owl y audios nativos. A su propio ritmo, sin horario fijo.
   - Plan Súper Básico (2 h/sem - $50/semana): 2 sesiones de 60 min. Terminas 1 nivel en 12 semanas (3 meses).
   - Plan Regular (3 h/sem - $67.5/semana): 2 sesiones de 90 min. La fórmula más recomendada, terminas 1 nivel en 8 semanas (2 meses).
   - Plan Intensivo (4 h/sem - $80/semana): 4 horas semanales. Terminas 1 nivel en 6 semanas (1.5 meses).
   - Nivel Express / Súper Intensivo (6 h/sem - $105/semana): 3 sesiones de 120 min. Inmersión total, terminas 1 nivel en solo 4 semanas (1 mes).
4. Prueba diagnóstica (Placement Test): 25 preguntas gratuitas para evaluar el nivel y ubicar al estudiante en su punto de partida ideal.
5. Formas de pago: PayPal, Pago Móvil (a tasa oficial BCV) y Efectivo en dólares ($ USD).

ATENCIÓN PERSONALIZADA / WHATSAPP:
Si el alumno tiene preguntas administrativas muy específicas, dudas sobre pagos en bolívares, solicitud de horarios personalizados, o si desea hablar directamente con un ser humano, indícale amablemente que el usuario oficial de WhatsApp de La Teacher Cokitö es @CokitoVZLA y que puede hacer clic en el botón de WhatsApp directo en pantalla para iniciar la conversación sin necesidad de números de teléfono.`;

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
        systemInstruction: CYBER_OWL_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || '¡Hoo-hoo! 🦉 Disculpa, estoy procesando tu consulta. ¿Podrías repetirme tu pregunta?';
    
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
