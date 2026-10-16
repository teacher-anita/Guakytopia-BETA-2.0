import json

# Define the units of Level 1 (SuperGoal 1)
level1_units = """      // UNIT 3: What's That?
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
          owlTitle: 'Cyber Owl Trivia: High-Tech Souvenirs',
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
              { number: 2, title: 'Pair Work: Inquiring About Objects', description: 'Asking: "What\\'s this? It\\'s a smartwatch. What are those? They are headphones."' },
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
              { number: 8, title: 'Conversation & Real Talk: Tech Store', description: 'Buying accessories: "How much is that headset? It\\'s really awesome."' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Session C: Reading, Writing & Workbook Practice',
            itemsRange: 'Items 9 to 11 + Workbook Practice',
            workbookPages: 'Pages 97 to 100',
            items: [
              { number: 9, title: 'Reading: Inventions We Can\\'t Live Without', description: 'Short article on the evolution of personal communications.' },
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
          owlTitle: 'Cyber Owl Trivia: The Global Passport',
          topic: 'How international greeting etiquettes vary',
          didYouKnow: 'English is an official language in over 50 countries and spoken by over 1.5 billion people worldwide.',
          culturalStory: 'In international summits, saying "Where are you based?" is often preferred to "Where are you from?" for global nomads.',
          inOnAtRule: 'Use "FROM" for origin (I\\'m from Caracas), "IN" for residence (I live in London).'
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
          owlTitle: 'Cyber Owl Trivia: The Milestone Celebration',
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
        grammarFocus: 'Verb Have / Has • Possessive Nouns (Apostrophe \\'s) • How Many...? • Descriptive Adjectives',
        vocabularyTheme: 'Family members: parents, grandparents, siblings, aunt, uncle, cousin, nephew, niece; Physical appearance',
        tipCokito: 'Watch out: "He has" and "She has", but "I have", "You have", "They have". Do not say "He haves"!',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit5-sg1/viewform',
        owlCulture: {
          owlTitle: 'Cyber Owl Trivia: Family Terms Worldwide',
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
              { number: 3, title: 'Grammar Focus: Have / Has & Apostrophe \\'s', description: 'Rules for possessive nouns (my sister\\'s car, John\\'s parents) and Have/Has.' },
              { number: 4, title: 'Language in Context: Photo Album', description: 'Describing family photos: "This is my aunt. She has brown eyes and curly hair."' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Session B: Pronunciation & Real Talk',
            itemsRange: 'Items 5 to 8',
            items: [
              { number: 5, title: 'Listening Comprehension: Family Descriptions', description: 'Identifying family members from an audio conversation.' },
              { number: 6, title: 'Pronunciation: Contracted \\'s vs Possessive \\'s', description: 'Distinguishing "He\\'s tall" (he is) from "Tom\\'s dog" (possession).' },
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
          owlTitle: 'Cyber Owl Trivia: Architecture Around the World',
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
              { number: 2, title: 'Pair Work: Inquiring About Amenities', description: 'Asking: "Is there a balcony? Yes, there is. Are there two bathrooms? No, there aren\\'t."' },
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
          owlTitle: 'Cyber Owl Trivia: The 15-Minute City',
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
              { number: 2, title: 'Pair Work: Asking for Directions', description: 'Asking: "Where is the post office? It\\'s on Maple Street, across from the bank."' },
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
              { number: 8, title: 'Conversation & Real Talk: Asking a Local', description: 'Dialogue: "Are you from around here? You can\\'t miss it!"' }
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
          owlTitle: 'Cyber Owl Trivia: The World In Motion',
          topic: 'Time zones and simultaneous human activities',
          didYouKnow: 'While someone is eating breakfast in New York at 8:00 AM, someone in Tokyo is sleeping at 10:00 PM!',
          culturalStory: 'In English casual conversation, greeting someone with "What are you doing?" often just means "What\\'s up?".',
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
              { number: 7, title: 'About You Form: Today\\'s Outfit & Activities', description: 'Describing your clothing style today and your current weekly hobbies.' },
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
          owlTitle: 'Cyber Owl Trivia: Celebrating Level 1 Mastery',
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
"""

print("Level 1 units string ready!")
