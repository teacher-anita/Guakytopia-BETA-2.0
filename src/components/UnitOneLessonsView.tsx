import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Award,
  Download,
  FileText,
  FolderOpen
} from 'lucide-react';
import { Student } from '../types';
import { downloadUnitPdf, downloadUnitAudio } from '../services/materialDownloader';

interface UnitOneLessonsViewProps {
  currentStudent: Student | null;
  onAwardXp: (studentId: string, amount: number) => void;
  onPlayTrack: (trackIndex: number) => void;
  onGoToLab?: () => void;
}

interface SectionCheck {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const UnitOneLessonsView: React.FC<UnitOneLessonsViewProps> = ({
  currentStudent,
  onAwardXp,
  onPlayTrack,
  onGoToLab
}) => {
  // Answers state for quick section checks
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});
  const [activeSectionId, setActiveSectionId] = useState<number>(1);

  const handleSelectAnswer = (questionId: string, option: string, correct: string) => {
    const isCorrect = option.toLowerCase() === correct.toLowerCase();
    const wasAlreadyCorrect = answers[questionId]?.isCorrect;

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        selected: option,
        isCorrect
      }
    }));

    if (isCorrect && !wasAlreadyCorrect && currentStudent) {
      onAwardXp(currentStudent.id, 10);
    }
  };

  const sections = [
    {
      id: 1,
      title: '1. Listen and Discuss',
      subtitle: 'Greetings, Saying Goodbye & Introductions',
      pages: 'Pages 2–3',
      trackIndex: 1, // Track 02
      trackName: 'Track 02 (Listen and Discuss)',
      audioSrc: '/audio/supergoal1/track02.mp3',
      summary: 'Learn how to greet people at different times of the day, say farewell politely, and introduce yourself and others.',
      teacherExplanation: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Welcome to Unit 1! In English, our greetings depend strictly on the <strong>time of day</strong> and whether the situation is <strong>formal</strong> or <strong>informal</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Time-Based Greetings (Hello):</span>
              </span>
              <ul className="space-y-1 text-slate-700">
                <li><strong>Good morning:</strong> Sunrise until 12:00 PM (Noon).</li>
                <li><strong>Good afternoon:</strong> 12:00 PM until ~5:00 PM / 6:00 PM.</li>
                <li><strong>Good evening:</strong> 6:00 PM until late night (Used to say HELLO).</li>
              </ul>
            </div>

            <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
              <span className="font-bold text-indigo-900 block flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Farewells & Night Rules:</span>
              </span>
              <ul className="space-y-1 text-slate-700">
                <li><strong>Good night:</strong> Only used to say GOODBYE before going to sleep or parting late at night.</li>
                <li><strong>Goodbye / Bye / Take care:</strong> Universal friendly farewells.</li>
                <li><strong>See you later / See you tomorrow:</strong> When you will meet again soon.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-950 flex items-start gap-2">
            <span className="text-lg">🦉</span>
            <div>
              <strong>Courtesy Titles (Títulos de Cortesía):</strong>
              <p className="mt-0.5">
                Use <strong>Mr.</strong> (Mister) for adult men. Use <strong>Mrs.</strong> for married women. Use <strong>Miss</strong> for unmarried young women. Use <strong>Ms.</strong> (Mizz) when marital status is unspecified or neutral.
              </p>
            </div>
          </div>
        </div>
      ),
      checks: [
        {
          id: 's1_q1',
          question: 'It is 8:30 AM and you arrive at class. What greeting do you give your teacher?',
          options: ['Good morning', 'Good afternoon', 'Good night', 'Good evening'],
          correct: 'Good morning',
          explanation: '"Good morning" is used before 12:00 noon.'
        },
        {
          id: 's1_q2',
          question: 'You attend a dinner party at 7:00 PM. What do you say when entering the door?',
          options: ['Good evening', 'Good night', 'Goodbye', 'See you later'],
          correct: 'Good evening',
          explanation: 'Never say "Good night" upon arrival! "Good evening" is hello at night.'
        },
        {
          id: 's1_q3',
          question: 'Which title of courtesy is used for a male teacher?',
          options: ['Mr.', 'Mrs.', 'Miss', 'Ms.'],
          correct: 'Mr.',
          explanation: '"Mr." is used for an adult man, married or single.'
        }
      ]
    },
    {
      id: 2,
      title: '2. Pair Work & Introductions',
      subtitle: 'Introducing Friends, Asking Names & Nicknames',
      pages: 'Page 3',
      trackIndex: 2, // Track 03
      trackName: 'Track 03 (Pair Work)',
      audioSrc: '/audio/supergoal1/track03.mp3',
      summary: 'Practice conversational exchanges: asking someone\'s name, giving your nickname, and introducing a third person.',
      teacherExplanation: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            In Super Goal 1 (Track 03), students practice natural introductions using three core formulas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
              <strong className="text-blue-900 block font-bold text-xs uppercase tracking-wider">
                1. Asking Names:
              </strong>
              <p className="text-slate-800">
                <em>"What's your name?"</em><br/>
                <em>"My name's Mona."</em>
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <strong className="text-emerald-900 block font-bold text-xs uppercase tracking-wider">
                2. Giving Nicknames:
              </strong>
              <p className="text-slate-800">
                <em>"I'm Michael. But my friends call me Mike."</em>
              </p>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
              <strong className="text-purple-900 block font-bold text-xs uppercase tracking-wider">
                3. Introducing Others:
              </strong>
              <p className="text-slate-800">
                <em>"Asma, this is my friend Hanan."</em><br/>
                <em>"Nice to meet you."</em>
              </p>
            </div>
          </div>

          <p>
            Always answer <em>"Nice to meet you"</em> with <strong>"Nice to meet you, too"</strong>! The word "too" shows reciprocity.
          </p>
        </div>
      ),
      checks: [
        {
          id: 's2_q1',
          question: 'How do you introduce your friend Carlos to Rick?',
          options: ['Rick, this is my friend Carlos.', 'Rick, he are Carlos.', 'Rick, Carlos you are.', 'Rick, friend Carlos.'],
          correct: 'Rick, this is my friend Carlos.',
          explanation: 'Use the phrase "This is my friend [Name]" for introductions.'
        },
        {
          id: 's2_q2',
          question: 'Someone says to you: "Nice to meet you!" — What is your reply?',
          options: ['Nice to meet you, too.', 'Good night.', 'I am fine.', 'My name is student.'],
          correct: 'Nice to meet you, too.',
          explanation: 'Add "too" to return the polite greeting.'
        }
      ]
    },
    {
      id: 3,
      title: '3. Grammar Focus: The Verb "BE"',
      subtitle: 'Simple Present, Contractions & Questions',
      pages: 'Page 4',
      trackIndex: 2,
      trackName: 'Grammar Reference',
      summary: 'Master the forms of BE (am, is, are), short answers, and contractions used in spoken American English.',
      teacherExplanation: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            The verb <strong>be</strong> (ser o estar) changes form according to the subject pronoun. In everyday spoken English, native speakers almost always use <strong>contractions</strong>:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-2.5 border border-slate-200">Subject Pronoun</th>
                  <th className="p-2.5 border border-slate-200">Full Form</th>
                  <th className="p-2.5 border border-slate-200">Contraction</th>
                  <th className="p-2.5 border border-slate-200">Negative Contraction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">I</td>
                  <td className="p-2 border border-slate-200">I am</td>
                  <td className="p-2 border border-slate-200 text-indigo-700 font-bold">I'm</td>
                  <td className="p-2 border border-slate-200">I'm not</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">You</td>
                  <td className="p-2 border border-slate-200">You are</td>
                  <td className="p-2 border border-slate-200 text-indigo-700 font-bold">You're</td>
                  <td className="p-2 border border-slate-200">You aren't</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">He / She / It</td>
                  <td className="p-2 border border-slate-200">He / She is</td>
                  <td className="p-2 border border-slate-200 text-indigo-700 font-bold">He's / She's / It's</td>
                  <td className="p-2 border border-slate-200">He / She isn't</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">We / They</td>
                  <td className="p-2 border border-slate-200">We / They are</td>
                  <td className="p-2 border border-slate-200 text-indigo-700 font-bold">We're / They're</td>
                  <td className="p-2 border border-slate-200">We / They aren't</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-950 space-y-1">
            <strong className="text-red-900 block font-bold text-xs uppercase tracking-wider">
              ⚠️ Golden Rule of Short Answers:
            </strong>
            <p>
              In short affirmative answers, you <strong>NEVER</strong> contract the verb:
              <br/>
              ✅ <em>"Yes, I am."</em> (NOT ❌ "Yes, I'm.")
              <br/>
              ✅ <em>"Yes, they are."</em> (NOT ❌ "Yes, they're.")
            </p>
          </div>
        </div>
      ),
      checks: [
        {
          id: 's3_q1',
          question: 'Complete: "They ______ new students at Cokitö Academy."',
          options: ['are', 'is', 'am', 'be'],
          correct: 'are',
          explanation: '"They" is plural and requires the verb "are".'
        },
        {
          id: 's3_q2',
          question: 'Are you from Colombia? — Short affirmative answer:',
          options: ['Yes, I am.', 'Yes, I\'m.', 'Yes, I are.', 'Yes, me am.'],
          correct: 'Yes, I am.',
          explanation: 'Never contract in short affirmative answers! Always say "Yes, I am."'
        },
        {
          id: 's3_q3',
          question: 'Negative sentence: "He ______ my brother. He is my classmate."',
          options: ['isn\'t', 'aren\'t', 'am not', 'not is'],
          correct: 'isn\'t',
          explanation: 'Contraction of "is not" for third person singular is "isn\'t".'
        }
      ]
    },
    {
      id: 4,
      title: '4. Possessive Adjectives',
      subtitle: 'My, Your, His, Her, Our, Their',
      pages: 'Page 4',
      trackIndex: 2,
      trackName: 'Grammar Focus',
      summary: 'Express ownership and relationship with possessive adjectives.',
      teacherExplanation: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Possessive adjectives come before the noun to show who owns or is connected to something:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900">I ➔ My</span>
              <p className="text-slate-500 mt-0.5">My name</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900">You ➔ Your</span>
              <p className="text-slate-500 mt-0.5">Your book</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900">He ➔ His</span>
              <p className="text-slate-500 mt-0.5">His pen (male)</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900">She ➔ Her</span>
              <p className="text-slate-500 mt-0.5">Her car (female)</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950">
            <strong>Don't confuse:</strong>
            <p className="mt-0.5">
              <strong>Your</strong> = Possessive (<em>What is your name?</em>)<br/>
              <strong>You're</strong> = Contraction of You are (<em>You're a student.</em>)
            </p>
          </div>
        </div>
      ),
      checks: [
        {
          id: 's4_q1',
          question: 'Look at Michael. ______ backpack is green.',
          options: ['His', 'Her', 'Your', 'Their'],
          correct: 'His',
          explanation: 'Michael is male, so we use "His".'
        },
        {
          id: 's4_q2',
          question: 'Mona is reading. ______ notebook is on the desk.',
          options: ['Her', 'His', 'My', 'Our'],
          correct: 'Her',
          explanation: 'Mona is female, so we use "Her".'
        }
      ]
    },
    {
      id: 5,
      title: '5. Pronunciation & Sentence Intonation',
      subtitle: 'Falling Intonation in WH-Questions (↘)',
      pages: 'Page 5',
      trackIndex: 3, // Track 04
      trackName: 'Track 04 (Pronunciation)',
      audioSrc: '/audio/supergoal1/track04.mp3',
      summary: 'Learn the natural melodic pitch of American English when asking questions.',
      teacherExplanation: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            English is a musical language! In Super Goal 1 (Track 04), listen carefully to how the pitch of the voice changes:
          </p>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
            <strong className="text-blue-900 block font-bold text-xs uppercase tracking-wider">
              Falling Intonation (↘) in Information Questions:
            </strong>
            <ul className="space-y-2 text-slate-800">
              <li className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-blue-600">↘</span>
                <span><em>"What's your name?"</em> (The pitch drops at the end).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-blue-600">↘</span>
                <span><em>"How are you?"</em> (Falling pitch).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-blue-600">↘</span>
                <span><em>"How's it going?"</em> (Falling pitch).</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      checks: [
        {
          id: 's5_q1',
          question: 'In English, what happens to the intonation at the end of "What\'s your name?"',
          options: ['It goes DOWN (Falling intonation ↘)', 'It squeaks UP like a siren ↗', 'It stays totally monotone', 'It is whispered'],
          correct: 'It goes DOWN (Falling intonation ↘)',
          explanation: 'WH-questions take falling intonation in standard English.'
        }
      ]
    },
    {
      id: 6,
      title: '6. Listening Quiz & Auditory Practice',
      subtitle: 'Active Listening for Situational Context',
      pages: 'Page 5',
      trackIndex: 4, // Track 05
      trackName: 'Track 05 (Listening Quiz)',
      audioSrc: '/audio/supergoal1/track05.mp3',
      summary: 'Train your ear to identify relationships, times of day, and polite responses in real audio.',
      teacherExplanation: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            When listening to Track 05, don't try to translate every single word into Spanish! Instead, use these 3 Teacher Cokitö strategies:
          </p>
          <ol className="space-y-1.5 list-decimal list-inside text-slate-700">
            <li><strong>Listen for keywords:</strong> Words like "morning", "afternoon", "meet", "friend".</li>
            <li><strong>Notice background clues:</strong> Bell ringing, school hallway, street sounds.</li>
            <li><strong>Identify tone:</strong> Friendly, hurried, casual, formal.</li>
          </ol>
        </div>
      ),
      checks: [
        {
          id: 's6_q1',
          question: 'When listening to conversations, should you translate every word into Spanish in your head?',
          options: [
            'No, listen for key ideas and overall context directly in English.',
            'Yes, write down every single word in Spanish.',
            'Ignore the audio completely.',
            'Wait until the speaker stops talking to think.'
          ],
          correct: 'No, listen for key ideas and overall context directly in English.',
          explanation: 'Direct immersion without word-by-word mental translation builds true fluency!'
        }
      ]
    },
    {
      id: 7,
      title: '7. Conversation in Context',
      subtitle: 'Academic Social Situations & Real Dialogue',
      pages: 'Page 6',
      trackIndex: 5, // Track 06
      trackName: 'Track 06 (Conversation)',
      audioSrc: '/audio/supergoal1/track06.mp3',
      summary: 'Follow the conversation between students meeting in the classroom hallway.',
      teacherExplanation: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            In Track 06, Carlos and Rick meet at school. Notice the natural rhythm:
          </p>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs space-y-1">
            <p><strong>Carlos:</strong> Are you a new student?</p>
            <p><strong>Rick:</strong> Yes, I am. My name is Rick.</p>
            <p><strong>Carlos:</strong> Welcome to the academy! I'm Carlos.</p>
          </div>
          <p>
            Notice how Carlos uses <em>"Welcome to..."</em> to make the new student feel comfortable.
          </p>
        </div>
      ),
      checks: [
        {
          id: 's7_q1',
          question: 'Complete the welcoming phrase: "Welcome ______ Cokitö Academy!"',
          options: ['to', 'at', 'in', 'for'],
          correct: 'to',
          explanation: 'We always say "Welcome TO [place]".'
        }
      ]
    },
    {
      id: 8,
      title: '8. Reading & Vocabulary',
      subtitle: 'Greetings Around the World & Classroom Supplies',
      pages: 'Pages 7–8',
      trackIndex: 6, // Track 07
      trackName: 'Track 07 (Reading)',
      audioSrc: '/audio/supergoal1/track07.mp3',
      summary: 'Explore body language, handshakes, bows, and learn essential classroom vocabulary.',
      teacherExplanation: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            In English-speaking countries, a <strong>firm handshake</strong> with direct <strong>eye contact</strong> and a warm smile is the standard greeting in professional and academic settings.
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
            <strong>Classroom Vocabulary Checklist:</strong>
            <p>
              Pen, Pencil, Eraser, Notebook, Book, Backpack, Desk, Ruler, Scissors.
            </p>
          </div>
        </div>
      ),
      checks: [
        {
          id: 's8_q1',
          question: 'What is the standard professional greeting body language in the United States?',
          options: ['A firm handshake with eye contact and a smile', 'Turning your back', 'Bowing to the floor', 'No reaction at all'],
          correct: 'A firm handshake with eye contact and a smile',
          explanation: 'Handshake + eye contact + smile is the universal standard in North America.'
        }
      ]
    }
  ];

  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white border border-blue-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Virtual Teacher Interactive Lessons
            </span>
            <span className="text-xs font-bold text-blue-200">
              Super Goal 1 • Student Book (pp. 2–9)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Explanations & Guided Practice for Every Section
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            The platform works as your teacher! Read concise explanations, listen to official audio recordings, and solve check drills.
          </p>
        </div>

        {/* Direct Link to the 100-Drill Lab */}
        {onGoToLab && (
          <button
            onClick={onGoToLab}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-transform hover:scale-102 shrink-0"
          >
            <span>🧪 Jump to Language Lab (100 Drills)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* AVISO DESTACADO: DESCARGA PREVIA OBLIGATORIA DEL MATERIAL DE LA UNIDAD 1 */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-3xl p-5 text-slate-950 border border-amber-300 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                📥 Descarga Previa al Estudio
              </span>
              <strong className="text-xs sm:text-sm font-black text-slate-950">
                Descarga tu Guía y Libro de la Unidad 1 antes de comenzar las lecciones
              </strong>
            </div>
            <p className="text-xs text-slate-900 font-medium max-w-2xl leading-snug">
              Para seguir las 8 secciones guiadas con La Teacher Cokitö, resolver los ejercicios interactivos y tus tareas, descarga el archivo en PDF oficial de la unidad (Student Book pp. 2–9 y Workbook pp. 89–92).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto shrink-0">
          <button
            onClick={() => downloadUnitPdf('level_1', 1, 'Good Morning!', 'student_book')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            title="Abrir SG01-SB-U01 (Student Book oficial en Google Drive)"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>SG01-SB-U01 • Student Book</span>
          </button>

          <button
            onClick={() => downloadUnitPdf('level_1', 1, 'Good Morning!', 'workbook')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 border-2 border-slate-900 rounded-xl text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-1.5"
            title="Abrir SG01-WB-U01 (Workbook oficial en Google Drive)"
          >
            <FileText className="w-4 h-4 text-slate-900" />
            <span>SG01-WB-U01 • Workbook</span>
          </button>

          <a
            href="https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            title="Abrir Carpeta General de Drive Nivel 1"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Carpeta Drive</span>
          </a>

          <button
            onClick={() => downloadUnitAudio(2)}
            className="flex-1 sm:flex-none px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Audios CD1</span>
          </button>
        </div>
      </div>

      {/* 2. Section Selector Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {sections.map(sec => {
          const isSelected = sec.id === activeSectionId;
          const sectionSolvedCount = sec.checks.filter(c => answers[c.id]?.isCorrect).length;
          const isCompleted = sectionSolvedCount === sec.checks.length;

          return (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                <span>Sec {sec.id}</span>
                {isCompleted && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-500'}`} />
                )}
              </div>
              <div className="text-xs font-bold truncate">{sec.title.split('. ')[1] || sec.title}</div>
              <div className={`text-[10px] mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {sec.pages}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Active Section Workspace */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {currentSection.pages}
              </span>
              <span className="text-xs text-slate-400">• McGraw-Hill Official Syllabus</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {currentSection.title}: {currentSection.subtitle}
            </h3>
            <p className="text-xs text-slate-500">
              {currentSection.summary}
            </p>
          </div>

          {/* Audio Player Button */}
          {currentSection.audioSrc && (
            <button
              onClick={() => onPlayTrack(currentSection.trackIndex)}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all shrink-0"
              title="Play official CD1 audio recording for this section"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Listen: {currentSection.trackName}</span>
            </button>
          )}
        </div>

        {/* Teacher Cokitö Explanation Card */}
        <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            <span className="text-xl">👩‍🏫</span>
            <span>Teacher Cokitö's Classroom Explanation:</span>
          </div>
          {currentSection.teacherExplanation}
        </div>

        {/* Quick Check Exercises */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Section Quick Check (Comprueba lo que Aprendiste):</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {currentSection.checks.filter(c => answers[c.id]?.isCorrect).length}/{currentSection.checks.length} Solved
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentSection.checks.map((chk, idx) => {
              const state = answers[chk.id];
              return (
                <div key={chk.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-xs sm:text-sm text-slate-900">
                      {idx + 1}. {chk.question}
                    </p>
                    {state?.isCorrect && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Solved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {chk.options.map((opt, optIdx) => {
                      const isSelected = state?.selected === opt;
                      const isCorrectAnswer = opt.toLowerCase() === chk.correct.toLowerCase();

                      let style = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
                      if (state) {
                        if (isCorrectAnswer) {
                          style = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                        } else if (isSelected && !state.isCorrect) {
                          style = 'bg-red-50 border-red-300 text-red-900 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(chk.id, opt, chk.correct)}
                          disabled={!!state}
                          className={`p-3 rounded-xl border text-left transition-all ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {state && (
                    <div className="p-3 bg-blue-50/70 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{chk.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveSectionId(prev => Math.max(1, prev - 1))}
            disabled={activeSectionId === 1}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            ← Previous Section
          </button>

          <div className="flex items-center gap-2">
            {onGoToLab && (
              <button
                onClick={onGoToLab}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
              >
                Go to 100-Drill Practice Lab
              </button>
            )}

            <button
              onClick={() => setActiveSectionId(prev => Math.min(8, prev + 1))}
              disabled={activeSectionId === 8}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Next Section</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
