import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  Clock, 
  Eye, 
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MapPin,
  Lock,
  Compass,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AudienceTheme } from '../types';

interface WheresGuakyGameProps {
  currentStudent: Student | null;
  audienceTheme: AudienceTheme;
  onAwardXp: (studentId: string, amount: number) => void;
}

export interface HiddenTarget {
  id: string;
  name: string;
  nameSpanish: string;
  icon: string;
  isMainMascot?: boolean;
  xPercent: number; // horizontal %
  yPercent: number; // vertical %
  hitRadiusPercent: number;
  clueEnglish: string;
  clueSpanish: string;
  found: boolean;
}

export interface WorldTourScene {
  id: string;
  levelNumber: number;
  cityName: string;
  countryName: string;
  countryFlag: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  timeLimitSeconds: number;
  imageUrl: string;
  storyContext: string;
  learningFocus: string;
  // Multiple hidden targets: Guaky + Level 1 curriculum vocabulary objects
  targets: {
    id: string;
    name: string;
    nameSpanish: string;
    icon: string;
    isMainMascot?: boolean;
    xPercent: number;
    yPercent: number;
    hitRadiusPercent: number;
    clueEnglish: string;
    clueSpanish: string;
  }[];
}

const WORLD_TOUR_SCENES: WorldTourScene[] = [
  // 1. CARACAS, VENEZUELA (El Nido y Hogar de Güakytopia)
  {
    id: 'caracas',
    levelNumber: 1,
    cityName: 'Caracas',
    countryName: 'Venezuela',
    countryFlag: '🇻🇪',
    title: 'El Parque & El Ávila • Caracas',
    difficulty: 'Easy',
    xpReward: 50,
    timeLimitSeconds: 60,
    imageUrl: '/src/assets/images/wheres_guaky_caracas_1792356372195.jpg',
    storyContext: '¡Bienvenidos al valle de Caracas! Frente al majestuoso Ávila y el teleférico, la gente disfruta de arepas, empanadas, salsa y dominó en el parque. Güaky acompaña a dos estudiantes recién graduadas de inglés.',
    learningFocus: 'Unit 1 Vocabulary: Greetings, Graduation Cap, Mango Cart, Flag.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky the Macaw',
        nameSpanish: 'Güaky el Guacamayo',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 61.5,
        yPercent: 78.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am standing in the foreground, waving next to two happy students wearing graduation caps!”',
        clueSpanish: 'Güaky está al frente a la derecha, saludando junto a dos estudiantes con birretes de graduación.'
      },
      {
        id: 'arepa_cart',
        name: 'Arepas Stand',
        nameSpanish: 'Puesto de Arepas',
        icon: '🫓',
        xPercent: 12.0,
        yPercent: 78.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look in the lower-left corner for the colorful food cart that says \'Arepas y Sabor\'!”',
        clueSpanish: 'En la esquina inferior izquierda, el carrito de comida con toldo de rayas.'
      },
      {
        id: 'cable_car',
        name: 'Teleférico Cable Car',
        nameSpanish: 'Cabina del Teleférico',
        icon: '🚠',
        xPercent: 88.0,
        yPercent: 10.0,
        hitRadiusPercent: 6.0,
        clueEnglish: '“Look high up in the blue sky! A red cable car is heading towards El Ávila mountain!”',
        clueSpanish: 'Arriba en el cielo azul, una cabina roja del teleférico subiendo al Ávila.'
      }
    ]
  },

  // 2. NEW YORK CITY, USA (Times Square Broadway)
  {
    id: 'new_york',
    levelNumber: 2,
    cityName: 'New York City',
    countryName: 'USA',
    countryFlag: '🇺🇸',
    title: 'Times Square & Broadway • New York',
    difficulty: 'Medium',
    xpReward: 60,
    timeLimitSeconds: 60,
    imageUrl: '/src/assets/images/wheres_guaky_nyc_1792356345839.jpg',
    storyContext: 'Luces de neón de Broadway, taxis amarillos tocando corneta y puestos de hot dogs en Times Square. Güaky está aprendiendo las palabras de útiles escolares en pleno corazón de Manhattan.',
    learningFocus: 'Unit 1 Supplies: Big Red Pencil, English Backpack, Yellow Taxi.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Red Pencil',
        nameSpanish: 'Güaky con su Lápiz Rojo',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 66.5,
        yPercent: 63.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am right in the middle of Times Square, holding a giant red classroom pencil next to the I ❤️ NY tourists!”',
        clueSpanish: 'Güaky está en el centro-derecha, sosteniendo un lápiz rojo gigante entre los taxis amarillos.'
      },
      {
        id: 'hotdog_cart',
        name: 'New York Hot Dog Cart',
        nameSpanish: 'Carrito de Hot Dogs',
        icon: '🌭',
        xPercent: 33.0,
        yPercent: 79.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Find the vendor under the red and white umbrella serving delicious hot dogs!”',
        clueSpanish: 'El vendedor bajo la sombrilla roja y blanca en el centro inferior.'
      },
      {
        id: 'donut_billboard',
        name: 'Big Apple Donut Sign',
        nameSpanish: 'Letrero Big Apple Donuts',
        icon: '🍩',
        xPercent: 13.0,
        yPercent: 24.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look on the upper-left building facade for the Big Apple Donuts shop!”',
        clueSpanish: 'Arriba a la izquierda, la fachada de la tienda de donuts con la manzana roja.'
      }
    ]
  },

  // 3. SAN FRANCISCO, USA (Golden Gate & Cable Cars)
  {
    id: 'san_francisco',
    levelNumber: 3,
    cityName: 'San Francisco',
    countryName: 'USA',
    countryFlag: '🇺🇸',
    title: 'Golden Gate & Victorian Hills • San Francisco',
    difficulty: 'Medium',
    xpReward: 65,
    timeLimitSeconds: 55,
    imageUrl: '/src/assets/images/wheres_guaky_sf_1792356358190.jpg',
    storyContext: 'Empinadas colinas victorianas, el majestuoso Golden Gate entre la niebla marina, leones marinos tomando el sol en el muelle y tranvías históricos cruzando la bahía.',
    learningFocus: 'Unit 1 Places & Transport: Cable Car, English Dictionary, Sea Lions.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky on the Rooftop',
        nameSpanish: 'Güaky en el Techo',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 92.5,
        yPercent: 54.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am perched on the wooden roof overlooking the yellow cable car, reading my blue English book!”',
        clueSpanish: 'Güaky está en el panel derecho sobre el tejado, sosteniendo su libro azul de inglés.'
      },
      {
        id: 'sea_lions',
        name: 'Pier 39 Sea Lions',
        nameSpanish: 'Leones Marinos del Muelle',
        icon: '🦭',
        xPercent: 12.0,
        yPercent: 82.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Down at Fisherman\'s Wharf, find the wooden deck where lazy sea lions are barking at the boats!”',
        clueSpanish: 'En la plataforma de madera abajo a la izquierda, los leones marinos descansando.'
      },
      {
        id: 'golden_gate',
        name: 'Golden Gate Bridge Tower',
        nameSpanish: 'Torre del Golden Gate',
        icon: '🌉',
        xPercent: 25.0,
        yPercent: 13.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Way up in the fog across the Pacific bay, locate the orange suspension tower!”',
        clueSpanish: 'Arriba a la izquierda, la torre roja del famoso puente colgante entre la niebla.'
      }
    ]
  },

  // 4. LONDON, UNITED KINGDOM (Heathrow International Lounge)
  {
    id: 'london',
    levelNumber: 4,
    cityName: 'London',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    title: 'Heathrow Airport Terminal 5 • London',
    difficulty: 'Easy',
    xpReward: 55,
    timeLimitSeconds: 50,
    imageUrl: '/src/assets/images/wheres_guaky_london_1792355962298.jpg',
    storyContext: 'Una concurrida terminal de vuelos internacionales con pasajeros de todo el planeta, autobuses rojos londinenses de juguete, tiendas Duty Free y pilotos de aviación comercial.',
    learningFocus: 'Unit 1 Travel & Countries: World Map, Double Decker Bus, Departure Board.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with World Map',
        nameSpanish: 'Güaky con el Mapa Mundial',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 51.5,
        yPercent: 60.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am in the center walkway, holding an open green world map next to the nun and the luggage trolley!”',
        clueSpanish: 'Güaky está justo al centro sosteniendo un mapa verde entre las maletas y la monja.'
      },
      {
        id: 'double_decker',
        name: 'Red Double Decker Toy Bus',
        nameSpanish: 'Autobús Rojo Londinense',
        icon: '🚌',
        xPercent: 13.0,
        yPercent: 62.0,
        hitRadiusPercent: 6.0,
        clueEnglish: '“On the shelves of the Duty Free shop on the left, find the iconic London red double-decker bus!”',
        clueSpanish: 'En los estantes de la tienda Duty Free a la izquierda, los autobuses rojos ingleses.'
      },
      {
        id: 'flight_board',
        name: 'Airport Departures Board',
        nameSpanish: 'Pantalla de Salidas de Vuelo',
        icon: '🛫',
        xPercent: 12.0,
        yPercent: 14.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look up in the top left corner for the big electronic board listing London departures!”',
        clueSpanish: 'Arriba a la izquierda, la gran pantalla negra con la lista de vuelos a distintas ciudades.'
      }
    ]
  },

  // 5. PARIS, FRANCE (Montmartre & The Seine)
  {
    id: 'paris',
    levelNumber: 5,
    cityName: 'Paris',
    countryName: 'France',
    countryFlag: '🇫🇷',
    title: 'The Seine & Montmartre Painters • Paris',
    difficulty: 'Medium',
    xpReward: 70,
    timeLimitSeconds: 55,
    imageUrl: '/src/assets/images/wheres_guaky_paris_1792356384748.jpg',
    storyContext: 'El río Sena con sus barcos turísticos, la Torre Eiffel recortada contra las nubes, cafés con toldos de rayas y pintores con boinas en los adoquines de París. Güaky posa para un retrato al óleo.',
    learningFocus: 'Unit 1 Descriptive English: Artist Easel, Accordion, Eiffel Tower.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky by the Painter\'s Easel',
        nameSpanish: 'Güaky junto al Pintor',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 57.5,
        yPercent: 74.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am on the cobblestone walkway next to the painter with the brown beret who is painting the Eiffel Tower!”',
        clueSpanish: 'Güaky está en el paseo de adoquines saludando junto al pintor con boina y caballete.'
      },
      {
        id: 'eiffel_tower',
        name: 'The Eiffel Tower',
        nameSpanish: 'La Torre Eiffel',
        icon: '🗼',
        xPercent: 56.0,
        yPercent: 20.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look straight into the background center: the iron monument piercing the Parisian sky!”',
        clueSpanish: 'En el fondo al centro, la silueta de hierro de la famosa Torre Eiffel.'
      },
      {
        id: 'accordionist',
        name: 'Street Accordion Player',
        nameSpanish: 'Músico de Acordeón',
        icon: '🪗',
        xPercent: 17.5,
        yPercent: 68.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Outside the striped cafe, find the musician playing cheerful French melodies on an accordion!”',
        clueSpanish: 'Junto al café de rayas a la izquierda, el músico tocando el acordeón.'
      }
    ]
  },

  // 6. ROME, ITALY (Colosseum Plaza)
  {
    id: 'rome',
    levelNumber: 6,
    cityName: 'Rome',
    countryName: 'Italy',
    countryFlag: '🇮🇹',
    title: 'Colosseum Plaza & Trevi Waters • Rome',
    difficulty: 'Hard',
    xpReward: 75,
    timeLimitSeconds: 50,
    imageUrl: '/src/assets/images/wheres_guaky_rome_1792356398788.jpg',
    storyContext: 'Gladiadores romanos tomándose selfies con smartphones, motos Vespa zumbando en las plazas de adoquines, fuentes barrocas y hornos de pizza crujiente frente al majestuoso Coliseo.',
    learningFocus: 'Unit 1 Culture & Objects: Gelato Cone, Roman Column, Roman Helmet.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Gelato Cone',
        nameSpanish: 'Güaky Comiendo Helado',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 70.0,
        yPercent: 65.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am standing next to the tall Roman column, enjoying a delicious 3-scoop Italian gelato cone!”',
        clueSpanish: 'Güaky está de pie junto a la columna romana alta, comiendo un helado de barquilla.'
      },
      {
        id: 'roman_column',
        name: 'Ancient Roman Column',
        nameSpanish: 'Columna Romana Antigua',
        icon: '🏛️',
        xPercent: 75.5,
        yPercent: 32.0,
        hitRadiusPercent: 6.0,
        clueEnglish: '“Locate the tall Corinthian stone column standing proud on the right side of the plaza!”',
        clueSpanish: 'La alta columna de piedra con capiteles tallados al lado derecho de la plaza.'
      },
      {
        id: 'trevi_fountain',
        name: 'The Fountain Statue',
        nameSpanish: 'Fuente Barroca de Piedra',
        icon: '⛲',
        xPercent: 25.5,
        yPercent: 52.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look in the left courtyard for the grand round fountain where tourists are tossing coins!”',
        clueSpanish: 'La gran fuente circular a la izquierda donde los turistas lanzan monedas al agua.'
      }
    ]
  },

  // 7. GÜAKYTOPIA CENTRAL CAMPUS (El Gran Campus Internacional)
  {
    id: 'campus_central',
    levelNumber: 7,
    cityName: 'Güakytopia',
    countryName: 'Global Campus',
    countryFlag: '🌴',
    title: 'The Great Campus Courtyard & Library • Güakytopia',
    difficulty: 'Hard',
    xpReward: 80,
    timeLimitSeconds: 45,
    imageUrl: '/src/assets/images/wheres_guaky_campus_1792355974486.jpg',
    storyContext: 'El corazón académico de Güakytopia: cientos de alumnos practicando debates en inglés, puestos de café Campus Brew, partidas de ajedrez en la grama y ceremonias de grado bajo las palmeras reales.',
    learningFocus: 'Unit 1 Mastery: Study Squad, Royal Palm, Stone Archway.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky by the Stone Arch',
        nameSpanish: 'Güaky bajo el Arco de Piedra',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 82.5,
        yPercent: 83.5,
        hitRadiusPercent: 6.0,
        clueEnglish: '“I am in the bottom-right corner under the ancient stone archway, surrounded by the international study squad!”',
        clueSpanish: 'Güaky está abajo a la derecha, debajo del arco colonial de piedra junto al grupo de estudio.'
      },
      {
        id: 'chess_game',
        name: 'Picnic Chess Board',
        nameSpanish: 'Tablero de Ajedrez en la Grama',
        icon: '♟️',
        xPercent: 44.0,
        yPercent: 68.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the middle of the green lawn on a blue picnic mat, find the students playing chess!”',
        clueSpanish: 'En medio del césped sobre la manta azul, los dos estudiantes jugando ajedrez.'
      },
      {
        id: 'library_dome',
        name: 'Campus Central Library',
        nameSpanish: 'Biblioteca Central con Reloj',
        icon: '📚',
        xPercent: 75.0,
        yPercent: 12.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look up at the stately brick building with white columns and the big golden clock tower!”',
        clueSpanish: 'El edificio de ladrillo con columnas blancas y la torre del reloj en el fondo.'
      }
    ]
  }
];

