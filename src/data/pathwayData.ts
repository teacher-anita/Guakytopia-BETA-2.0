export interface OwlCultureCorner {
  owlTitle: string;
  topic: string;
  didYouKnow: string;
  culturalStory: string;
  inOnAtRule?: string;
  externalLink?: {
    label: string;
    url: string;
  };
}

export interface PathwaySession {
  sessionCode: 'A' | 'B' | 'C';
  sessionName: string;
  description?: string;
  itemsRange: string;
  items: {
    number: number;
    title: string;
    description: string;
    audioTrack?: string;
  }[];
  workbookPages?: string;
  practiceInteractive?: string;
}

export interface UnitQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PathwayUnit {
  unitNumber: number;
  title: string;
  bookTitle: string;
  isExpansion?: boolean;
  expansionLabel?: string;
  displayOrder?: number;
  studentBookCode?: string; // Standard format: SG01-SB-U01
  workbookCode?: string;    // Standard format: SG01-WB-U01
  sbPages: string;
  wbPages: string;
  grammarFocus: string;
  vocabularyTheme: string;
  sessions: PathwaySession[];
  quizQuestions: UnitQuizQuestion[];
  googleFormUrl?: string;
  studentBookPdfUrl?: string;
  workbookPdfUrl?: string;
  tipCokito: string;
  owlCulture: OwlCultureCorner;
}

export interface PathwayLevel {
  levelId: string;
  levelNumber: number;
  levelName: string;
  series: 'SuperGoal' | 'MegaGoal';
  book: string;
  module: number;
  moduleName: string;
  cefrEquiv: string;
  audience: 'kids' | 'adults' | 'all';
  isIntegratedWorkbook: boolean;
  units: PathwayUnit[];
  bossFights: {
    id: string;
    afterUnit: number;
    title: string;
    badgeName: string;
    badgeIcon: string;
    description: string;
    googleFormUrl?: string;
  }[];
}

