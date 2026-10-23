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
  Minimize2,
  Loader2,
  Move,
  MapPin,
  Lock,
  Compass,
  Award,
  Layers,
  BookOpen,
  Languages,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, AudienceTheme } from '../types';

interface WheresGuakyGameProps {
  currentStudent: Student | null;
  audienceTheme: AudienceTheme;
  onAwardXp: (studentId: string, amount: number) => void;
}
export type WheresGüakyGameProps = WheresGuakyGameProps;

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
  storyContextEnglish?: string;
  learningFocus: string;
  // Multiple hidden targets: Güaky + Level 1 curriculum vocabulary objects
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
    imageUrl: '/images/wheres_guaky/wheres_guaky_caracas_retro.jpg',
    storyContext: '¡Bienvenidos al valle de Caracas! Frente al majestuoso Ávila y el teleférico, la gente disfruta de arepas, empanadas, salsa y dominó en el parque. Güaky acompaña a dos estudiantes recién graduadas de inglés.',
    storyContextEnglish: 'Welcome to Caracas! Facing majestic Mount Ávila and the cable car, people enjoy arepas, tropical snacks, lively salsa music and dominoes in the park. Güaky cheers alongside two proud English academy graduates.',
    learningFocus: 'Unit 1 Vocabulary: Greetings, Graduation Cap, Mango Cart, Flag.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky the Macaw',
        nameSpanish: 'Güaky el Guacamayo',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 20.5,
        yPercent: 38.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look on the left in the flowering pink trumpet tree! I am nestled naturally on a branch among the tropical blossoms!”',
        clueSpanish: 'En el árbol de flores rosadas a la izquierda, Güaky está posado entre las ramas y flores tropicales.'
      },
      {
        id: 'arepa_cart',
        name: 'Arepas Stand',
        nameSpanish: 'Puesto de Arepas',
        icon: '🫓',
        xPercent: 73.0,
        yPercent: 75.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look in the lower-right area for the cheerful yellow-and-orange canopy cart cooking fresh Venezuelan arepas!”',
        clueSpanish: 'Abajo a la derecha, el carrito con toldo amarillo y naranja preparando arepas calientes.'
      },
      {
        id: 'cable_car',
        name: 'Teleférico Cable Car',
        nameSpanish: 'Cabina del Teleférico',
        icon: '🚠',
        xPercent: 33.0,
        yPercent: 20.0,
        hitRadiusPercent: 6.0,
        clueEnglish: '“Look high up towards Mount Ávila! A red cable car cabin is ascending along the cables!”',
        clueSpanish: 'Arriba en la montaña del Ávila, una cabina roja del teleférico subiendo por los cables.'
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
    imageUrl: '/images/wheres_guaky/wheres_guaky_nyc_retro.jpg',
    storyContext: 'Luces de neón de Broadway, taxis amarillos tocando corneta y puestos de hot dogs en Times Square. Güaky está aprendiendo las palabras de útiles escolares en pleno corazón de Manhattan.',
    storyContextEnglish: 'Neon Broadway marquees, yellow cabs honking in traffic, and bustling crowds in Times Square. Güaky is learning school supplies and city words right in the heart of Manhattan.',
    learningFocus: 'Unit 1 Supplies: Bookstore, English Backpack, Yellow Taxi.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky on the Fire Escape',
        nameSpanish: 'Güaky en la Escalera de Incendios',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 20.8,
        yPercent: 13.5,
        hitRadiusPercent: 6.0,
        clueEnglish: '“Look at the brick building on the left! I am perched discreetly on the upper fire escape balcony next to flower pots and laundry!”',
        clueSpanish: 'En el edificio de ladrillos a la izquierda, Güaky está en el balcón superior de la escalera de incendios junto a las macetas.'
      },
      {
        id: 'yellow_taxi',
        name: 'Yellow Checker Cab',
        nameSpanish: 'Taxi Amarillo de Nueva York',
        icon: '🚕',
        xPercent: 41.5,
        yPercent: 75.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look right in the center of the street for the iconic yellow checker taxi cab!”',
        clueSpanish: 'En el centro de la calle, el clásico taxi amarillo de Nueva York.'
      },
      {
        id: 'broadway_marquee',
        name: 'Broadway Theater Marquee',
        nameSpanish: 'Marquesina de Teatro Broadway',
        icon: '🎭',
        xPercent: 35.0,
        yPercent: 30.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look along the Broadway facade for the large illustrated poster marquee for The Phantom of the Opera!”',
        clueSpanish: 'En la fachada de Broadway, la marquesina con la máscara blanca de Phantom of the Opera.'
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
    imageUrl: '/images/wheres_guaky/wheres_guaky_sf_1792356358190.jpg',
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

  // 4. MIAMI, USA (Ocean Drive & South Beach)
  {
    id: 'miami',
    levelNumber: 4,
    cityName: 'Miami',
    countryName: 'USA',
    countryFlag: '🇺🇸',
    title: 'Ocean Drive & South Beach • Miami',
    difficulty: 'Easy',
    xpReward: 65,
    timeLimitSeconds: 55,
    imageUrl: '/images/wheres_guaky/wheres_guaky_miami_1792442954620.jpg',
    storyContext: 'Patines, arquitectura Art Deco color pastel, palmeras meciéndose con la brisa marina y arena dorada. Güaky disfruta del sol de Florida junto al grupo de estudio de inglés frente al mar.',
    learningFocus: 'Unit 1 Vacation & Nature: Sunglasses, Smoothie Stand, Lifeguard Tower, Flamingos.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Sunglasses',
        nameSpanish: 'Güaky con Lentes de Sol',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 61.5,
        yPercent: 56.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am on the sunny beach holding dark sunglasses next to the English study group reading on their towel!”',
        clueSpanish: 'Güaky está en la playa sosteniendo lentes de sol junto al grupo de estudio con toallas a rayas.'
      },
      {
        id: 'smoothie_cart',
        name: 'Coconut Smoothie Stand',
        nameSpanish: 'Puesto de Coconut Smoothie',
        icon: '🥥',
        xPercent: 47.5,
        yPercent: 81.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look at the bottom edge for the blue and white striped booth that says \'Coconut Smoothie\'!”',
        clueSpanish: 'En el borde inferior, el puesto de rayas azules y blancas que dice \'Coconut Smoothie\'.'
      },
      {
        id: 'lifeguard_tower',
        name: 'Art Deco Lifeguard Tower',
        nameSpanish: 'Caseta de Salvavidas Art Deco',
        icon: '🛟',
        xPercent: 83.0,
        yPercent: 27.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“On the golden sands facing the turquoise ocean, locate the purple and neon green lifeguard house!”',
        clueSpanish: 'En la arena dorada frente al mar turquesa, la caseta de salvavidas morada y verde neón.'
      },
      {
        id: 'pink_flamingos',
        name: 'Pink Flamingos Pool',
        nameSpanish: 'Flamencos Rosados',
        icon: '🦩',
        xPercent: 95.0,
        yPercent: 64.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the lower-right lagoon, find the two bright pink flamingos standing on one leg!”',
        clueSpanish: 'En la pequeña laguna abajo a la derecha, los dos flamencos rosados sobre una pata.'
      }
    ]
  },

  // 5. TORONTO, CANADA (CN Tower & Rogers Centre)
  {
    id: 'toronto',
    levelNumber: 5,
    cityName: 'Toronto',
    countryName: 'Canada',
    countryFlag: '🇨🇦',
    title: 'CN Tower & Autumn Tramways • Toronto',
    difficulty: 'Medium',
    xpReward: 70,
    timeLimitSeconds: 55,
    imageUrl: '/images/wheres_guaky/wheres_guaky_toronto_1792442969319.jpg',
    storyContext: 'Hojas rojas de arce canadiense, tranvías rojos cruzando las calles, la gran torre CN rozando las nubes y pistas de patinaje sobre hielo. Güaky explora Ontario con su guía turística en inglés.',
    learningFocus: 'Unit 1 City Life & Transport: Red Streetcar, Ice Skating Rink, Rogers Dome, Maple Syrup.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Toronto Guide',
        nameSpanish: 'Güaky con su Guía de Toronto',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 70.0,
        yPercent: 61.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am standing on the maple stone pedestal next to the pancake stall, reading my blue \'Toronto Guide\'!”',
        clueSpanish: 'Güaky está sobre el pedestal de piedra junto al puesto de pancakes con su guía azul de Toronto.'
      },
      {
        id: 'streetcar',
        name: 'Red & White Toronto Streetcar',
        nameSpanish: 'Tranvía Rojo y Blanco',
        icon: '🚋',
        xPercent: 27.0,
        yPercent: 74.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look on the street tracks in the lower-left for the iconic red and white Toronto transit streetcar!”',
        clueSpanish: 'En las vías del tranvía abajo a la izquierda, el clásico tranvía rojo y blanco de Toronto.'
      },
      {
        id: 'ice_rink',
        name: 'Outdoor Ice Skating Rink',
        nameSpanish: 'Pista de Patinaje sobre Hielo',
        icon: '⛸️',
        xPercent: 91.0,
        yPercent: 50.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“On the right side of the plaza, find the frozen oval rink where Canadian skaters are gliding on ice!”',
        clueSpanish: 'Al lado derecho de la plaza, la pista de hielo donde los patinadores se deslizan con patines.'
      },
      {
        id: 'rogers_dome',
        name: 'Rogers Centre Stadium Dome',
        nameSpanish: 'Cúpula del Estadio Rogers',
        icon: '🏟️',
        xPercent: 33.5,
        yPercent: 22.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look at the giant circular white sports arena with the retractable dome roof next to the CN Tower!”',
        clueSpanish: 'El gran estadio blanco circular con techo retráctil junto a la torre CN.'
      }
    ]
  },

  // 6. CIUDAD DE MÉXICO, MEXICO (Bellas Artes & Zócalo)
  {
    id: 'mexico_city',
    levelNumber: 6,
    cityName: 'Ciudad de México',
    countryName: 'Mexico',
    countryFlag: '🇲🇽',
    title: 'Palacio de Bellas Artes & Mariachis • CDMX',
    difficulty: 'Medium',
    xpReward: 70,
    timeLimitSeconds: 55,
    imageUrl: '/images/wheres_guaky/wheres_guaky_mexico_1792442984260.jpg',
    storyContext: 'Música de mariachi en vivo, trompetas, puestos de tacos al pastor y churros calientes, bailarinas de vestidos multicolores y escarabajos verdes. Güaky practica saludos bilingües con su mini sombrero.',
    learningFocus: 'Unit 1 Conversational Greetings: Hello Flashcard, Mariachi Band, Green Beetle Taxi, Art Dome.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Mini Sombrero',
        nameSpanish: 'Güaky con Mini Sombrero',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 77.5,
        yPercent: 71.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am sitting proudly on the ornate stone bench, wearing a tiny Mexican sombrero and holding a \'Hello\' card!”',
        clueSpanish: 'Güaky está sentado en el banco de piedra tallada con un mini sombrero y una tarjeta de \'Hello\'.'
      },
      {
        id: 'bellas_artes',
        name: 'Bellas Artes Rainbow Dome',
        nameSpanish: 'Cúpula de Bellas Artes',
        icon: '🏛️',
        xPercent: 80.5,
        yPercent: 18.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look in the upper-right corner for the magnificent golden-yellow art dome of the Palacio de Bellas Artes!”',
        clueSpanish: 'Arriba a la derecha, la cúpula amarilla y arcoíris del Palacio de Bellas Artes.'
      },
      {
        id: 'mariachis',
        name: 'Mariachi Brass Band',
        nameSpanish: 'Grupo de Mariachis',
        icon: '🎺',
        xPercent: 35.0,
        yPercent: 88.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“At the bottom of the plaza, find the musicians in black and gold charro suits playing guitars and trumpets!”',
        clueSpanish: 'Abajo al centro, los músicos mariachis con trajes negros bordados tocando trompetas y guitarras.'
      },
      {
        id: 'green_beetle',
        name: 'Vintage Green Beetle Taxi',
        nameSpanish: 'Taxi Escarabajo Verde',
        icon: '🚖',
        xPercent: 10.5,
        yPercent: 72.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“On the street on the lower-left, locate the classic green and white vintage VW Beetle taxi cab!”',
        clueSpanish: 'En la calle abajo a la izquierda, el clásico taxi escarabajo verde y blanco.'
      }
    ]
  },

  // 7. BOGOTÁ, COLOMBIA (La Candelaria & Monserrate)
  {
    id: 'bogota',
    levelNumber: 7,
    cityName: 'Bogotá',
    countryName: 'Colombia',
    countryFlag: '🇨🇴',
    title: 'Plaza de Bolívar & Monserrate • Bogotá',
    difficulty: 'Medium',
    xpReward: 75,
    timeLimitSeconds: 50,
    imageUrl: '/images/wheres_guaky/wheres_guaky_bogota_1792443008104.jpg',
    storyContext: 'Adoquines coloniales de La Candelaria, ciclistas de la Ciclovía, autobuses TransMilenio, café de tinto caliente en termos y el cerro de Monserrate entre la niebla. Güaky repasa su diccionario de inglés.',
    learningFocus: 'Unit 1 Study Essentials: English Dictionary, TransMilenio Bus, Wooden Chiva, Mountain Sanctuary.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with English Dictionary',
        nameSpanish: 'Güaky con Diccionario & Tinto',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 86.5,
        yPercent: 74.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am next to the colorful graffiti mural, holding an English Dictionary and sipping hot Colombian tinto coffee!”',
        clueSpanish: 'Güaky está junto al mural de grafiti colorido sosteniendo su diccionario verde de inglés y una taza de café caliente.'
      },
      {
        id: 'transmilenio',
        name: 'Red TransMilenio Bus',
        nameSpanish: 'Autobús Rojo TransMilenio',
        icon: '🚍',
        xPercent: 27.5,
        yPercent: 51.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Find the long red articulated public bus driving across the cobblestone street on the left!”',
        clueSpanish: 'El autobús rojo articulado de dos vagones transitando por la calle empedrada a la izquierda.'
      },
      {
        id: 'chiva_bus',
        name: 'Traditional Wooden Chiva Bus',
        nameSpanish: 'Chiva Tradicional de Colores',
        icon: '🚌',
        xPercent: 72.0,
        yPercent: 61.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look in the right square for the open-sided rustic bus with colorful wooden rails carrying happy tourists!”',
        clueSpanish: 'En la plaza a la derecha, la chiva colombiana pintada de colores vivos con turistas en el techo.'
      },
      {
        id: 'monserrate',
        name: 'Monserrate Mountain Sanctuary',
        nameSpanish: 'Santuario de Monserrate',
        icon: '⛰️',
        xPercent: 43.5,
        yPercent: 6.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“High up on top of the misty green mountain in the clouds, locate the white colonial church sanctuary!”',
        clueSpanish: 'En la cima de la montaña verde entre las nubes, la blanca iglesia del Santuario de Monserrate.'
      }
    ]
  },

  // 8. PANAMÁ CITY, PANAMÁ (Canal de Panamá & Casco Viejo)
  {
    id: 'panama',
    levelNumber: 8,
    cityName: 'Panamá City',
    countryName: 'Panama',
    countryFlag: '🇵🇦',
    title: 'Canal de Panamá & Miraflores • Panamá',
    difficulty: 'Medium',
    xpReward: 75,
    timeLimitSeconds: 50,
    imageUrl: '/images/wheres_guaky/wheres_guaky_panama_1792443023866.jpg',
    storyContext: 'El imponente Canal de Panamá con sus esclusas de agua, barcos de carga transitando los océanos, el moderno horizonte de rascacielos y carritos de raspados. Güaky aprende vocabulario marítimo con binoculares.',
    learningFocus: 'Unit 1 Maritime & World Trade: Binoculars, Cargo Container Ship, Raspaos Cart, Spiral Tower.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Binoculars',
        nameSpanish: 'Güaky con Binoculares',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 82.5,
        yPercent: 74.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am on the wooden pier railing, looking through black binoculars with my Ship Captain\'s English notebook!”',
        clueSpanish: 'Güaky está en la baranda del muelle de madera mirando con binoculares y su libreta de capitán.'
      },
      {
        id: 'cargo_ship',
        name: 'Panama Canal Cargo Ship',
        nameSpanish: 'Buque de Carga en las Esclusas',
        icon: '🚢',
        xPercent: 41.5,
        yPercent: 40.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the middle of the canal water lock, find the giant blue cargo ship loaded with colorful shipping containers!”',
        clueSpanish: 'En el canal de esclusas al centro, el gran barco azul cargado de contenedores de mercancía.'
      },
      {
        id: 'raspaos_cart',
        name: 'Raspaos Shaved Ice Cart',
        nameSpanish: 'Carrito de Raspados (Raspaos)',
        icon: '🍧',
        xPercent: 5.5,
        yPercent: 71.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“On the walkway on the far left, look for the vendor cart with glass bottles of colored syrup labeled \'Raspaos\'!”',
        clueSpanish: 'A la extrema izquierda, el carrito de raspados de hielo con botellas de jarabes de colores.'
      },
      {
        id: 'spiral_tower',
        name: 'F&F Spiral Skyscraper',
        nameSpanish: 'Torre Espiral de Panamá',
        icon: '🏙️',
        xPercent: 28.0,
        yPercent: 15.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Across the bay in the skyscraper skyline, locate the famous twisting spiral high-rise building!”',
        clueSpanish: 'Al otro lado de la bahía en el horizonte de rascacielos, la torre en espiral retorcida (Torre F&F).'
      }
    ]
  },

  // 9. LONDON, UNITED KINGDOM (Heathrow International Lounge)
  {
    id: 'london',
    levelNumber: 9,
    cityName: 'London',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    title: 'Heathrow Airport Terminal 5 • London',
    difficulty: 'Medium',
    xpReward: 80,
    timeLimitSeconds: 50,
    imageUrl: '/images/wheres_guaky/wheres_guaky_london_retro.jpg',
    storyContext: 'Una concurrida terminal de vuelos internacionales con pasajeros de todo el planeta, autobuses rojos londinenses de juguete, tiendas Duty Free y pilotos de aviación comercial.',
    storyContextEnglish: 'A bustling international airport terminal in London with Big Ben and red double-decker buses outside, hundreds of travelers with luggage, and pilots preparing for flight. Güaky is disguised right near the departures board.',
    learningFocus: 'Unit 1 Travel & Countries: World Map, Double Decker Bus, Departure Board.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky on the Luggage Trolley',
        nameSpanish: 'Güaky en el Carrito de Equipaje',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 88.0,
        yPercent: 71.0,
        hitRadiusPercent: 6.0,
        clueEnglish: '“Look in the lower-right area near the British Tea & Cakes cart! I am perched atop stacked vintage leather suitcases on a luggage trolley!”',
        clueSpanish: 'Abajo a la derecha junto al puesto de té británico, Güaky está sobre las maletas de cuero en el carrito de equipaje.'
      },
      {
        id: 'flight_board',
        name: 'Departures Flight Board',
        nameSpanish: 'Pantalla de Salidas de Vuelo',
        icon: '🛫',
        xPercent: 33.0,
        yPercent: 15.0,
        hitRadiusPercent: 8.0,
        clueEnglish: '“Look up at the giant retro split-flap timetable board showing flight departures to New York, Paris, and Heathrow!”',
        clueSpanish: 'Arriba el gran panel mecánico retro de salidas con vuelos a Nueva York, París y Heathrow.'
      },
      {
        id: 'double_decker',
        name: 'London Red Double-Decker Bus',
        nameSpanish: 'Autobús Rojo de Dos Pisos',
        icon: '🚌',
        xPercent: 59.0,
        yPercent: 26.0,
        hitRadiusPercent: 7.0,
        clueEnglish: '“Look through the great glass station arches outside where the classic red London double-decker bus is parked!”',
        clueSpanish: 'A través de los grandes arcos de cristal hacia la calle, el clásico autobús rojo de dos pisos de Londres.'
      }
    ]
  },

  // 10. PARIS, FRANCE (Montmartre & The Seine)
  {
    id: 'paris',
    levelNumber: 10,
    cityName: 'Paris',
    countryName: 'France',
    countryFlag: '🇫🇷',
    title: 'The Seine & Montmartre Painters • Paris',
    difficulty: 'Medium',
    xpReward: 80,
    timeLimitSeconds: 50,
    imageUrl: '/images/wheres_guaky/wheres_guaky_paris_1792356384748.jpg',
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

  // 11. ROME, ITALY (Colosseum Plaza)
  {
    id: 'rome',
    levelNumber: 11,
    cityName: 'Rome',
    countryName: 'Italy',
    countryFlag: '🇮🇹',
    title: 'Colosseum Plaza & Trevi Waters • Rome',
    difficulty: 'Hard',
    xpReward: 85,
    timeLimitSeconds: 45,
    imageUrl: '/images/wheres_guaky/wheres_guaky_rome_1792356398788.jpg',
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

  // 12. MADRID, SPAIN (Gran Vía & El Retiro)
  {
    id: 'madrid',
    levelNumber: 12,
    cityName: 'Madrid',
    countryName: 'Spain',
    countryFlag: '🇪🇸',
    title: 'Gran Vía & El Retiro • Madrid',
    difficulty: 'Hard',
    xpReward: 85,
    timeLimitSeconds: 45,
    imageUrl: '/images/wheres_guaky/wheres_guaky_madrid_1792443040435.jpg',
    storyContext: 'La emblemática Gran Vía madrileña con el edificio Metrópolis, terrazas con chocolate con churros, el estanque de El Retiro y aficionados de fútbol. Güaky sostiene la llave dorada del conocimiento bilingüe.',
    learningFocus: 'Unit 1 Architecture & Key: Golden Key, Metropolis Dome, City Tour Bus, Rowing Boats.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky on Terrace Balustrade',
        nameSpanish: 'Güaky en la Baranda de la Terraza',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 79.5,
        yPercent: 39.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am perched on the classical stone balustrade of the terrace café, holding a golden key and my Bilingual card!”',
        clueSpanish: 'Güaky está posado en la baranda de piedra del balcón del café con su tarjeta bilingüe y una llave dorada.'
      },
      {
        id: 'metropolis',
        name: 'Metropolis Building Winged Statue',
        nameSpanish: 'Cúpula del Edificio Metrópolis',
        icon: '🏛️',
        xPercent: 44.5,
        yPercent: 15.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look high above Gran Vía at the famous classical black dome topped with the golden winged statue!”',
        clueSpanish: 'En lo alto de la Gran Vía, la famosa cúpula negra con la estatua de la victoria alada (Edificio Metrópolis).'
      },
      {
        id: 'city_tour_bus',
        name: 'Red City Tour Double Decker',
        nameSpanish: 'Autobús Turístico de Dos Pisos',
        icon: '🚍',
        xPercent: 63.5,
        yPercent: 58.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Driving down the center street, find the big red open-top tour bus with tourists waving from the upper deck!”',
        clueSpanish: 'En la calle principal, el autobús rojo de dos pisos con turistas en el piso superior.'
      },
      {
        id: 'retiro_lake',
        name: 'El Retiro Park Rowing Boats',
        nameSpanish: 'Barquitas del Estanque de El Retiro',
        icon: '🛶',
        xPercent: 81.5,
        yPercent: 16.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the peaceful park background on the upper right, locate the small blue rowboats gliding across the pond!”',
        clueSpanish: 'En el parque arriba a la derecha, las barcas de remos azules en el estanque del Palacio de Cristal.'
      }
    ]
  },

  // 13. VALENCIA, SPAIN (Ciudad de las Artes y las Ciencias)
  {
    id: 'valencia',
    levelNumber: 13,
    cityName: 'Valencia',
    countryName: 'Spain',
    countryFlag: '🇪🇸',
    title: 'Ciudad de las Artes & Paella • Valencia',
    difficulty: 'Hard',
    xpReward: 90,
    timeLimitSeconds: 45,
    imageUrl: '/images/wheres_guaky/wheres_guaky_valencia_1792443056744.jpg',
    storyContext: 'El futurista complejo blanco de la Ciudad de las Artes y las Ciencias, los huertos de naranjos valencianos, las Fallas y la gran paella cocinada a leña. Güaky aprende ciencias y fotosíntesis en inglés.',
    learningFocus: 'Unit 1 Science & Food: Wooden Spoon, Giant Paella, Arts & Sciences Dome, Orange Groves.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky with Wooden Paella Spoon',
        nameSpanish: 'Güaky con Cuchara de Madera',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 49.5,
        yPercent: 52.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am right in the middle between the pool and the orange trees, holding a giant wooden paella spoon!”',
        clueSpanish: 'Güaky está en el centro entre la piscina y los naranjos, sosteniendo una gran cuchara de madera de paella.'
      },
      {
        id: 'giant_paella',
        name: 'Giant Wood-Fired Paella Pan',
        nameSpanish: 'Gran Paella a Fuego de Leña',
        icon: '🥘',
        xPercent: 15.0,
        yPercent: 77.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the lower-left corner, find the huge round black paella pan bubbling over real wood flames with the chefs!”',
        clueSpanish: 'Abajo a la izquierda, la gran paella valenciana sobre fuego de leña con los cocineros con gorros blancos.'
      },
      {
        id: 'arts_sciences',
        name: 'City of Arts & Sciences Curved Dome',
        nameSpanish: 'Cúpula Hemisfèric / Ciencias',
        icon: '🔬',
        xPercent: 29.0,
        yPercent: 26.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“Look at the futuristic white curved building rising over the turquoise reflecting pool!”',
        clueSpanish: 'El futurista edificio blanco con forma de ojo sobre las aguas turquesas del lago artificial.'
      },
      {
        id: 'orange_groves',
        name: 'Sun-Ripened Orange Tree',
        nameSpanish: 'Árbol de Naranjas de Valencia',
        icon: '🍊',
        xPercent: 74.0,
        yPercent: 52.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the green park orchard, find the tree heavy with bright, ripe Valencian oranges!”',
        clueSpanish: 'En el huerto del parque, el árbol cargado de naranjas redondas y brillantes.'
      }
    ]
  },

  // 14. BARCELONA, SPAIN (Sagrada Família & Park Güell)
  {
    id: 'barcelona',
    levelNumber: 14,
    cityName: 'Barcelona',
    countryName: 'Spain',
    countryFlag: '🇪🇸',
    title: 'Sagrada Família & Park Güell • Barcelona',
    difficulty: 'Hard',
    xpReward: 95,
    timeLimitSeconds: 40,
    imageUrl: '/images/wheres_guaky/wheres_guaky_barcelona_1792443072919.jpg',
    storyContext: 'Las torres de la Sagrada Família de Gaudí, los mosaicos del Park Güell con la salamandra de colores, artistas callejeros y la afición del Barça. Güaky comparte tarjetas de conversación en inglés.',
    learningFocus: 'Unit 1 Advanced Cultural Exchange: Mosaic Salamander, Sagrada Família, Barça Fans, Practice Card.',
    targets: [
      {
        id: 'guaky',
        name: 'Güaky on the Mosaic Wall',
        nameSpanish: 'Güaky en el Mosaico de Gaudí',
        icon: '🦜',
        isMainMascot: true,
        xPercent: 52.5,
        yPercent: 69.5,
        hitRadiusPercent: 6.5,
        clueEnglish: '“I am perched on the colorful Gaudí mosaic wall holding my English Practice Card, waving at the crowd!”',
        clueSpanish: 'Güaky está posado en el banco ondulado de mosaicos de colores sosteniendo su tarjeta de práctica de inglés.'
      },
      {
        id: 'sagrada_familia',
        name: 'Sagrada Família Cathedral Towers',
        nameSpanish: 'Torres de la Sagrada Família',
        icon: '⛪',
        xPercent: 52.0,
        yPercent: 20.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“In the center skyline, gaze up at the stone towers and cranes of Gaudí\'s famous basilica!”',
        clueSpanish: 'En el centro del cielo, las majestuosas torres de piedra tallada de la Sagrada Família.'
      },
      {
        id: 'mosaic_lizard',
        name: 'El Drac Mosaic Salamander',
        nameSpanish: 'Salamandra de Mosaico (El Drac)',
        icon: '🦎',
        xPercent: 26.0,
        yPercent: 89.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“At the bottom left fountain, find the famous multicolored mosaic salamander dragon sitting on stone!”',
        clueSpanish: 'En la fuente abajo a la izquierda, la famosa salamandra de mosaico de colores (El Drac de Park Güell).'
      },
      {
        id: 'fc_barcelona',
        name: 'Barça Soccer Squad Fans',
        nameSpanish: 'Afición del Barça (Fútbol)',
        icon: '⚽',
        xPercent: 83.5,
        yPercent: 60.0,
        hitRadiusPercent: 6.5,
        clueEnglish: '“On the right boulevard, find the cheerful kids in blue-and-red striped football jerseys cheering \'Barça!\'!”',
        clueSpanish: 'En el paseo a la derecha, los aficionados con camisetas blaugrana a rayas celebrando un gol.'
      }
    ]
  },

  // 15. GÜAKYTOPIA CENTRAL CAMPUS (El Gran Campus Internacional - Nivel Final)
  {
    id: 'campus_central',
    levelNumber: 15,
    cityName: 'Güakytopia',
    countryName: 'Global Campus',
    countryFlag: '🌴',
    title: 'The Great Campus Courtyard & Library • Güakytopia',
    difficulty: 'Hard',
    xpReward: 100,
    timeLimitSeconds: 40,
    imageUrl: '/images/wheres_guaky/wheres_guaky_campus_1792355974486.jpg',
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPanning, setIsPanning] = useState(false);

  // User identity: Spanglish is ONLY unlocked for our enrolled students
  const isOurUser = Boolean(
    currentStudent && 
    currentStudent.id && 
    currentStudent.id !== 'guest'
  );

  // Games are in English by default. Only our enrolled students can activate Spanglish mode.
  const [spanglishMode, setSpanglishMode] = useState<boolean>(() => {
    if (!currentStudent || currentStudent.id === 'guest') return false;
    const saved = localStorage.getItem(`wheres_guaky_spanglish_${currentStudent.id}`);
    return saved === 'true';
  });

  useEffect(() => {
    if (!isOurUser) {
      setSpanglishMode(false);
    }
  }, [isOurUser]);

  const toggleSpanglish = () => {
    if (!isOurUser) return;
    const next = !spanglishMode;
    setSpanglishMode(next);
    if (currentStudent) {
      localStorage.setItem(`wheres_guaky_spanglish_${currentStudent.id}`, String(next));
    }
  };

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
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  // Reset loading whenever active scene changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [activeSceneIndex]);

  // Escape key exits fullscreen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1 || !boardContainerRef.current) return;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: boardContainerRef.current.scrollLeft,
      scrollTop: boardContainerRef.current.scrollTop
    };
    hasMovedRef.current = false;
    setIsPanning(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !dragStartRef.current || !boardContainerRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMovedRef.current = true;
      boardContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
      boardContainerRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    dragStartRef.current = null;
  };

  const handleStartMission = () => {
    setSecondsRemaining(scene.timeLimitSeconds);
    setGameStatus('searching');
    setClickFeedback(null);
    setClickedCoords(null);
    setShowClue(false);
    setFoundTargetsInScene({});
    setSelectedTargetIndex(0);
    playSfx('start');

    // Smoothly scroll the interactive board into view so the user has the full playing area visible
    setTimeout(() => {
      boardContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the user was dragging/panning the board, do not register as a missed target click
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
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
                World Tour Edition • Where&apos;s Güaky?
              </span>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {totalCompletedScenes} of {WORLD_TOUR_SCENES.length} Cities Unlocked
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Where&apos;s Güaky? • World Tour</span>
              <span className="text-3xl animate-bounce">🌍🦜</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Travel through the world&apos;s greatest metropolises solving vocabulary missions in giant <em>Where&apos;s Waldo</em> style illustrations.
              Find <strong>Güaky</strong> and the <strong>hidden English vocabulary items</strong> nestled among hundreds of bustling characters.
            </p>

            {/* Language Mode: 100% English by default. Spanglish is exclusive for enrolled flock members. */}
            <div className="pt-2 flex items-center gap-2">
              {isOurUser ? (
                <div className="flex items-center gap-2 bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20 text-xs">
                  <span className="text-slate-300 text-[11px]">Game Language:</span>
                  <button
                    type="button"
                    onClick={toggleSpanglish}
                    className={`px-2.5 py-0.5 rounded-full font-bold transition-all text-[11px] flex items-center gap-1.5 ${
                      spanglishMode
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span>{spanglishMode ? '🌴 Spanglish (Flock Member Mode)' : '🇺🇸 English (Default)'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-200 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full border border-white/15">
                  <span>🇺🇸</span>
                  <span>Game Language: <strong>English</strong> (Default)</span>
                </div>
              )}
            </div>
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
                World Passport
              </span>
              <p className="text-xs font-black text-white">Current Level: {unlockedLevel}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-200">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Reward: <strong>+{scene.xpReward} XP</strong></span>
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
            World Tour Destinations (Click to travel)
          </span>
          <span className="text-slate-400">Unlock destinations as you advance</span>
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
                  setTimeout(() => {
                    boardContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
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
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Completed
                    </span>
                  ) : !isUnlocked ? (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                      Level {sc.levelNumber}
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
      <div className={`bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4 transition-all ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none border-none p-3 sm:p-5 bg-slate-950 text-white flex flex-col justify-between overflow-hidden' 
          : ''
      }`}>
        
        {/* Top Control Bar: City info, targets checklist, zoom, fullscreen & timer */}
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl border ${
          isFullscreen 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          
          {/* Left: Location & Target Objectives */}
          <div className="space-y-2 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`font-bold px-3 py-1 rounded-xl border shadow-2xs flex items-center gap-1.5 ${
                isFullscreen ? 'bg-slate-800 text-white border-slate-700' : 'text-slate-900 bg-white border-slate-200'
              }`}>
                <span className="text-base">{scene.countryFlag}</span>
                <span>{scene.cityName}, {scene.countryName}</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                {scene.learningFocus}
              </span>
              {zoomLevel > 1 && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1 animate-pulse">
                  <Move className="w-3 h-3" /> Arrastra la pantalla para moverte
                </span>
              )}
            </div>

            {/* Checklist of Hidden Items for this Level */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 line-through opacity-80'
                        : isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs ring-2 ring-amber-300 font-black'
                        : isFullscreen
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{tgt.icon}</span>
                    <span>{tgt.name}</span>
                    {isFound ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Controls & Timer */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {/* Zoom Controls with +/- */}
            <div className={`flex items-center rounded-xl border p-0.5 shadow-2xs ${
              isFullscreen ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => (prev === 1.8 ? 1.4 : prev === 1.4 ? 1 : 1))}
                disabled={zoomLevel <= 1}
                className="p-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Alejar (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${zoomLevel === 1 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                title="Vista panorámica (1x)"
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.4)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${zoomLevel === 1.4 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                title="Zoom medio (1.4x)"
              >
                1.4x
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.8)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${zoomLevel === 1.8 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                title="Zoom máximo (1.8x)"
              >
                1.8x
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(prev => (prev === 1 ? 1.4 : prev === 1.4 ? 1.8 : 1.8))}
                disabled={zoomLevel >= 1.8}
                className="p-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Acercar (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pantalla Completa Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                isFullscreen
                  ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 font-black'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
              title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Expandir a pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Cerrar Pantalla Completa</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pantalla Completa</span>
                </>
              )}
            </button>

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
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs font-black shadow-xs border border-amber-400/30">
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

        {/* FULL WIMMELBILD ILLUSTRATION BOARD (SCROLLABLE & ZOOMABLE & DRAGGABLE) */}
        <div className={`relative w-full rounded-3xl overflow-hidden border-2 border-slate-300 shadow-xl bg-slate-950 ${
          isFullscreen ? 'flex-1 min-h-0' : ''
        }`}>
          
          <div 
            ref={boardContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full overflow-auto scrollbar-thin transition-all select-none relative ${
              isFullscreen 
                ? 'h-full max-h-none' 
                : 'h-[62vh] min-h-[460px] max-h-[700px]'
            } ${isPanning ? 'cursor-grabbing' : zoomLevel > 1 ? 'cursor-grab' : 'cursor-crosshair'}`}
          >
            {/* Loading state for illustration */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white p-2 border-2 border-amber-400 shadow-xl flex items-center justify-center animate-bounce">
                  <img 
                    src="/guaky-mascota.png" 
                    alt="Güaky Oficial" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Cargando escena de {scene.cityName}...</span>
                </div>
                <p className="text-xs text-slate-400">Preparando ilustración y personajes escondidos</p>
              </div>
            )}

            <div 
              ref={boardRef}
              onClick={handleBoardClick}
              className="relative select-none transition-transform origin-top-left"
              style={{
                width: `${zoomLevel * 100}%`,
                minWidth: '100%'
              }}
            >
              {/* THE ULTRA-DETAILED WHERE'S WALDO STYLE ILLUSTRATION */}
              <img
                src={scene.imageUrl}
                alt={`${scene.cityName} - ${scene.title}`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                className={`w-full h-auto block select-none pointer-events-auto transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
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
                  alt="Güaky Oficial" 
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

export const WheresGüakyGame = WheresGuakyGame;