export const WheresGuakyGame: React.FC<WheresGuakyGameProps> = ({
  currentStudent,
  audienceTheme,
  onAwardXp
}) => {
  const isKids = audienceTheme === 'kids';
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<'intro' | 'searching' | 'found' | 'timeout'>('intro');
  const [showClue, setShowClue] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.4 | 1.8>(1);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [clickedCoords, setClickedCoords] = useState<{ x: number; y: number } | null>(null);
  const [clickFeedback, setClickFeedback] = useState<'miss' | 'hit' | null>(null);

  // Targets found in the current scene session: { targetId: true }
  const [foundTargetsInScene, setFoundTargetsInScene] = useState<Record<string, boolean>>({});
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(0);

  // Global user completion progress
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`wheres_guaky_level_${currentStudent?.id || 'guest'}`);
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [sceneHistory, setSceneHistory] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`wheres_guaky_scenes_${currentStudent?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const scene = WORLD_TOUR_SCENES[activeSceneIndex];
  const activeTarget = scene.targets[selectedTargetIndex] || scene.targets[0];
  const timerRef = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Audio synthesis
  const playSfx = (type: 'win' | 'miss' | 'hit_object' | 'start') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'hit_object') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'miss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {}
  };

  // Timer countdown
  useEffect(() => {
    if (gameStatus === 'searching') {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameStatus('timeout');
            playSfx('miss');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  const handleStartMission = () => {
    setSecondsRemaining(scene.timeLimitSeconds);
    setGameStatus('searching');
    setClickFeedback(null);
    setClickedCoords(null);
    setShowClue(false);
    setFoundTargetsInScene({});
    setSelectedTargetIndex(0);
    playSfx('start');
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameStatus !== 'searching' || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setClickedCoords({ x: clickX, y: clickY });

    // Check hit against the currently active target, or any unfound target
    let hitFound = false;

    for (let i = 0; i < scene.targets.length; i++) {
      const tgt = scene.targets[i];
      if (foundTargetsInScene[tgt.id]) continue;

      const distance = Math.hypot(clickX - tgt.xPercent, clickY - tgt.yPercent);
      if (distance <= tgt.hitRadiusPercent) {
        // HIT TARGET!
        hitFound = true;
        const updatedTargets = { ...foundTargetsInScene, [tgt.id]: true };
        setFoundTargetsInScene(updatedTargets);
        setClickFeedback('hit');

        // Check if all targets are found
        const allDone = scene.targets.every(t => updatedTargets[t.id]);

        if (allDone) {
          setGameStatus('found');
          playSfx('win');

          try {
            confetti({
              particleCount: 120,
              spread: 85,
              origin: { y: 0.55 },
              colors: ['#2EC4B6', '#FFD166', '#FF6B4A', '#7928CA', '#10B981']
            });
          } catch {}

          // Record victory & unlock next level
          const updatedScenes = { ...sceneHistory, [scene.id]: true };
          setSceneHistory(updatedScenes);
          const nextLevel = Math.max(unlockedLevel, scene.levelNumber + 1);
          setUnlockedLevel(nextLevel);

          try {
            localStorage.setItem(`wheres_guaky_scenes_${currentStudent?.id || 'guest'}`, JSON.stringify(updatedScenes));
            localStorage.setItem(`wheres_guaky_level_${currentStudent?.id || 'guest'}`, nextLevel.toString());
          } catch {}

          if (currentStudent && currentStudent.id !== 'guest') {
            onAwardXp(currentStudent.id, scene.xpReward);
          }
        } else {
          // Found an intermediate object!
          playSfx('hit_object');
          // Switch to the next unfound target
          const nextUnfoundIdx = scene.targets.findIndex(t => !updatedTargets[t.id]);
          if (nextUnfoundIdx !== -1) {
            setSelectedTargetIndex(nextUnfoundIdx);
          }
        }
        break;
      }
    }

    if (!hitFound) {
      setClickFeedback('miss');
      playSfx('miss');
      setTimeout(() => setClickFeedback(null), 1000);
    }
  };

  const handleNextCity = () => {
    const nextIdx = (activeSceneIndex + 1) % WORLD_TOUR_SCENES.length;
    setActiveSceneIndex(nextIdx);
    setGameStatus('intro');
    setClickFeedback(null);
    setClickedCoords(null);
    setShowClue(false);
    setZoomLevel(1);
    setFoundTargetsInScene({});
    setSelectedTargetIndex(0);
  };

  const speakClue = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeTarget.clueEnglish);
        utterance.lang = 'en-US';
        utterance.rate = 0.92;
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  };

  const totalCompletedScenes = Object.values(sceneHistory).filter(Boolean).length;

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & WORLD TOUR PASSPORT BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl border text-white shadow-xl relative overflow-hidden transition-all ${
        isKids 
          ? 'bg-gradient-to-r from-violet-950 via-indigo-950 to-purple-900 border-violet-500/30' 
          : 'bg-gradient-to-r from-slate-950 via-teal-950 to-indigo-950 border-teal-500/30'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                World Tour Edition • Where&apos;s Waldo &amp; Güaky
              </span>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {totalCompletedScenes} de {WORLD_TOUR_SCENES.length} Ciudades Desbloqueadas
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Where&apos;s Güaky: World Tour</span>
              <span className="text-3xl animate-bounce">🌍🦜</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Viaja por las grandes metrópolis del mundo resolviendo misiones de vocabulario en ilustraciones gigantes estilo <em>Where&apos;s Waldo</em>.
              Encuentra a <strong>Güaky</strong> y los <strong>objetos de vocabulario</strong> escondidos entre cientos de personajes.
            </p>
          </div>

          {/* Right Status Card: Progress & Identity confirmation */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0 min-w-[240px]">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-amber-400 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src="/guaky-mascota.png" 
                alt="Güaky Oficial" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                Pasaporte Internacional
              </span>
              <p className="text-xs font-black text-white">Nivel Actual: {unlockedLevel}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-200">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Recompensa: <strong>+{scene.xpReward} XP</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CITY LEVELS CAROUSEL SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            Ruta de Ciudades del Mundo (Haz clic para viajar)
          </span>
          <span className="text-slate-400">Desbloqueas avanzando en la ruta</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {WORLD_TOUR_SCENES.map((sc, index) => {
            const isCompleted = Boolean(sceneHistory[sc.id]);
            const isUnlocked = sc.levelNumber <= unlockedLevel;
            const isActive = index === activeSceneIndex;

            return (
              <button
                key={sc.id}
                onClick={() => {
                  if (!isUnlocked) return;
                  setActiveSceneIndex(index);
                  setGameStatus('intro');
                  setClickFeedback(null);
                  setClickedCoords(null);
                  setShowClue(false);
                  setZoomLevel(1);
                  setFoundTargetsInScene({});
                  setSelectedTargetIndex(0);
                }}
                disabled={!isUnlocked}
                className={`p-3 rounded-2xl text-left border transition-all shrink-0 min-w-[170px] relative overflow-hidden ${
                  isActive
                    ? isKids
                      ? 'bg-violet-600 text-white border-violet-500 shadow-lg scale-102 ring-2 ring-violet-300'
                      : 'bg-teal-600 text-white border-teal-500 shadow-lg scale-102 ring-2 ring-teal-200'
                    : isUnlocked
                    ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-lg">{sc.countryFlag}</span>
                  {isCompleted ? (
                    <span className="bg-emerald-500/20 text-emerald-600 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Superado
                    </span>
                  ) : !isUnlocked ? (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Bloqueado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                      Nivel {sc.levelNumber}
                    </span>
                  )}
                </div>

                <strong className={`block text-xs font-black truncate ${isActive ? 'text-white' : isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                  {sc.cityName}
                </strong>
                <span className={`block text-[10px] truncate ${isActive ? 'text-teal-100' : 'text-slate-500'}`}>
                  {sc.countryName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE BOARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4">
        
        {/* Top Control Bar: City info, targets checklist, zoom & timer */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          
          {/* Left: Location & Target Objectives */}
          <div className="space-y-2 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5">
                <span className="text-base">{scene.countryFlag}</span>
                <span>{scene.cityName}, {scene.countryName}</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                {scene.learningFocus}
              </span>
            </div>

            {/* Checklist of Hidden Items for this Level */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Objetivos a buscar:
              </span>
              {scene.targets.map((tgt, idx) => {
                const isFound = Boolean(foundTargetsInScene[tgt.id]);
                const isSelected = selectedTargetIndex === idx;

                return (
                  <button
                    key={tgt.id}
                    onClick={() => setSelectedTargetIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isFound
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 line-through opacity-80'
                        : isSelected
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-xs ring-2 ring-amber-300'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{tgt.icon}</span>
                    <span>{tgt.name}</span>
                    {isFound ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Controls & Timer */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${zoomLevel === 1 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Vista panorámica (1x)"
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.4)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${zoomLevel === 1.4 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Zoom medio (1.4x)"
              >
                1.4x
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.8)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${zoomLevel === 1.8 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Zoom máximo (1.8x)"
              >
                1.8x
              </button>
            </div>

            {/* Clue button */}
            <button
              onClick={() => setShowClue(!showClue)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{showClue ? 'Ocultar Pista' : 'Pedir Pista'}</span>
            </button>

            {/* Audio pronunciation button */}
            <button
              onClick={speakClue}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Escuchar pista del objetivo activo en inglés nativo"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Escuchar Pista 🎧</span>
            </button>

            {/* Timer */}
            {gameStatus === 'searching' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs font-black shadow-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{secondsRemaining}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Clue Drawer for Active Target */}
        {showClue && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Pista para: <strong>{activeTarget.icon} {activeTarget.name}</strong></span>
              </div>
              <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md font-mono">
                {scene.cityName}
              </span>
            </div>
            
            <p className="font-mono text-xs text-amber-950 bg-white/85 p-3 rounded-xl border border-amber-200 leading-relaxed">
              {activeTarget.clueEnglish}
            </p>
            <p className="text-[11px] text-amber-800">
              💡 <strong>En español:</strong> {activeTarget.clueSpanish}
            </p>
          </div>
        )}

        {/* FULL WIMMELBILD ILLUSTRATION BOARD (SCROLLABLE & ZOOMABLE) */}
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-300 shadow-xl bg-slate-950">
          
          <div className="w-full max-h-[580px] overflow-auto scrollbar-thin">
            <div 
              ref={boardRef}
              onClick={handleBoardClick}
              className="relative cursor-crosshair select-none transition-transform origin-top-left"
              style={{
                width: `${zoomLevel * 100}%`,
                minWidth: '100%'
              }}
            >
              {/* THE ULTRA-DETAILED WHERE'S WALDO STYLE ILLUSTRATION */}
              <img
                src={scene.imageUrl}
                alt={`${scene.cityName} - ${scene.title}`}
                className="w-full h-auto block select-none pointer-events-auto"
                draggable={false}
                referrerPolicy="no-referrer"
              />

              {/* HIGHLIGHT TARGETS ALREADY FOUND IN THIS SCENE */}
              {scene.targets.map(tgt => {
                if (!foundTargetsInScene[tgt.id]) return null;
                return (
                  <div
                    key={tgt.id}
                    className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: `${tgt.yPercent}%`,
                      left: `${tgt.xPercent}%`,
                    }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-emerald-400 bg-emerald-400/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                        ✓ {tgt.name}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Click Feedback Ripples */}
              {clickedCoords && clickFeedback === 'miss' && (
                <div
                  className="absolute w-12 h-12 border-3 border-rose-500 bg-rose-500/20 rounded-full animate-ping pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${clickedCoords.y}%`,
                    left: `${clickedCoords.x}%`,
                  }}
                />
              )}
            </div>
          </div>

          {/* OVERLAY: Intro / Ready state */}
          {gameStatus === 'intro' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-30 space-y-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-white p-2 border-2 border-amber-400 shadow-xl flex items-center justify-center animate-bounce">
                <img 
                  src="/guaky-mascota.png" 
                  alt="Güaky" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="max-w-md space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold">
                  <span>{scene.countryFlag} Nivel {scene.levelNumber}</span>
                  <span>•</span>
                  <span>{scene.cityName}, {scene.countryName}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {scene.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scene.storyContext}
                </p>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 max-w-sm text-xs text-amber-200">
                <span>🎯 Encuentra a <strong>Güaky y los {scene.targets.length - 1} objetos de vocabulario</strong> antes de que termine el tiempo ({scene.timeLimitSeconds}s).</span>
              </div>

              <button
                onClick={handleStartMission}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>¡Comenzar Búsqueda en {scene.cityName}!</span>
              </button>
            </div>
          )}

          {/* OVERLAY: Won / Found state */}
          {gameStatus === 'found' && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white z-40 animate-slideUp shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0">
                  🎉
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      ¡Misión Cumplida en {scene.cityName}!
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-400/30">
                      +{scene.xpReward} XP Ganados
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    ¡Todos los objetivos encontrados! 🏆
                  </h4>
                  <p className="text-xs text-slate-300">
                    Siguiente destino desbloqueado en tu pasaporte de Güakytopia.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleStartMission}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex-1 sm:flex-initial"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  Repetir
                </button>
                <button
                  onClick={handleNextCity}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                >
                  <span>Viajar a la Siguiente Ciudad</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* OVERLAY: Timeout state */}
          {gameStatus === 'timeout' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-30 space-y-3 animate-fadeIn">
              <span className="text-4xl">⏱️</span>
              <h3 className="text-xl font-black text-rose-400">
                ¡Tiempo Agotado en {scene.cityName}!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                ¡Las multitudes son inmensas! Vuelve a intentarlo, usa los botones de Zoom (1.4x o 1.8x) y escucha la pista en inglés.
              </p>
              <button
                onClick={handleStartMission}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar {scene.cityName}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Explanatory Strip: Pedagogy & Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">🌍 Pasaporte de Ciudades</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Viaja por Caracas, Nueva York, San Francisco, Londres, París, Roma y el Campus Central superando cada nivel.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">📚 Vocabulario Curricular Nivel 1</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              No solo buscas a Güaky: también identificas útiles escolares, medios de transporte, alimentos y monumentos en inglés.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">🔍 Zoom Dinámico &amp; Audio Nativo</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Acerca la imagen para inspeccionar a los cientos de personajes y escucha la descripción en inglés con pronunciación clara.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