export const PATHWAY_LEVELS: PathwayLevel[] = [
  // =========================================================================
  // MODULE 1: CONQUER YOUR FEAR (NIVELES I, II y III)
  // =========================================================================

  // 1. LEVEL I: SuperGoal 1 (Beginner A1)
  {
    levelId: 'level_1',
    levelNumber: 1,
    levelName: 'Level I • SuperGoal 1',
    series: 'SuperGoal',
    book: 'Super Goal 1 (Integrated Student Book & Workbook)',
    module: 1,
    moduleName: 'Conquer Your Fear',
    cefrEquiv: 'A1',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m1_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Boss Fight 1',
        badgeName: 'Global Novice 🌍',
        badgeIcon: '🏅',
        description: 'Comprehensive Language Review of Units 1 to 4: Chant Along, greetings, numbers, countries, and classroom objects mastery.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-bossfight-1/viewform'
      },
      {
        id: 'boss_m1_2',
        afterUnit: 8,
        title: 'EXPANSION Units 5–8: Graduation Boss Fight',
        badgeName: 'Master Beginner 🏆',
        badgeIcon: '🎓',
        description: 'Official Level I Certification Test. Unlocks Level II (SuperGoal 2).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-bossfight-2/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Good Morning!',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U01',
        workbookCode: 'SG01-WB-U01',
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92 (Integrated at the back of the book)',
        grammarFocus: 'Verb Be (Singular & Plural) • Possessive Adjectives (my, your, his, her)',
        vocabularyTheme: 'Greetings, Farewells, Courtesy Titles (Mr., Mrs., Miss, Ms.), School Supplies',
        tipCokito: 'Never say "Good night" when arriving at a party! Use "Good evening" to say hello at night, and save "Good night" strictly for going to bed or leaving.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg1/viewform',
        // Student Book (SG01-SB-U01): 17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE
        studentBookPdfUrl: 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link',
        // Workbook (SG01-WB-U01): 13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw
        workbookPdfUrl: 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Greetings Around the World',
          topic: 'Handshakes, Bows & The Anglo-Saxon Rule',
          didYouKnow: 'In English-speaking countries, people generally do NOT kiss on both cheeks when meeting someone for the first time. A firm, confident handshake with direct eye contact is the standard of polite respect.',
          culturalStory: 'In British and North American business etiquette, using "Ms." (pronounced /mɪz/) is the most respectful and neutral title for adult women because it does not assume whether she is married or single.',
          inOnAtRule: 'Time Prepositions: Say "AT 7:00 AM" (precise hour), "IN the morning" (period of the day), but "ON Monday morning" (specific day).',
          externalLink: {
            label: 'BBC Learning English: How to Greet Like a Native',
            url: 'https://www.bbc.co.uk/learningenglish/features/basic-vocabulary'
          }
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Vocabulary & Essential Grammar',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen and Discuss', description: 'Illustrated greetings throughout the day (7:00 am, 1:00 pm, 7:00 pm, 8:00 pm).', audioTrack: 'CD 1 • Track 2' },
              { number: 2, title: 'Pair Work', description: 'Personal introductions: "Hi, I am Carlos. Nice to meet you."', audioTrack: 'CD 1 • Track 3' },
              { number: 3, title: 'Grammar Focus', description: 'Conjugation of Be (I am, You are, He is, She is, We are, They are) & Possessive adjectives.', audioTrack: undefined },
              { number: 4, title: 'Language in Context', description: 'Formal vs Informal greetings & Courtesy titles (Mr., Mrs., Miss, Ms.).' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Audio, Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension', description: 'Spelling names, telephone numbers, and email addresses.', audioTrack: 'CD 1 • Track 4' },
              { number: 6, title: 'Pronunciation Guide', description: 'Rising intonation in Yes/No questions vs Falling intonation in Wh-questions.', audioTrack: 'CD 1 • Track 5' },
              { number: 7, title: 'About You Form', description: 'Completing your personal passport card: First name, Last name, Nationality.' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Airport encounter between Carlos Rodriguez and Rick Morgan.', audioTrack: 'CD 1 • Track 6' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 89 to 92 (Exercises A, B, C, D, E, F & Crossword G)',
            items: [
              { number: 9, title: 'Reading: A New Student!', description: 'Short reading about Ali and Ahmed starting at a new international school.', audioTrack: 'CD 1 • Track 7' },
              { number: 10, title: 'Writing Corner', description: 'Capitalization rules for names, countries, and sentence beginnings.' },
              { number: 11, title: 'Form, Meaning & Function', description: 'Essential classroom objects: pen, pencil, eraser, notebook, scissors.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which greeting is the most appropriate when arriving at a dinner party at 7:30 PM?',
            options: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
            correctIndex: 2,
            explanation: '"Good evening" is used as a polite greeting upon arrival in the evening. "Good night" is strictly reserved for saying goodbye or going to sleep.'
          },
          {
            id: 2,
            question: 'Complete the sentence: "This is my classmate. _____ name is Carlos."',
            options: ['Her', 'His', 'Your', 'Their'],
            correctIndex: 1,
            explanation: 'For a singular male person (Carlos), the correct possessive adjective is "His".'
          },
          {
            id: 3,
            question: 'Choose the correct form of the verb Be: "We _____ students in Güakytopia."',
            options: ['am', 'is', 'are', 'be'],
            correctIndex: 2,
            explanation: 'The pronoun "We" is plural and conjugates with "are".'
          },
          {
            id: 4,
            question: 'In the Classroom Supplies section, what tool do you use to erase pencil markings?',
            options: ['A pen', 'An eraser', 'A highlighter', 'Scissors'],
            correctIndex: 1,
            explanation: 'An eraser is specifically used to remove pencil writing from paper.'
          },
          {
            id: 5,
            question: 'In the reading "A New Student!", which city is Ahmed from?',
            options: ['Riyadh', 'Dammam', 'Abha', 'Jeddah'],
            correctIndex: 2,
            explanation: 'Ahmed explicitly states in his introduction: "I am from Abha."'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'What Day Is Today?',
        bookTitle: 'SuperGoal 1',
        sbPages: 'Pages 10 to 17',
        wbPages: 'Pages 93 to 96 (Integrated Workbook)',
        grammarFocus: 'Possessive \'s • Question Words (What, When, How old) • Prepositions of Time (in, on with dates)',
        vocabularyTheme: 'Days of the week, Months of the year, Numbers 1 to 100, Ordinal numbers (1st to 100th)',
        tipCokito: 'Master the Golden Rule of Time: Use ON for specific days and dates (on Monday, on May 4th), and use IN for months and years (in May, in 2026).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit2-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The Gods of the Calendar',
          topic: 'Why is Wednesday named after an ancient god?',
          didYouKnow: 'The days of the week in English originate from Norse and Roman mythology! Tuesday comes from Tiw (Norse god of war), Wednesday from Woden/Odin, Thursday from Thor (god of thunder), and Friday from Frigg (goddess of love).',
          culturalStory: 'In the United States and Canada, the week on calendars begins on SUNDAY, whereas in the United Kingdom, Europe, and Latin America, the calendar begins on MONDAY. Always check international schedules carefully!',
          inOnAtRule: 'The Pyramid of Time: 🔺 IN (centuries, decades, years, months) ➔ 🔹 ON (days, dates: on Friday, on July 4th) ➔ 🎯 AT (precise time: at 3:00 PM, at noon).',
          externalLink: {
            label: 'Britannica: The Fascinating History of Weekdays',
            url: 'https://www.britannica.com/story/where-do-the-names-of-the-days-of-the-week-come-from'
          }
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Calendar Vocabulary & The Time Pyramid',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: The Master Calendar', description: 'Days of the week (Sunday to Saturday) & Months (January to December).', audioTrack: 'CD 1 • Track 8' },
              { number: 2, title: 'Pair Work: Birthdays & Ages', description: 'Asking and answering birthdays: "When is your birthday? It is in June."', audioTrack: undefined },
              { number: 3, title: 'Grammar: In & On Prepositions', description: 'Rules for "in" with months/years and "on" with exact dates and days of the week.' },
              { number: 4, title: 'Cardinal vs Ordinal Numbers', description: 'Pronouncing cardinal (one, two) vs ordinal numbers (1st, 2nd, 3rd, 4th, 21st).' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation of Ordinals & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening: Event Calendar', description: 'Identifying dates and times in recorded school announcements.', audioTrack: 'CD 1 • Track 9' },
              { number: 6, title: 'Pronunciation /θ/ Sound', description: 'The voiceless interdental sound /θ/ in "fourth, fifth, tenth, twentieth".', audioTrack: 'CD 1 • Track 10' },
              { number: 7, title: 'About You Form', description: 'Completing your personal profile with birth dates of family and friends.' },
              { number: 8, title: 'Conversation: National Holidays', description: 'Talking about vacation days and planning weekend activities.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 93 to 96',
            items: [
              { number: 9, title: 'Reading: School Clubs & Timetables', description: 'Reading schedules of the science club, sports team, and art workshops.' },
              { number: 10, title: 'Writing: Party Invitation', description: 'Composing a birthday party invitation with date, time, and address.' },
              { number: 11, title: 'Project: Classroom Birthday Wall', description: 'Designing the official monthly birthday calendar.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which preposition correctly completes the sentence? "Our live English class is _____ Wednesday."',
            options: ['in', 'at', 'on', 'to'],
            correctIndex: 2,
            explanation: 'Days of the week always require the preposition "ON".'
          },
          {
            id: 2,
            question: 'How do you spell the ordinal number 12th in English words?',
            options: ['twelfth', 'twelveth', 'twelth', 'twenty'],
            correctIndex: 0,
            explanation: 'The letter "v" changes to "f" in the ordinal form: twelfth.'
          },
          {
            id: 3,
            question: 'Complete: "My mother\'s birthday is _____ September."',
            options: ['on', 'in', 'at', 'from'],
            correctIndex: 1,
            explanation: 'When mentioning only the month without a specific day number, use "IN".'
          },
          {
            id: 4,
            question: 'If today is Thursday, what day was the day before yesterday?',
            options: ['Wednesday', 'Tuesday', 'Friday', 'Monday'],
            correctIndex: 1,
            explanation: 'Two days before Thursday is Tuesday.'
          },
          {
            id: 5,
            question: 'What is the correct English question to ask someone their age?',
            options: ['How are you?', 'How old are you?', 'What is your year?', 'When are you?'],
            correctIndex: 1,
            explanation: '"How old are you?" is the standard formula to inquire about someone\'s age.'
          }
        ]
      },

      // UNIT 3: What's That?
      {
        unitNumber: 3,
        displayOrder: 3,
        title: "What's That?",
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U03',
        workbookCode: 'SG01-WB-U03',
        sbPages: 'Pages 18 to 25',
        wbPages: 'Pages 97 to 100',
        grammarFocus: 'Demonstratives (This / That / These / Those) • Indefinite Articles (a / an) • Plural Nouns (-s, -es)',
        vocabularyTheme: 'Personal items: camera, cell phone, key, wallet, sunglasses, pencil, laptop, souvenir',
        tipCokito: 'Remember: THIS and THESE are for items close to you (here), while THAT and THOSE are for items far away (there)!',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit3-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: High-Tech Souvenirs',
          topic: 'What travels in our pockets across continents?',
          didYouKnow: 'The word "souvenir" comes directly from the French verb meaning "to remember".',
          culturalStory: 'In modern airports and hotels across the US and UK, electronic wallets and contactless pay have almost entirely replaced cash.',
          inOnAtRule: 'Say "IN my pocket", "ON the table", and "AT the cash register".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Demonstratives & Personal Belongings',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen and Discuss: Personal Gadgets', description: 'Identifying everyday objects: camera, watch, cell phone, sunglasses, wallet.' },
              { number: 2, title: 'Pair Work: Inquiring About Objects', description: 'Asking: "What\'s this? It\'s a smartwatch. What are those? They are headphones."' },
              { number: 3, title: 'Grammar Focus: This/That/These/Those', description: 'Singular vs Plural demonstratives and regular plurals (-s, -es).' },
              { number: 4, title: 'Language in Context: Lost & Found', description: 'Describing lost items in the academy lobby or airport baggage claim.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation of Plurals & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Bag Check', description: 'Listening to security airport bag descriptions to identify owners.' },
              { number: 6, title: 'Pronunciation: Plural Endings /s/, /z/, /ɪz/', description: 'Distinguishing phonetic sounds in books /s/, pens /z/, and watches /ɪz/.' },
              { number: 7, title: 'About You Form: Everyday Carry', description: 'Listing top 5 essential belongings you never leave home without.' },
              { number: 8, title: 'Conversation & Real Talk: Tech Store', description: 'Buying accessories: "How much is that headset? It\'s really awesome."' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 97 to 100',
            items: [
              { number: 9, title: 'Reading: Inventions We Can\'t Live Without', description: 'Short article on the evolution of personal communications.' },
              { number: 10, title: 'Writing: Museum of Everyday Belongings', description: 'Writing a short catalog entry for a treasured possession.' },
              { number: 11, title: 'Form, Meaning & Function: Imperatives', description: 'Polite classroom commands: Please turn off your mobile phone, Keep quiet.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which demonstrative is used for plural objects close to the speaker?',
            options: ['This', 'That', 'These', 'Those'],
            correctIndex: 2,
            explanation: '"These" is used for multiple items located near the speaker.'
          }
        ]
      },

      // UNIT 4: Around the World
      {
        unitNumber: 4,
        displayOrder: 4,
        title: 'Around the World',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U04',
        workbookCode: 'SG01-WB-U04',
        sbPages: 'Pages 26 to 33',
        wbPages: 'Pages 101 to 104',
        grammarFocus: 'Verb Be with Question Words (Where... from?) • Nationalities • Preposition "from"',
        vocabularyTheme: 'Countries, Nationalities, World Capitals, Languages, Continents',
        tipCokito: 'Always capitalize countries and nationalities in English! Write "Mexican", "Venezuelan", "Japanese", never in lowercase.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit4-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The Global Passport',
          topic: 'How international greeting etiquettes vary',
          didYouKnow: 'English is an official language in over 50 countries and spoken by over 1.5 billion people worldwide.',
          culturalStory: 'In international summits, saying "Where are you based?" is often preferred to "Where are you from?" for global nomads.',
          inOnAtRule: 'Use "FROM" for origin (I\'m from Caracas), "IN" for residence (I live in London).'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Countries & Nationalities',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: World Map', description: 'Countries, flags, and world capital cities across 5 continents.' },
              { number: 2, title: 'Pair Work: Origin & Languages', description: 'Asking: "Where is Sophia from? She is from France. Does she speak French? Yes, she does."' },
              { number: 3, title: 'Grammar Focus: Where from & Nationalities', description: 'Conjugating Be with origin prepositions and nationality suffixes (-an, -ish, -ese).' },
              { number: 4, title: 'Language in Context: Global Conference', description: 'Matching world delegates to their countries and native languages.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Word Stress & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Flight Arrivals', description: 'Listening to international arrival announcements at London Heathrow.' },
              { number: 6, title: 'Pronunciation: Syllable Stress in Nationalities', description: 'Shifting stress: CAnada vs CaNAdian, CHIna vs ChiNESE.' },
              { number: 7, title: 'About You: Dream Travel Destinations', description: 'Discussing countries you would like to visit in your lifetime.' },
              { number: 8, title: 'Conversation & Real Talk: International Youth Camp', description: 'Teens meeting on an exchange trip sharing cultural customs.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 101 to 104',
            items: [
              { number: 9, title: 'Reading: The Global Village', description: 'How communication technology unites people across distant time zones.' },
              { number: 10, title: 'Writing: Country Fact Sheet', description: 'Designing an informational fact sheet about a country of your choice.' },
              { number: 11, title: 'Form, Meaning & Function: Question Words', description: 'Forming accurate questions with What, Who, and Where.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'What is the correct nationality for someone from Spain?',
            options: ['Spaniard', 'Spanish', 'Spainish', 'Spanian'],
            correctIndex: 1,
            explanation: 'The adjective and nationality is "Spanish".'
          }
        ]
      },

      // EXPANSION PACK 1: Units 1–4
      {
        unitNumber: 101,
        displayOrder: 4.5,
        isExpansion: true,
        expansionLabel: '⚡ EXPANSION PACK: Units 1–4 (Review & Boss Fight 1)',
        title: 'EXPANSION Pack: Units 1–4',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-EXP-1-4',
        workbookCode: 'SG01-WB-EXP1',
        sbPages: 'Pages 34 to 39',
        wbPages: 'Pages 105 to 106',
        grammarFocus: 'Comprehensive Review: Verb Be • Demonstratives • Prepositions • Nationalities',
        vocabularyTheme: 'Rhythm Chant, Global Connections, Classroom Review, Cultural Crosswords',
        tipCokito: 'This Expansion Pack is our first major milestone! Consolidate everything from Units 1 to 4 before proceeding to Unit 5.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-bossfight-1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The Milestone Celebration',
          topic: 'Celebrating language milestones',
          didYouKnow: 'Mastering the first 4 units gives you 250+ active words and covers 70% of beginner conversational situations!',
          culturalStory: 'In language academies worldwide, completing Module 1 milestones unlocks conversational badges.',
          inOnAtRule: 'Use "AT the end of the module", "ON test day".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Chant Along & Grammar Consolidation',
            itemsRange: 'Items 1 to 3',
            items: [
              { number: 1, title: 'Chant Along: "Where Are You From?"', description: 'Rhythmic language chant practicing rhythm, intonation, and national origins.' },
              { number: 2, title: 'Grammar Synthesis: Units 1 to 4', description: 'Comprehensive grammar matrix reviewing Be, possessives, and demonstratives.' },
              { number: 3, title: 'Vocabulary Grand Crossword', description: 'Solving the combined thematic puzzle of classroom objects, calendar, and countries.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Cultural Reading & Writing Workshop',
            itemsRange: 'Items 4 to 5',
            items: [
              { number: 4, title: 'Reading: International Student Profiles', description: 'In-depth profile of students studying abroad in Sydney and New York.' },
              { number: 5, title: 'Writing Workshop: My Complete Profile', description: 'Composing a 3-paragraph bio covering greetings, age, origin, and everyday belongings.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Interactive Project & Milestone Test',
            itemsRange: 'Items 6 to 7',
            workbookPages: 'Pages 105 to 106',
            items: [
              { number: 6, title: 'Project: Classroom World Expo', description: 'Presenting a poster representing your dream country or cultural heritage.' },
              { number: 7, title: 'Milestone Assessment: Boss Fight 1', description: 'Official Units 1–4 evaluation testing oral and written competencies.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which of the following is correct?',
            options: ['These is my pen', 'Those are my keys', 'This are my books', 'That are my watch'],
            correctIndex: 1,
            explanation: '"Those" takes plural verb "are" and plural noun "keys".'
          }
        ]
      },

      // UNIT 5: Families, Families
      {
        unitNumber: 5,
        displayOrder: 5,
        title: 'Families, Families',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U05',
        workbookCode: 'SG01-WB-U05',
        sbPages: 'Pages 40 to 47',
        wbPages: 'Pages 107 to 110',
        grammarFocus: 'Verb Have / Has • Possessive Nouns (Apostrophe \'s) • How Many...? • Descriptive Adjectives',
        vocabularyTheme: 'Family members: parents, grandparents, siblings, aunt, uncle, cousin, nephew, niece; Physical appearance',
        tipCokito: 'Watch out: "He has" and "She has", but "I have", "You have", "They have". Do not say "He haves"!',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit5-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Family Terms Worldwide',
          topic: 'How family structures are described in English',
          didYouKnow: 'English uses the term "in-laws" for family acquired by marriage (mother-in-law, brother-in-law).',
          culturalStory: 'In North America and the UK, calling someone by their first name after adolescence is common, but courtesy titles remain respectful for elders.',
          inOnAtRule: 'Use "IN my family", "AT home with family".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Family Tree & Verb Have/Has',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: The Family Tree', description: 'The Martinez and Al-Harbi family trees and relationships.' },
              { number: 2, title: 'Pair Work: Asking About Siblings', description: 'Asking: "Do you have any brothers or sisters? Yes, I have two brothers."' },
              { number: 3, title: 'Grammar Focus: Have / Has & Apostrophe \'s', description: 'Rules for possessive nouns (my sister\'s car, John\'s parents) and Have/Has.' },
              { number: 4, title: 'Language in Context: Photo Album', description: 'Describing family photos: "This is my aunt. She has brown eyes and curly hair."' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Family Descriptions', description: 'Identifying family members from an audio conversation.' },
              { number: 6, title: 'Pronunciation: Contracted \'s vs Possessive \'s', description: 'Distinguishing "He\'s tall" (he is) from "Tom\'s dog" (possession).' },
              { number: 7, title: 'About You Form: Family Heritage', description: 'Writing about your family size, traditions, and favorite gatherings.' },
              { number: 8, title: 'Conversation & Real Talk: Family Reunion', description: 'Talking about relatives: "You look just like your grandfather! Really?"' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 107 to 110',
            items: [
              { number: 9, title: 'Reading: Big Families vs Small Families', description: 'Sociological look at family dynamics and bonds in different cultures.' },
              { number: 10, title: 'Writing: My Family Portrait', description: 'Composing a structured essay describing family members and their occupations.' },
              { number: 11, title: 'Form, Meaning & Function: Descriptive Adjectives', description: 'Word order: Opinion + Size + Age + Color + Noun (a kind, tall, young teacher).' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete: "My sister _____ two daughters."',
            options: ['have', 'has', 'haves', 'is having'],
            correctIndex: 1,
            explanation: 'Third person singular takes "has".'
          }
        ]
      },

      // UNIT 6: Is There a View?
      {
        unitNumber: 6,
        displayOrder: 6,
        title: 'Is There a View?',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U06',
        workbookCode: 'SG01-WB-U06',
        sbPages: 'Pages 48 to 55',
        wbPages: 'Pages 111 to 114',
        grammarFocus: 'There is / There are (Affirmative, Negative, Questions) • Prepositions of Place (in, on, under, behind, next to)',
        vocabularyTheme: 'Rooms of the house (living room, bedroom, kitchen, balcony, yard), Furniture, Appliances',
        tipCokito: 'Use "There is" for one singular item (There is a garden) and "There are" for two or more (There are three bedrooms).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit6-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Architecture Around the World',
          topic: 'How homes reflect local climates and traditions',
          didYouKnow: 'The traditional Japanese home uses sliding doors (fusuma) to transform space dynamically.',
          culturalStory: 'In modern cities, micro-apartments have made multifunction furniture popular.',
          inOnAtRule: 'Say "AT home", "IN the bedroom", "ON the sofa", "UNDER the table".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Rooms & There is / There are',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Dream Homes', description: 'Touring a mountain cabin, a seaside villa, and a downtown loft.' },
              { number: 2, title: 'Pair Work: Inquiring About Amenities', description: 'Asking: "Is there a balcony? Yes, there is. Are there two bathrooms? No, there aren\'t."' },
              { number: 3, title: 'Grammar Focus: There is / There are', description: 'Statements and questions with There is / There are and Prepositions of place.' },
              { number: 4, title: 'Language in Context: Floor Plan', description: 'Furnishing an apartment blueprint with sofas, appliances, and lamps.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Real Estate Tour', description: 'Listening to an apartment viewing audio and checking true/false statements.' },
              { number: 6, title: 'Pronunciation: Sound Linking in "There is / There are"', description: 'Fluid liaison: /ðɛərɪz/ and /ðɛərɑːr/.' },
              { number: 7, title: 'About You Form: My Living Space', description: 'Describing your ideal bedroom setup and views from your window.' },
              { number: 8, title: 'Conversation & Real Talk: Renting an Apartment', description: 'Dialogue with a landlord: "How much is the rent? Does it include utilities?"' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 111 to 114',
            items: [
              { number: 9, title: 'Reading: Unusual Homes of the Planet', description: 'Living in lighthouses, cave dwellings, and floating canal boats.' },
              { number: 10, title: 'Writing: Real Estate Advertisement', description: 'Writing an enticing advertisement to rent or sell a furnished home.' },
              { number: 11, title: 'Form, Meaning & Function: Prepositions of Position', description: 'Specifying positions: between the lamp and desk, across from the sofa.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete: "_____ three windows in the living room."',
            options: ['There is', 'There are', 'They are', 'It is'],
            correctIndex: 1,
            explanation: '"Three windows" is plural, requiring "There are".'
          }
        ]
      },

      // UNIT 7: Where Do You Live?
      {
        unitNumber: 7,
        displayOrder: 7,
        title: 'Where Do You Live?',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U07',
        workbookCode: 'SG01-WB-U07',
        sbPages: 'Pages 56 to 63',
        wbPages: 'Pages 115 to 118',
        grammarFocus: 'Imperatives for Directions • Simple Present (live, work, study) • Prepositions of Location (on the corner of, across from, between)',
        vocabularyTheme: 'Neighborhood places: supermarket, bank, post office, pharmacy, bookstore, cafe, bus station, park',
        tipCokito: 'For directions, use the base imperative: "Turn left", "Go straight", "Cross the street". Never add -ing or to!',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit7-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The 15-Minute City',
          topic: 'Urban design where daily needs are within walking distance',
          didYouKnow: 'The oldest known city maps date back over 4,000 years in ancient Mesopotamia.',
          culturalStory: 'In London and New York, asking someone for directions is easy if you begin politely with "Excuse me, could you tell me where... is?"',
          inOnAtRule: 'Use "ON Oxford Street" (street name), "AT 142 Elm Street" (exact address with number).'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Neighborhood Amenities & Locations',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: City Map', description: 'Exploring a neighborhood grid with banks, cafes, libraries, and subways.' },
              { number: 2, title: 'Pair Work: Asking for Directions', description: 'Asking: "Where is the post office? It\'s on Maple Street, across from the bank."' },
              { number: 3, title: 'Grammar Focus: Directions & Prepositions of Location', description: 'Using Turn right, Go straight for two blocks, Next to, Between A and B.' },
              { number: 4, title: 'Language in Context: City Tour', description: 'Guiding an international tourist to monuments and transit hubs.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Audio Directions', description: 'Following audio prompts on a map to locate hidden landmarks.' },
              { number: 6, title: 'Pronunciation: Intonation in Polite Requests', description: 'Rising pitch on polite openings: "Excuse me? Could you help me?"' },
              { number: 7, title: 'About You Form: My Neighborhood', description: 'Analyzing pros and cons of your hometown or residential area.' },
              { number: 8, title: 'Conversation & Real Talk: Asking a Local', description: 'Dialogue: "Are you from around here? You can\'t miss it!"' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 115 to 118',
            items: [
              { number: 9, title: 'Reading: Famous Neighborhoods of the World', description: 'Cultural exploration of Montmartre in Paris and Greenwich Village in NYC.' },
              { number: 10, title: 'Writing: Directions to My House', description: 'Writing clear step-by-step directions for guests coming to an event.' },
              { number: 11, title: 'Form, Meaning & Function: Prepositions of Motion', description: 'Prepositions: through the park, over the bridge, into the building.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'What is the correct imperative to tell someone to make a right turn?',
            options: ['Turning right', 'Turn right', 'To turn right', 'Turn to right'],
            correctIndex: 1,
            explanation: 'Imperative sentences use the base form of the verb without "to": "Turn right".'
          }
        ]
      },

      // UNIT 8: What Are You Doing?
      {
        unitNumber: 8,
        displayOrder: 8,
        title: 'What Are You Doing?',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-SB-U08',
        workbookCode: 'SG01-WB-U08',
        sbPages: 'Pages 64 to 71',
        wbPages: 'Pages 119 to 122',
        grammarFocus: 'Present Continuous / Progressive (am/is/are + verb-ing) • Questions with What are you doing? • Clothes & Actions',
        vocabularyTheme: 'Daily activities, hobbies, clothing (shirt, jacket, jeans, sneakers, dress), sports',
        tipCokito: 'Present Continuous is for actions happening RIGHT NOW! Remember the formula: Subject + Be (am/is/are) + Verb-ing.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit8-sg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The World In Motion',
          topic: 'Time zones and simultaneous human activities',
          didYouKnow: 'While someone is eating breakfast in New York at 8:00 AM, someone in Tokyo is sleeping at 10:00 PM!',
          culturalStory: 'In English casual conversation, greeting someone with "What are you doing?" often just means "What\'s up?".',
          inOnAtRule: 'Use "AT the moment", "RIGHT NOW", "TODAY".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Actions in Progress & Present Continuous',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Community Center', description: 'People engaged in hobbies: cooking, playing basketball, reading, working on laptop.' },
              { number: 2, title: 'Pair Work: Inquiring Actions', description: 'Asking: "What is Robert doing? He is studying math. What are they wearing? Warm jackets."' },
              { number: 3, title: 'Grammar Focus: Present Progressive Matrix', description: 'Forming affirmative, negative, and questions with am/is/are + verb-ing.' },
              { number: 4, title: 'Language in Context: Live Webcams', description: 'Describing activities occurring simultaneously in webcams around the world.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Ambient Sounds', description: 'Guessing what people are doing based on audio background sounds.' },
              { number: 6, title: 'Pronunciation: The /-ɪŋ/ Ending', description: 'Clean pronunciation of participle endings without nasal distortion.' },
              { number: 7, title: 'About You Form: Today\'s Outfit & Activities', description: 'Describing your clothing style today and your current weekly hobbies.' },
              { number: 8, title: 'Conversation & Real Talk: Phone Check-in', description: 'Chatting on the phone: "Hey, what are you up to? Just chilling at home."' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 119 to 122',
            items: [
              { number: 9, title: 'Reading: A Day in the Life of a Photojournalist', description: 'Following an action photographer documenting wildlife in Patagonia.' },
              { number: 10, title: 'Writing: Social Media Story Post', description: 'Writing an engaging caption describing what you and your friends are doing.' },
              { number: 11, title: 'Form, Meaning & Function: Present Simple vs Continuous', description: 'Contrasting habitual routines (I study every day) with current actions (I am studying now).' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete: "Listen! The baby _____ right now."',
            options: ['cries', 'is crying', 'are crying', 'cried'],
            correctIndex: 1,
            explanation: 'The signal phrase "right now" indicates Present Continuous: "is crying".'
          }
        ]
      },

      // EXPANSION PACK 2: Units 5–8 (Graduation Milestone Level 1)
      {
        unitNumber: 102,
        displayOrder: 8.5,
        isExpansion: true,
        expansionLabel: '🎓 EXPANSION PACK: Units 5–8 & Graduación Nivel 1',
        title: 'EXPANSION Pack: Units 5–8 (Level 1 Capstone)',
        bookTitle: 'SuperGoal 1',
        studentBookCode: 'SG01-EXP-5-8',
        workbookCode: 'SG01-WB-EXP2',
        sbPages: 'Pages 72 to 77',
        wbPages: 'Pages 123 to 124',
        grammarFocus: 'Level 1 Capstone Synthesis: Have/Has • There is/are • Directions • Present Continuous',
        vocabularyTheme: 'Rhythm Chant, Capstone Project, Certification Review, Level 1 Graduation',
        tipCokito: 'Congratulations on reaching the final Expansion Pack of Level 1! Review all 8 units before taking your graduation certification exam.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-bossfight-2/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Celebrating Level 1 Mastery',
          topic: 'From absolute beginner to confident basic speaker (A1 CEFR)',
          didYouKnow: 'Reaching Level 1 completion proves you can communicate basic needs, introduce yourself and family, navigate a city, and talk about everyday items.',
          culturalStory: 'In the international CEFR framework, completing A1 is the foundation for all spontaneous speech.',
          inOnAtRule: 'Use "UPON graduation", "AT the end of Level I".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Chant Along & Grammar Mastery Matrix',
            itemsRange: 'Items 1 to 3',
            items: [
              { number: 1, title: 'Chant Along: "People Everywhere"', description: 'Fluency chant reviewing present continuous actions and family professions.' },
              { number: 2, title: 'Level 1 Comprehensive Grammar Matrix', description: 'Reviewing all tenses and structures learned in Units 1 through 8.' },
              { number: 3, title: 'Vocabulary Grand Finale', description: 'Mastery challenge over all 8 units of SuperGoal 1.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Capstone Reading & Writing Portfolio',
            itemsRange: 'Items 4 to 5',
            items: [
              { number: 4, title: 'Reading: Global Youth Cultures', description: 'Comparing teen lifestyles, schools, and homes across four continents.' },
              { number: 5, title: 'Writing Portfolio: My World Presentation', description: 'Comprehensive personal portfolio synthesizing home, family, city, and daily routine.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Oral Presentation & Level 1 Graduation Exam',
            itemsRange: 'Items 6 to 7',
            workbookPages: 'Pages 123 to 124',
            items: [
              { number: 6, title: 'Capstone Presentation & Role-play', description: 'Live speaking evaluation acting out hotel check-in, asking directions, and family introductions.' },
              { number: 7, title: 'Official Level 1 Graduation Exam (Boss Fight 2)', description: 'Final certification test unlocking Level II (SuperGoal 2).' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which sentence correctly combines Level 1 structures?',
            options: [
              'There is two brothers in my family and he are playing',
              'There are two bedrooms in my house, and my brother is studying in his room',
              'This are my mother and she have brown eyes',
              'Where is you live?'
            ],
            correctIndex: 1,
            explanation: '"There are two bedrooms... and my brother is studying" combines There are and Present Continuous flawlessly.'
          }
        ]
      }

    ]
  },

  // 2. LEVEL II: SuperGoal 2 (Elementary A1+)
  {
    levelId: 'level_2',
    levelNumber: 2,
    levelName: 'Level II • SuperGoal 2',
    series: 'SuperGoal',
    book: 'Super Goal 2 (Integrated Student Book & Workbook)',
    module: 1,
    moduleName: 'Conquer Your Fear',
    cefrEquiv: 'A1+',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m1_sg2_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Boss Fight 1',
        badgeName: 'Career Pioneer 🛠️',
        badgeIcon: '🚀',
        description: 'Comprehensive review of daily routines, professions, workplaces, and abilities with Can/Can\'t.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-sg2-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'What Do You Do?',
        bookTitle: 'SuperGoal 2',
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92 (Integrated Workbook)',
        grammarFocus: 'Simple Present Tense (Affirmative & Negative) • Third person singular endings (-s, -es, -ies) • Wh- Questions with Do/Does',
        vocabularyTheme: 'Occupations: doctor, pilot, chef, mechanic, reporter, architect, graphic designer, flight attendant',
        tipCokito: 'Watch the 3rd person singular in Present Simple! He/She/It verbs must take an -s or -es (He cooks, She teaches, He flies). But in questions with DOES, the verb returns to its base form!',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg2/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The World\'s Most Unusual Dream Jobs',
          topic: 'Did you know people get paid to slide down waterparks?',
          didYouKnow: 'There are real professional jobs called "Water Slide Tester", "Golf Ball Diver" (retrieving lost golf balls from lake hazards), and "Professional Sleeper" (testing luxury hotel beds and mattresses).',
          culturalStory: 'In the US and UK, asking "What do you do?" is one of the most common icebreaker questions at social gatherings. Native speakers usually answer with their role plus company/industry: "I\'m a software engineer at a tech startup."',
          inOnAtRule: 'Workplaces Prepositions: Say "He works AT a hospital" or "IN a bank", but "ON a farm" or "ON an airplane".',
          externalLink: {
            label: 'National Geographic: Extraordinary Careers Around the Globe',
            url: 'https://www.nationalgeographic.com'
          }
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Occupations & Present Simple Rules',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Dream Jobs', description: 'Adnan the high-tech animator and Majid the tennis champion.', audioTrack: 'CD 1 • Track 2' },
              { number: 2, title: 'Pair Work: Inquiring Occupations', description: 'Asking: "What does your father do? He is an architect. Where does he work? In an office."', audioTrack: 'CD 1 • Track 3' },
              { number: 3, title: 'Grammar: Simple Present Statements', description: 'Third person singular changes (-s, -es, -ies) and negative forms with don\'t / doesn\'t.' },
              { number: 4, title: 'Language in Context: Workplaces', description: 'Prepositions: for an airline, in an emergency room, at a news agency.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation /s/ vs /z/ & Conversation',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Workplace Clues', description: 'Listening to 4 professionals describing their daily tasks to guess their jobs.', audioTrack: 'CD 1 • Track 4' },
              { number: 6, title: 'Pronunciation /s/, /z/, /ɪz/', description: 'Distinguishing third person endings: writes /s/, drives /z/, teaches /ɪz/.', audioTrack: 'CD 1 • Track 5' },
              { number: 7, title: 'About You: Career Passions', description: 'What profession inspires you most and why?' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Steve and Adel discussing web development and architecture on a park bench.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading "Follow Your Dream" & Workbook',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 89 to 92',
            items: [
              { number: 9, title: 'Reading: Follow Your Dream', description: 'The inspirational story of 16-year-old Omar Hamdan and his journey in soccer.', audioTrack: 'CD 1 • Track 6' },
              { number: 10, title: 'Writing: Career Essay', description: 'Using "because" to state reasons and "so" to express consequences.' },
              { number: 11, title: 'Form, Meaning & Function', description: 'Questions with Why and answers with Because.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'What does the common idiom "What do you do?" mean in English?',
            options: ['What are you doing right now?', 'What is your job or profession?', 'What do you want to eat?', 'How do you feel?'],
            correctIndex: 1,
            explanation: '"What do you do?" is the standard idiom meaning "What is your profession / What do you do for a living?".'
          },
          {
            id: 2,
            question: 'Choose the correct third-person form: "Fahd is a pilot. He _____ airplanes for an international airline."',
            options: ['fly', 'flys', 'flies', 'flying'],
            correctIndex: 2,
            explanation: 'Verbs ending in a consonant + "y" change to "-ies" in third person singular: fly -> flies.'
          },
          {
            id: 3,
            question: 'Where does an executive chef usually work?',
            options: ['In a courtroom', 'In a restaurant kitchen', 'At the airport gate', 'In a hospital pharmacy'],
            correctIndex: 1,
            explanation: 'A chef works preparing culinary dishes in a professional kitchen or restaurant.'
          },
          {
            id: 4,
            question: 'Complete: "He studies graphic design _____ he loves visual arts."',
            options: ['so', 'because', 'but', 'or'],
            correctIndex: 1,
            explanation: '"Because" is used to introduce the cause or reason.'
          },
          {
            id: 5,
            question: 'In the reading "Follow Your Dream", how old is Omar and what is his dream?',
            options: ['14 years old and science', '16 years old and professional football (soccer)', '20 years old and architecture', '18 years old and pilot'],
            correctIndex: 1,
            explanation: 'The text states: "Omar Hamdan is sixteen years old and plays on the school soccer team."'
          }
        ]
      }
    ]
  },

  // 3. LEVEL III: SuperGoal 3 (Pre-Intermediate A2 • Mariana's Active Level!)
  {
    levelId: 'level_3',
    levelNumber: 3,
    levelName: 'Level III • SuperGoal 3',
    series: 'SuperGoal',
    book: 'Super Goal 3 (Integrated Student Book & Workbook)',
    module: 1,
    moduleName: 'Conquer Your Fear',
    cefrEquiv: 'A2',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m1_sg3_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Boss Fight 1',
        badgeName: 'Spelling & Grammar Ace ⚡',
        badgeIcon: '👑',
        description: 'Mastery check of Simple Present vs Present Continuous, past time markers, and travel conversation.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-sg3-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Are You Here on Vacation?',
        bookTitle: 'SuperGoal 3',
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92 (Integrated Workbook)',
        grammarFocus: 'Simple Present vs. Present Progressive • Short Answers • Travel & Hospitality Vocabulary',
        vocabularyTheme: 'Airport customs, hotel check-in, nationalities, business vs leisure travel',
        tipCokito: 'Distinguish habits from current actions! "I live in Miami" is a permanent routine (Simple Present). "I am staying at the Grand Hotel this week" is a temporary situation happening right now (Present Progressive).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg3/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Vacation Culture & The Art of Tipping',
          topic: 'Why do North Americans say "vacation" and the British say "holiday"?',
          didYouKnow: 'In the United States and Canada, taking time off work or school is called a "vacation". In the UK, Australia, and New Zealand, it is almost always called "going on holiday"!',
          culturalStory: 'In the United States and Canada, tipping at hotels and restaurants is customary and expected (usually 15% to 20%), whereas in countries like Japan or Iceland, tipping can be considered unusual or even impolite.',
          inOnAtRule: 'Location Prepositions: Say "ON vacation", "ON a cruise", "ON a business trip", but "AT the hotel" and "AT the airport".',
          externalLink: {
            label: 'Travel Etiquette: How to Check In at an International Hotel',
            url: 'https://www.bbc.co.uk/travel'
          }
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Travel Encounters & Contrast of Tenses',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Hotel Reception', description: 'Tourists arriving at the hotel lobby: traveling for business or pleasure?', audioTrack: 'CD 1 • Track 2' },
              { number: 2, title: 'Pair Work: Travel Scenarios', description: 'Asking: "Are you here on vacation? Yes, I am. Where are you staying?"', audioTrack: undefined },
              { number: 3, title: 'Grammar Focus: Simple Present vs Present Continuous', description: 'Contrasting habitual routines with temporary actions in progress right now.' },
              { number: 4, title: 'Language in Context', description: 'Hotel check-in questions, room keys, and passport verification.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Listening, Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension', description: 'Identifying traveler flight numbers, departure gates, and destinations.', audioTrack: 'CD 1 • Track 3' },
              { number: 6, title: 'Pronunciation: Contractions in Short Answers', description: 'Notice that affirmative short answers CANNOT be contracted (Yes, I am — NEVER "Yes, I\'m").', audioTrack: 'CD 1 • Track 4' },
              { number: 7, title: 'About You: Your Dream Destination', description: 'Discussing your most memorable vacation and places on your travel bucket list.' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Polite front-desk dialogue between the hotel clerk and guest.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Travel Writing & Workbook',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 89 to 92',
            items: [
              { number: 9, title: 'Reading: World Famous Tourist Attractions', description: 'Exploring iconic landmarks and global travel trends.', audioTrack: 'CD 1 • Track 5' },
              { number: 10, title: 'Writing: Travel Postcard or Blog Entry', description: 'Writing a short travel postcard to a friend describing hotel amenities.' },
              { number: 11, title: 'Workbook Unlocking: Unit 1 Practice', description: 'Solving crossword and vocabulary exercises in the workbook section.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which sentence correctly describes an action happening at this exact moment?',
            options: ['I live in Caracas.', 'I am sitting at the airport gate right now.', 'I fly every summer.', 'I like vacations.'],
            correctIndex: 1,
            explanation: '"I am sitting... right now" uses the Present Progressive for an action occurring in the instant of speaking.'
          },
          {
            id: 2,
            question: 'Complete the short answer correctly: "Are you here on vacation?" — "Yes, _____."',
            options: ['I am', 'I\'m', 'I do', 'I was'],
            correctIndex: 0,
            explanation: 'Affirmative short answers with Be CANNOT be contracted: always say "Yes, I am", never "Yes, I\'m".'
          },
          {
            id: 3,
            question: 'In hospitality and airport terminology, what is "check-in"?',
            options: ['Paying the final bill when leaving', 'The formal registration process upon arrival', 'Ordering room service food', 'Calling for a taxi cab'],
            correctIndex: 1,
            explanation: '"Check-in" is the standard procedure of registering and receiving your room keys or boarding pass upon arrival.'
          },
          {
            id: 4,
            question: 'Choose the correct preposition: "She is currently _____ vacation with her family."',
            options: ['in', 'at', 'on', 'to'],
            correctIndex: 2,
            explanation: 'The fixed prepositional phrase in English is always "ON vacation".'
          }
        ]
      }
    ]
  },

  // 4. LEVEL IV: SuperGoal 4 (Module 2: Consolidación e Independencia - CEFR A2+/B1)
  {
    levelId: 'level_4',
    levelNumber: 4,
    levelName: 'Level IV • SuperGoal 4',
    series: 'SuperGoal',
    book: 'Super Goal 4 (Integrated Student Book & Workbook)',
    module: 2,
    moduleName: 'Consolidación e Independencia',
    cefrEquiv: 'A2+/B1',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m2_sg4_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Milestone Exam',
        badgeName: 'Independent Speaker 🎙️',
        badgeIcon: '🚀',
        description: 'Comprehensive review of Past Progressive, Simple Past, and life milestones.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-sg4-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'There Was a Good Concert Last Night',
        bookTitle: 'SuperGoal 4',
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92 (Integrated Workbook)',
        grammarFocus: 'Simple Past of BE (Was / Were) • Past Time Expressions • Music & Entertainment',
        vocabularyTheme: 'Concerts, festivals, musical genres, describing past events',
        tipCokito: 'Remember: Use "was" for I/he/she/it and "were" for you/we/they. In questions, put Was/Were first: "Were you at the concert last night?"',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg4/viewform',
        studentBookPdfUrl: 'https://drive.google.com/drive/folders/1mJOxkclFXZ6cSRouNVXgt15j-Y4AVB9a?usp=drive_link',
        workbookPdfUrl: 'https://drive.google.com/drive/folders/1mJOxkclFXZ6cSRouNVXgt15j-Y4AVB9a?usp=drive_link',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Music Festivals & Cultural Gatherings',
          topic: 'How live music experiences differ across global cultures',
          didYouKnow: 'Woodstock in 1969 had over 400,000 attendees and became a defining cultural moment for youth language in America!',
          culturalStory: 'When talking about concerts in English, native speakers frequently say "The atmosphere was electric" or "They brought the house down".',
          inOnAtRule: 'Prepositions with Events: Say "AT the concert", "AT the festival", but "ON stage" and "IN the crowd".',
          externalLink: {
            label: 'Exploring Global Music Culture',
            url: 'https://www.bbc.co.uk/music'
          }
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Vocabulary & Was/Were Grammar',
            description: 'Learn entertainment terminology and master affirmative, negative, and interrogative Was/Were structures.',
            itemsRange: 'Items 1 & 2',
            items: [
              { number: 1, title: 'Listen and Discuss: At the Music Hall', description: 'Review event vocabulary and identify past time markers.' },
              { number: 2, title: 'Grammar: Past Tense of BE (Was/Were)', description: 'Master singular vs plural subject agreement in the past tense.' }
            ],
            workbookPages: 'Pages 89–90'
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Interactive Speaking',
            description: 'Practice the reduction of was/were in fast natural speech and roleplay an event review.',
            itemsRange: 'Items 3 & 4',
            items: [
              { number: 3, title: 'Pronunciation: Was / Were rhythm', description: 'Distinguish stressed vs weak forms in natural speaking.' },
              { number: 4, title: 'Pair Work: Did You Go?', description: 'Interview your partner about their weekend activities.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Mission',
            description: 'Read an article about the world’s biggest music festivals and complete analytical workbook pages.',
            itemsRange: 'Items 5 & 6',
            items: [
              { number: 5, title: 'Reading: Festivals Around the World', description: 'Explore celebration traditions in New Orleans, Rio, and Edinburgh.' },
              { number: 6, title: 'Writing & Workbook Assignment', description: 'Write a 1-paragraph review of an unforgettable event.' }
            ],
            workbookPages: 'Pages 91–92'
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete the sentence: "The concert _____ amazing, but the tickets _____ very expensive."',
            options: ['was / were', 'were / was', 'is / are', 'was / was'],
            correctIndex: 0,
            explanation: '"The concert" is singular (was) and "the tickets" is plural (were).'
          },
          {
            id: 2,
            question: 'Choose the correct question form: "_____ you at home yesterday afternoon?"',
            options: ['Was', 'Were', 'Did', 'Are'],
            correctIndex: 1,
            explanation: 'With subject "you", the past tense of BE is "Were".'
          },
          {
            id: 3,
            question: 'Select the past time expression: "I visited my grandparents _____."',
            options: ['last weekend', 'next month', 'tomorrow', 'now'],
            correctIndex: 0,
            explanation: '"Last weekend" is a past time expression used with simple past.'
          }
        ]
      }
    ]
  },

  // 5. LEVEL VII: MegaGoal 1 (Intermediate B1+ • Module 3 Preview)
  {
    levelId: 'level_7',
    levelNumber: 7,
    levelName: 'Level VII • MegaGoal 1',
    series: 'MegaGoal',
    book: 'Mega Goal 1 (Independent Student Book & Separate Workbook)',
    module: 3,
    moduleName: 'Think in English',
    cefrEquiv: 'B1+',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [
      {
        id: 'boss_m3_mg1_1',
        afterUnit: 3,
        title: 'EXPANSION Units 1–3: Boss Fight 1',
        badgeName: 'Visionary Thinker 🔮',
        badgeIcon: '💎',
        description: 'Technology debate: The Internet — Good or Bad? + Chant Along + Present Perfect Progressive.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-mg1-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Big Changes',
        bookTitle: 'MegaGoal 1',
        sbPages: 'Pages 6 to 19',
        wbPages: 'Pages 1 to 10 (Separate Workbook volume)',
        grammarFocus: 'Simple Present vs. Present Progressive • Simple Past vs. Present Perfect • Past Progressive with When',
        vocabularyTheme: 'Historical milestones: Space Race, Communications Revolution, Global Issues',
        tipCokito: 'Use Simple Past for completed past events with a specific time (in 1957). Use Present Perfect for experiences with no specific time or events that continue into the present.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-mg1/viewform',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The Satellite That Started the Space Age',
          topic: 'How Sputnik 1 changed global telecommunications forever',
          didYouKnow: 'On October 4, 1957, the Soviet Union launched Sputnik 1, the first artificial satellite in history. It was the size of a beach ball and beeped signals for 21 days!',
          culturalStory: 'Between 1892 and 1954, over 12 million immigrants entered the United States through Ellis Island in New York Harbor, seeking new opportunities and freedom.',
          inOnAtRule: 'Historical Dates: Say "IN the 20th century", "IN 1969", but "ON July 20, 1969" (exact day).',
          externalLink: {
            label: 'NASA History: The Apollo 11 Moon Landing Milestone',
            url: 'https://www.nasa.gov'
          }
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: World Milestones & Temporal Contrasts',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Milestones', description: 'The Space Race, Telstar satellite, and global environmental issues.', audioTrack: 'CD 1 • Track 7' },
              { number: 2, title: 'Pair Work: Global Challenges', description: 'Discussing pollution, fresh water access, and global warming.', audioTrack: 'CD 1 • Track 8' },
              { number: 3, title: 'Grammar: Past vs Present Perfect', description: 'Contrasting finished past events (in 1957) with ongoing historical impacts.' },
              { number: 4, title: 'Language in Context: Biographical Timeline', description: 'Interviewing a partner about how their life has transformed over the years.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Ellis Island & Real Talk in Action',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Immigrant Stories', description: 'Audio accounts of families arriving at Ellis Island in New York.', audioTrack: 'CD 1 • Track 9' },
              { number: 6, title: 'Pronunciation: Sentence Stress', description: 'Stressing content words (nouns, main verbs) while reducing structure words.', audioTrack: 'CD 1 • Track 10' },
              { number: 7, title: 'About You: Family Roots', description: 'Questions on family origins, immigration, and cultural heritage.' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Samir and Hans in Berlin. Key idioms: in fact, you see, by the way, fit in.', audioTrack: 'CD 1 • Track 11' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Saudi Vision 2030, Essay & Self-Reflection',
            itemsRange: 'Items 9 to 13 + Separate Workbook',
            workbookPages: 'Workbook Pages 1 to 10',
            items: [
              { number: 9, title: 'Reading: Progress Towards the Future', description: 'Examining sustainable development and technological modernizations.', audioTrack: 'CD 1 • Track 12' },
              { number: 10, title: 'Writing: How the Internet Changed the World', description: 'Writing an argumentative essay comparing analog and digital eras.' },
              { number: 11, title: 'Form, Meaning & Function', description: 'Past progressive interrupted by Simple Past with "when".' },
              { number: 12, title: 'Self-Reflection Competency Checklist', description: 'Unit self-evaluation checklist to rate your mastery before the teacher review.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which tense is required for an event that took place at an exact, completed past date (e.g. in 1969)?',
            options: ['Present Perfect', 'Simple Past', 'Future Progressive', 'Present Continuous'],
            correctIndex: 1,
            explanation: 'When the time is specific and finished (in 1969), Simple Past is strictly used: "The astronauts landed on the moon in 1969."'
          },
          {
            id: 2,
            question: 'In the Real Talk section of Unit 1, what does the idiom "by the way" mean?',
            options: ['To change the subject or introduce a new thought', 'In fact or actually', 'To adapt into a group', 'To be very lucky'],
            correctIndex: 0,
            explanation: '"By the way" is used in spoken English to introduce a fresh topic or side comment.'
          },
          {
            id: 3,
            question: 'Complete the sentence with past interruption: "Hans _____ to campus when he _____ Samir."',
            options: ['walked / was seeing', 'was walking / saw', 'is walking / sees', 'walked / saw'],
            correctIndex: 1,
            explanation: 'The longer ongoing action uses Past Continuous (was walking) and the sudden interruption takes Simple Past (saw).'
          }
        ]
      }
    ]
  },

  // 6. LEVEL V: SuperGoal 5 (Intermediate B1)
  {
    levelId: 'level_5',
    levelNumber: 5,
    levelName: 'Level V • SuperGoal 5',
    series: 'SuperGoal',
    book: 'Super Goal 5',
    module: 2,
    moduleName: 'Consolidación e Independencia',
    cefrEquiv: 'B1',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [],
    units: [
      {
        unitNumber: 1,
        title: 'Since When?',
        bookTitle: 'SuperGoal 5',
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92',
        grammarFocus: 'Present Perfect with Since and For • How long...? • Past Simple vs Present Perfect',
        vocabularyTheme: 'Inventions, milestones, personal achievements, hobbies over time',
        tipCokito: 'Use SINCE for the starting point in time (since 2018), and FOR for the duration of time (for 5 years).',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: How Time Flies',
          topic: 'Duration expressions across history',
          didYouKnow: "The phrase 'Time is money' was first popularized by Benjamin Franklin in 1748.",
          culturalStory: 'In British conversations, speaking of life experiences frequently alternates between Present Perfect and Past Simple.',
          inOnAtRule: 'Use SINCE yesterday, FOR three hours.'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Inventions & Present Perfect',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Inventions Through Decades', description: 'Examining inventions that changed human lifestyle since 1900.' },
              { number: 2, title: 'Pair Work: Inquiring Durations', description: 'Asking: "How long have you lived here? Since 2020."' },
              { number: 3, title: 'Grammar Focus: Present Perfect with Since & For', description: 'Contrasting precise starting points vs duration periods.' },
              { number: 4, title: 'Language in Context: Personal Milestones', description: 'Chronology of sports achievements and hobbies.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Radio Interviews', description: 'Radio profiles of athletes and innovators.' },
              { number: 6, title: 'Pronunciation: Have / Has Weak Forms', description: 'Distinguishing unstressed auxiliary pronunciations in connected speech.' },
              { number: 7, title: 'About You Form: Life Timeline', description: 'Mapping your personal timeline of major accomplishments.' },
              { number: 8, title: 'Conversation & Real Talk: Catching Up', description: 'Dialogue between former colleagues reconnecting after years.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 89 to 92',
            items: [
              { number: 9, title: 'Reading: The Story of Everyday Things', description: 'Historical account of the invention of chocolate and matches.' },
              { number: 10, title: 'Writing: Biography of an Innovator', description: 'Composing a structured profile of an inspiring scientist.' },
              { number: 11, title: 'Form, Meaning & Function: Expressing Purpose', description: 'Using in order to, so that, and to-infinitive.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which word correctly completes: "I have worked here _____ six months"?',
            options: ['since', 'for', 'at', 'during'],
            correctIndex: 1,
            explanation: '"Six months" is a duration of time, so "for" is required.'
          }
        ]
      }
    ]
  },

  // 7. LEVEL VI: SuperGoal 6 (Intermediate II B1+)
  {
    levelId: 'level_6',
    levelNumber: 6,
    levelName: 'Level VI • SuperGoal 6',
    series: 'SuperGoal',
    book: 'Super Goal 6',
    module: 2,
    moduleName: 'Consolidación e Independencia',
    cefrEquiv: 'B1+',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [],
    units: [
      {
        unitNumber: 1,
        title: 'Teen Life',
        bookTitle: 'SuperGoal 6',
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92',
        grammarFocus: 'Gerunds vs Infinitives • Modal Auxiliaries for Advice (should, ought to, had better) • Phrasal Verbs',
        vocabularyTheme: 'Youth culture, life dilemmas, personal goals, digital balance',
        tipCokito: 'Use HAD BETTER when there is a negative consequence if the advice is not followed (e.g. "You had better study or you will fail").',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The Global Teen Voice',
          topic: 'How youth cultures communicate globally',
          didYouKnow: "The word 'teenager' first appeared in print in Popular Science in 1941.",
          culturalStory: 'In international high schools, counseling on study habits emphasizes time management and balance.',
          inOnAtRule: 'Use "ON social media", "IN the afternoon".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Youth Topics & Advice Modals',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Life Choices', description: 'Common dilemmas teens and young adults face regarding career and study.' },
              { number: 2, title: 'Pair Work: Giving Advice', description: 'Using: "What should I do? You ought to talk to your mentor."' },
              { number: 3, title: 'Grammar Focus: Modals of Advice', description: 'Distinguishing should, ought to, and had better in context.' },
              { number: 4, title: 'Language in Context: Advice Column', description: 'Matching reader letters with expert guidance.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: School Podcast', description: 'Students debating school policies and study schedules.' },
              { number: 6, title: 'Pronunciation: Modal Reductions', description: 'Natural fast speech reductions like /ʃʊdə/ for should have.' },
              { number: 7, title: 'About You Form: Future Goals', description: 'Setting short-term and long-term personal objectives.' },
              { number: 8, title: 'Conversation & Real Talk: Peer Discussion', description: 'Discussing preparation for entrance exams.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 89 to 92',
            items: [
              { number: 9, title: 'Reading: Overcoming Obstacles', description: 'Inspiring young leaders making global impacts.' },
              { number: 10, title: 'Writing: Advice Letter', description: 'Writing a structured response to an advice-seeking letter.' },
              { number: 11, title: 'Form, Meaning & Function: Gerunds after Prepositions', description: 'Rules for verb-ing following prepositional phrases.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete: "You look exhausted. You _____ to take a rest."',
            options: ['should', 'ought', 'must', 'had better'],
            correctIndex: 1,
            explanation: '"Ought" is followed by "to" (ought to take a rest).'
          }
        ]
      }
    ]
  },

  // 8. LEVEL VIII: MegaGoal 2 (Intermediate - Advanced B2)
  {
    levelId: 'level_8',
    levelNumber: 8,
    levelName: 'Level VIII • MegaGoal 2',
    series: 'MegaGoal',
    book: 'Mega Goal 2',
    module: 3,
    moduleName: 'Fluidez Avanzada y Debate',
    cefrEquiv: 'B2',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [],
    units: [
      {
        unitNumber: 1,
        title: "You've Got Mail!",
        bookTitle: 'MegaGoal 2',
        sbPages: 'Pages 6 to 19',
        wbPages: 'Pages 1 to 10',
        grammarFocus: 'Prepositional Verbs • Passive Voice in Present & Past • Phrasal Verbs with Two Particles',
        vocabularyTheme: 'Electronic communication, digital security, professional email writing',
        tipCokito: 'Remember: In the Passive Voice, the object of the active sentence becomes the subject: "Alexander Bell invented the telephone" -> "The telephone was invented by Alexander Bell".',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The First Email in History',
          topic: 'How Ray Tomlinson sent the first @ in 1971',
          didYouKnow: 'Ray Tomlinson invented email in 1971 and chose the @ symbol because it meant "at" the host computer!',
          culturalStory: 'In business etiquette, email signatures convey seniority, verified credentials, and corporate tone.',
          inOnAtRule: 'Use "BY email", "ON the server", "AT his inbox".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Digital Communications & Passive Voice',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: The Communication Revolution', description: 'Evolution from carrier pigeons and telegraph to fiber optics.' },
              { number: 2, title: 'Pair Work: Digital Habits Survey', description: 'Surveying screen time and corporate email practices.' },
              { number: 3, title: 'Grammar Focus: Passive Voice Forms', description: 'Forming passive structures in present, past, and future contexts.' },
              { number: 4, title: 'Language in Context: IT Security Protocols', description: 'Analyzing cybersecurity best practices for company networks.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Tech Support Calls', description: 'Troubleshooting digital accounts and connectivity issues.' },
              { number: 6, title: 'Pronunciation: Sentence Rhythm & Intonation in Inquiries', description: 'Falling intonation on formal corporate questions.' },
              { number: 7, title: 'About You Form: Digital Footprint', description: 'Reflecting on personal data safety and social platforms.' },
              { number: 8, title: 'Conversation & Real Talk: Office Negotiations', description: 'Navigating professional deadlines and deliverables.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 1 to 10',
            items: [
              { number: 9, title: 'Reading: The Art of the Corporate Memo', description: 'Analyzing effective executive communication.' },
              { number: 10, title: 'Writing: Professional Inquiries & Invoices', description: 'Drafting formal business communications with clear calls to action.' },
              { number: 11, title: 'Form, Meaning & Function: Relative Clauses', description: 'Defining and non-defining relative clauses in formal text.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Convert to passive: "The team sent the contract yesterday."',
            options: [
              'The contract was sent by the team yesterday.',
              'The contract is sent by the team yesterday.',
              'The team was sent the contract yesterday.',
              'The contract were sent yesterday.'
            ],
            correctIndex: 0,
            explanation: 'Singular object (The contract) + past BE (was) + past participle (sent).'
          }
        ]
      }
    ]
  },

  // 9. LEVEL IX: MegaGoal 3 (Upper-Intermediate B2+)
  {
    levelId: 'level_9',
    levelNumber: 9,
    levelName: 'Level IX • MegaGoal 3',
    series: 'MegaGoal',
    book: 'Mega Goal 3',
    module: 3,
    moduleName: 'Fluidez Avanzada y Debate',
    cefrEquiv: 'B2+',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [],
    units: [
      {
        unitNumber: 1,
        title: 'Connected by Technology',
        bookTitle: 'MegaGoal 3',
        sbPages: 'Pages 6 to 19',
        wbPages: 'Pages 1 to 10',
        grammarFocus: 'Auxiliary Verbs for Emphasis • Conditional Sentences with If & Unless • Inverted Conditionals',
        vocabularyTheme: 'Artificial Intelligence, social robotics, automation, ethics in tech',
        tipCokito: 'Use auxiliary DO/DID for dramatic emphasis: "I DO understand your point!" or "She DID call yesterday!"',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Artificial Intelligence Milestones',
          topic: "From Turing's test to generative neural nets",
          didYouKnow: 'Alan Turing proposed the imitation game in 1950 to evaluate if a machine could exhibit intelligent behavior.',
          culturalStory: 'In modern tech conferences in Silicon Valley and London, speaking persuasively requires conditional hedging.',
          inOnAtRule: 'Use "AT the vanguard", "IN the algorithm".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: AI & Emphatic Auxiliaries',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: The Automated Future', description: 'Debating robotics in healthcare, transportation, and creative arts.' },
              { number: 2, title: 'Pair Work: Technological Dilemmas', description: 'Arguing ethical considerations of automated decisions.' },
              { number: 3, title: 'Grammar Focus: Emphatic Auxiliaries & Advanced Conditionals', description: 'Using do/does/did for conviction and Unless / Provided that.' },
              { number: 4, title: 'Language in Context: Tech Keynote Analysis', description: 'Dissecting rhetorical patterns in executive keynote speeches.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Panel Debate', description: 'Academic panel on data governance and intellectual property.' },
              { number: 6, title: 'Pronunciation: Emphatic Stress & Pitch Peaks', description: 'Placing melodic pitch peaks on auxiliary verbs to convey conviction.' },
              { number: 7, title: 'About You Form: The Technology You Rely On', description: 'Critiquing dependency on algorithmic feeds and personal gadgets.' },
              { number: 8, title: 'Conversation & Real Talk: Boardroom Strategy', description: 'High-level business discussion on technology adoption.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 1 to 10',
            items: [
              { number: 9, title: 'Reading: The Singularity Debate', description: 'Scholarly overview of machine cognitive evolution.' },
              { number: 10, title: 'Writing: Position Paper', description: 'Composing a persuasive 4-paragraph argument on tech regulation.' },
              { number: 11, title: 'Form, Meaning & Function: Subjunctive Mood', description: 'Formal structures: It is essential that he be present.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete the emphatic sentence: "Although he was quiet, he _____ know the solution!"',
            options: ['did', 'does', 'do', 'was'],
            correctIndex: 0,
            explanation: 'Past tense emphatic auxiliary is "did".'
          }
        ]
      }
    ]
  },

  // 10. LEVEL X: MegaGoal 4 (Advanced C1 Foundation)
  {
    levelId: 'level_10',
    levelNumber: 10,
    levelName: 'Level X • MegaGoal 4',
    series: 'MegaGoal',
    book: 'Mega Goal 4',
    module: 4,
    moduleName: 'Maestría Cognitiva y Profesional',
    cefrEquiv: 'C1',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [],
    units: [
      {
        unitNumber: 1,
        title: "There's No Place Like Home",
        bookTitle: 'MegaGoal 4',
        sbPages: 'Pages 6 to 19',
        wbPages: 'Pages 1 to 10',
        grammarFocus: 'Inversion with Negative Adverbials • Cleft Sentences (It was... that) • Nuanced Discourse Markers',
        vocabularyTheme: 'Cultural belonging, diaspora, architectural heritage, national identity',
        tipCokito: 'Inversion happens when a negative word starts the sentence: "Never have I seen such beauty" instead of "I have never seen".',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: The Global Concept of Home',
          topic: 'Untranslatable concepts of home across languages',
          didYouKnow: "The Welsh word 'Hiraeth' and Portuguese 'Saudade' describe profound longing for a home that may no longer exist.",
          culturalStory: 'In high-level C1 academic discourse, cleft sentences allow speakers to place surgical emphasis on key concepts.',
          inOnAtRule: 'Use "AT home in the world", "IN the heart of the community".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Belonging & Inversion Rules',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: The Global Nomad', description: 'Profiles of cultural ambassadors living across three continents.' },
              { number: 2, title: 'Pair Work: Debate on Cultural Identity', description: 'Discussing language preservation in multicultural cities.' },
              { number: 3, title: 'Grammar Focus: Negative Inversion & Cleft Sentences', description: 'Mastering structures: Seldom do we witness, What we need is...' },
              { number: 4, title: 'Language in Context: Diplomatic Speech Analysis', description: 'Examining rhetorical figures in United Nations cultural addresses.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Literary Podcast', description: 'Critical analysis of contemporary travel memoirs.' },
              { number: 6, title: 'Pronunciation: Dramatic Intonation in Inversion', description: 'Vocal inflection signaling literary emphasis.' },
              { number: 7, title: 'About You Form: The Meaning of Heritage', description: 'Essay reflection on roots, family diaspora, and citizenship.' },
              { number: 8, title: 'Conversation & Real Talk: Diplomatic Exchange', description: 'Negotiating cross-cultural collaborations with high tact.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 1 to 10',
            items: [
              { number: 9, title: 'Reading: Architecture and Memory', description: 'Essay on how urban monuments preserve historical consciousness.' },
              { number: 10, title: 'Writing: Academic Essay with Cleft Focus', description: 'Composing an analytical thesis on urban identity.' },
              { number: 11, title: 'Form, Meaning & Function: Sophisticated Transitionals', description: 'Using albeit, nonetheless, notwithstanding in formal prose.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Complete the inverted sentence: "Rarely _____ such dedication to international peace."',
            options: ['we have seen', 'have we seen', 'we saw', 'did we saw'],
            correctIndex: 1,
            explanation: 'Negative adverbials like "Rarely" require subject-auxiliary inversion: "have we seen".'
          }
        ]
      }
    ]
  },

  // 11. LEVEL XI: MegaGoal 5 (Advanced C1+ Mastery)
  {
    levelId: 'level_11',
    levelNumber: 11,
    levelName: 'Level XI • MegaGoal 5',
    series: 'MegaGoal',
    book: 'Mega Goal 5',
    module: 4,
    moduleName: 'Maestría Cognitiva y Profesional',
    cefrEquiv: 'C1+',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [],
    units: [
      {
        unitNumber: 1,
        title: 'Two Is Better Than One',
        bookTitle: 'MegaGoal 5',
        sbPages: 'Pages 6 to 19',
        wbPages: 'Pages 1 to 10',
        grammarFocus: 'Advanced Subordination • Subjunctive Structures • Participle Clauses',
        vocabularyTheme: 'Symbiosis, corporate mergers, diplomatic alliances, collaborative science',
        tipCokito: 'Use Participle Clauses to make your English concise and elegant: "Having completed the trial, the researchers published the study" instead of "After they had completed...".',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Synergy in Science and Nature',
          topic: 'How mutualistic bonds shape ecosystems and business',
          didYouKnow: 'The Human Genome Project succeeded ahead of schedule because 20 international labs collaborated openly.',
          culturalStory: 'In international multilateral summits, speaking with precision requires mastery of participle clauses.',
          inOnAtRule: 'Use "IN synergy", "AT the summit".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Alliances & Participle Clauses',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: The Power of Two', description: 'Examining successful historical partnerships from Watson & Crick to Apple & Jobs.' },
              { number: 2, title: 'Pair Work: Strategic Synergy Analysis', description: 'Evaluating business mergers and scientific joint ventures.' },
              { number: 3, title: 'Grammar Focus: Participle Clauses (-ing and -ed)', description: 'Synthesizing complex sentences into elegant reduced clauses.' },
              { number: 4, title: 'Language in Context: Executive Joint Statement', description: 'Dissecting diplomatic joint communiqués.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Keynote Press Conference', description: 'Evaluating nuance and subtext in executive Q&A sessions.' },
              { number: 6, title: 'Pronunciation: Rhetorical Pauses & Cadence', description: 'Mastering the rhythm of high-level oratory.' },
              { number: 7, title: 'About You Form: Collaboration Philosophy', description: 'Reflecting on personal teamwork ethics and conflict resolution.' },
              { number: 8, title: 'Conversation & Real Talk: High-Stakes Negotiation', description: 'Finding mutually beneficial compromises under pressure.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 1 to 10',
            items: [
              { number: 9, title: 'Reading: Symbiotic Wonders of the Biosphere', description: 'Biological interdependence as a metaphor for human systems.' },
              { number: 10, title: 'Writing: Executive Partnership Proposal', description: 'Drafting an investment-grade alliance memorandum.' },
              { number: 11, title: 'Form, Meaning & Function: Advanced Connectors of Concession', description: 'Mastering albeit, much as, granted that, even so.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which participle clause correctly reduces: "Because he had studied medicine for a decade, Dr. Alvarez recognized the rare symptom."?',
            options: [
              'Having studied medicine for a decade, Dr. Alvarez recognized the rare symptom.',
              'Studied medicine for a decade, Dr. Alvarez recognized the rare symptom.',
              'Being studied medicine for a decade, Dr. Alvarez recognized the rare symptom.',
              'After studying medicine for a decade, recognizing the rare symptom.'
            ],
            correctIndex: 0,
            explanation: 'The perfect participle "Having studied" cleanly expresses an action completed before the main clause.'
          }
        ]
      }
    ]
  },

  // 12. LEVEL XII: MegaGoal 6 (Executive Fluency & Mastery C2)
  {
    levelId: 'level_12',
    levelNumber: 12,
    levelName: 'Level XII • MegaGoal 6',
    series: 'MegaGoal',
    book: 'Mega Goal 6',
    module: 4,
    moduleName: 'Maestría Cognitiva y Profesional',
    cefrEquiv: 'C2',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [
      {
        id: 'boss_m4_mg6_final',
        afterUnit: 1,
        title: 'C2 Executive Master Capstone: Güakytopia Grand Graduation',
        badgeName: 'World Conqueror 👑',
        badgeIcon: '🏆',
        description: 'The pinnacle of English mastery. Certified spontaneous fluency, persuasive eloquence, and native-level executive competence.',
        googleFormUrl: ''
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Everyone Makes Mistakes',
        bookTitle: 'MegaGoal 6',
        sbPages: 'Pages 6 to 19',
        wbPages: 'Pages 1 to 10',
        grammarFocus: 'Past Modal Auxiliaries for Regret and Speculation • Advanced Subjunctive • Nuanced Register Adaptation',
        vocabularyTheme: 'Crisis management, cognitive biases, historic blunders, philosophical resilience',
        tipCokito: 'Use "Should have + Past Participle" for regret/criticism ("I should have known"), and "Could have / Might have" for past possibilities that did not happen.',
        googleFormUrl: '',
        owlCulture: {
          owlTitle: 'Güaky Trivia: Serendipity from Errors',
          topic: 'How penicillin, pacemakers, and Post-it notes were born from blunders',
          didYouKnow: 'Alexander Fleming discovered penicillin in 1928 because he accidentally left a petri dish uncovered before vacation!',
          culturalStory: 'In native English idioms, saying "To learn the hard way" and "Every cloud has a silver lining" encapsulate philosophical resilience.',
          inOnAtRule: 'Use "IN hindsight", "AT the eleventh hour".'
        },
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Session A: Crisis Management & Past Modals',
            itemsRange: 'Items 1 to 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Fateful Decisions in History', description: "Examining NASA's Challenger review and maritime navigation errors." },
              { number: 2, title: 'Pair Work: Speculating About Alternatives', description: 'Debating: "What could they have done differently to avert the outcome?"' },
              { number: 3, title: 'Grammar Focus: Past Modals (should have, would have, might have)', description: 'Expressing nuanced regret, counterfactual reasoning, and deduction.' },
              { number: 4, title: 'Language in Context: Corporate Post-Mortem', description: 'Conducting a blame-free blameless retrospective analysis.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Investigative Journalism Report', description: 'Dissecting whistle-blower testimonies and investigative findings.' },
              { number: 6, title: 'Pronunciation: Past Modal Triple Reductions', description: 'Mastering native connected speech: /ʃʊdəv/ or /wʊdəv/.' },
              { number: 7, title: 'About You Form: The Lessons that Shaped Me', description: 'Personal philosophical essay on failure as a precursor to mastery.' },
              { number: 8, title: 'Conversation & Real Talk: Executive Crisis Briefing', description: 'Navigating public accountability with composure and authority.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Grand Graduation',
            itemsRange: 'Items 9 to 11 + Master Capstone',
            workbookPages: 'Pages 1 to 10',
            items: [
              { number: 9, title: 'Reading: The Psychology of Error', description: 'Cognitive science of heuristics, confirmation bias, and decision trees.' },
              { number: 10, title: 'Writing: Grand Capstone White Paper', description: 'Drafting an executive white paper offering institutional recommendations.' },
              { number: 11, title: 'C2 Graduation Capstone: The Master Defense', description: 'Live oral defense before Teacher Cokitö and the Academic Council.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: 'Which sentence correctly expresses a past criticism?',
            options: [
              'You should have informed the director before signing the lease.',
              'You must have inform the director before signing the lease.',
              'You should had informed the director before signing the lease.',
              'You could inform the director before signing the lease.'
            ],
            correctIndex: 0,
            explanation: '"Should have + past participle" (should have informed) is used to express past criticism or regret.'
          }
        ]
      }
    ]
  }

];
