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
        sbPages: 'Pages 2 to 9',
        wbPages: 'Pages 89 to 92 (Integrated at the back of the book)',
        grammarFocus: 'Verb Be (Singular & Plural) • Possessive Adjectives (my, your, his, her)',
        vocabularyTheme: 'Greetings, Farewells, Courtesy Titles (Mr., Mrs., Miss, Ms.), School Supplies',
        tipCokito: 'Never say "Good night" when arriving at a party! Use "Good evening" to say hello at night, and save "Good night" strictly for going to bed or leaving.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg1/viewform',
        studentBookPdfUrl: 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link',
        workbookPdfUrl: 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link',
        owlCulture: {
          owlTitle: 'Cyber Owl Trivia: Greetings Around the World',
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
            question: 'Choose the correct form of the verb Be: "We _____ students in Teacher Cokitö\'s academy."',
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
          owlTitle: 'Cyber Owl Trivia: The Gods of the Calendar',
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
          owlTitle: 'Cyber Owl Trivia: The World\'s Most Unusual Dream Jobs',
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
          owlTitle: 'Cyber Owl Trivia: Vacation Culture & The Art of Tipping',
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

  // 4. LEVEL VII: MegaGoal 1 (Intermediate B1+ • Module 3 Preview)
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
          owlTitle: 'Cyber Owl Trivia: The Satellite That Started the Space Age',
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
  }
];
