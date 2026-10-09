export interface LabExercise {
  id: number;
  category: 'verb_be' | 'possessives' | 'greetings' | 'vocabulary' | 'dialogue';
  categoryLabel: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'reorder';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface LabModuleExplanation {
  id: string;
  title: string;
  ruleTitle: string;
  ruleSummary: string;
  grammarChart?: {
    subject: string;
    be: string;
    contraction: string;
    possessive: string;
    example: string;
  }[];
  keyTips: string[];
  commonMistake: string;
}

export const UNIT_1_EXPLANATIONS: LabModuleExplanation[] = [
  {
    id: 'exp_verb_be',
    title: "1. The Verb 'Be' (am, is, are)",
    ruleTitle: "Simple Present of Verb 'Be'",
    ruleSummary: "We use the verb 'be' to identify people, introduce yourself, describe roles, and give information. It changes according to the subject.",
    grammarChart: [
      { subject: 'I', be: 'am', contraction: "I'm", possessive: 'my', example: "I am Omar. / I'm a student." },
      { subject: 'You', be: 'are', contraction: "You're", possessive: 'your', example: "You are a teacher. / You're my friend." },
      { subject: 'He (male)', be: 'is', contraction: "He's", possessive: 'his', example: "He is Ahmed. / He's new here." },
      { subject: 'She (female)', be: 'is', contraction: "She's", possessive: 'her', example: "She is Mona. / She's a classmate." },
      { subject: 'It (thing/city)', be: 'is', contraction: "It's", possessive: 'its', example: "It is Riyadh. / It's a great school." },
      { subject: 'We', be: 'are', contraction: "We're", possessive: 'our', example: "We are classmates. / We're friends." },
      { subject: 'They', be: 'are', contraction: "They're", possessive: 'their', example: "They are teachers. / They're from Spain." }
    ],
    keyTips: [
      "Always capitalize the pronoun 'I' everywhere in a sentence.",
      "In questions, swap the order: 'He is a student' -> 'Is he a student?'",
      "Short positive answers don't use contractions: Say 'Yes, I am' (never 'Yes, I'm')."
    ],
    commonMistake: "❌ 'You is my friend' -> ✔️ 'You ARE my friend'."
  },
  {
    id: 'exp_possessives',
    title: "2. Possessive Adjectives (my, your, his, her)",
    ruleTitle: "Showing Ownership or Identity",
    ruleSummary: "Possessive adjectives go BEFORE the noun. They tell us who something belongs to or describes someone's relationship.",
    keyTips: [
      "Use 'his' for a boy or man: 'His name is Rick.'",
      "Use 'her' for a girl or woman: 'Her name is Asma.'",
      "Use 'my' for yourself: 'My name is Carlos.'",
      "Use 'your' when speaking to someone: 'What is your name?'"
    ],
    commonMistake: "❌ Confusing 'He's' (He is) with 'His' (possession). 'He's name is John' is wrong! Correct: 'His name is John.'"
  },
  {
    id: 'exp_greetings',
    title: "3. Greetings & Time of Day Protocol",
    ruleTitle: "When to Say What",
    ruleSummary: "In English, greetings change depending on the time on the clock and the level of formality.",
    keyTips: [
      "Morning (until 12:00 PM): 'Good morning!'",
      "Afternoon (12:00 PM to ~6:00 PM): 'Good afternoon!'",
      "Evening (6:00 PM onwards, when arriving): 'Good evening!'",
      "Bedtime or Leaving at night: 'Good night!' (Never use Good night to say hello).",
      "Casual hello: 'Hi', 'Hello', 'How's it going?', 'How are you?'",
      "Polite titles: Mr. (men), Mrs. (married woman), Miss (unmarried woman), Ms. (any woman)."
    ],
    commonMistake: "❌ Arriving at a party at 8:00 PM and saying 'Good night!' -> You are saying goodbye! Use 'Good evening!'"
  },
  {
    id: 'exp_vocabulary',
    title: "4. Classroom Objects & Questions",
    ruleTitle: "Asking About Things",
    ruleSummary: "Use 'What is this?' / 'What's this?' for objects near you. Answer with 'It's a...' or 'It's an...'.",
    keyTips: [
      "Use 'a' before consonant sounds: a pen, a book, a desk, a notebook, a ruler.",
      "Use 'an' before vowel sounds (a, e, i, o, u): an eraser, an apple.",
      "Plural nouns add -s or -es: one pen -> two pens, one box -> two boxes."
    ],
    commonMistake: "❌ 'It's a eraser' -> ✔️ 'It's AN eraser' (vowel sound)."
  },
  {
    id: 'exp_dialogue',
    title: "5. Real-World Introductions & Farewells",
    ruleTitle: "Meeting Someone for the First Time",
    ruleSummary: "Standard polite phrases to introduce yourself and others in social and professional settings.",
    keyTips: [
      "Introducing someone: 'Omar, this is Ahmed. He is a new student.'",
      "First meeting response: 'Nice to meet you.' -> Reply: 'Nice to meet you, too.'",
      "Saying nicknames: 'My name is Michael, but my friends call me Mike.'",
      "Leaving: 'See you tomorrow', 'See you later', 'Take care', 'Goodbye'."
    ],
    commonMistake: "❌ Replying 'Nice to meet you' with 'Good morning' instead of 'Nice to meet you, too'."
  }
];

// 100 INTERACTIVE EXERCISES FOR UNIT 1 (GOOD MORNING!)
export const UNIT_1_LAB_EXERCISES: LabExercise[] = [
  // ==========================================
  // SECTION 1: VERB 'BE' DRILLS (Exercises 1 to 20)
  // ==========================================
  {
    id: 1,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'multiple_choice',
    question: "Omar _____ a new student in our class.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "is",
    explanation: "Use 'is' for singular third-person subjects (Omar = he)."
  },
  {
    id: 2,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'multiple_choice',
    question: "I _____ very glad to meet you, Carlos.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "am",
    explanation: "Subject 'I' always takes 'am' in simple present."
  },
  {
    id: 3,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'multiple_choice',
    question: "You _____ a wonderful teacher, Mr. Bond.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "are",
    explanation: "Subject 'You' always takes 'are'."
  },
  {
    id: 4,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'multiple_choice',
    question: "Asma and Mona _____ classmates at school.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "are",
    explanation: "Two people (Asma and Mona) make a plural subject (they -> are)."
  },
  {
    id: 5,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'multiple_choice',
    question: "This _____ Mrs. Rivera, Anita's mother.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "is",
    explanation: "'This' referring to one person takes 'is'."
  },
  {
    id: 6,
    category: 'verb_be',
    categoryLabel: "Contractions with Be",
    type: 'multiple_choice',
    question: "Which is the correct contraction for 'He is a student'?",
    options: ["He's a student", "Hes a student", "His a student", "He is'a student"],
    correctAnswer: "He's a student",
    explanation: "The contraction of 'He is' is 'He's' with an apostrophe."
  },
  {
    id: 7,
    category: 'verb_be',
    categoryLabel: "Contractions with Be",
    type: 'multiple_choice',
    question: "Which is the correct contraction for 'They are at the restaurant'?",
    options: ["They're at the restaurant", "Their at the restaurant", "There at the restaurant", "Theyre at the restaurant"],
    correctAnswer: "They're at the restaurant",
    explanation: "'They are' contracts to 'They're'. Do not confuse with 'their' (possession) or 'there' (place)."
  },
  {
    id: 8,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Questions",
    type: 'multiple_choice',
    question: "_____ you Rick Morgan?",
    options: ["Am", "Is", "Are", "Be"],
    correctAnswer: "Are",
    explanation: "In questions with 'you', the verb 'Are' goes first: 'Are you...?'"
  },
  {
    id: 9,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Questions",
    type: 'multiple_choice',
    question: "_____ today your first day at school?",
    options: ["Am", "Is", "Are", "Be"],
    correctAnswer: "Is",
    explanation: "'Today' is a singular subject (it), so it takes 'Is'."
  },
  {
    id: 10,
    category: 'verb_be',
    categoryLabel: "Negative Form of Be",
    type: 'multiple_choice',
    question: "No, I _____ from Riyadh. I am from Abha.",
    options: ["am not", "is not", "aren't", "not am"],
    correctAnswer: "am not",
    explanation: "The negative for 'I' is 'I am not' or 'I'm not'."
  },
  {
    id: 11,
    category: 'verb_be',
    categoryLabel: "Negative Form of Be",
    type: 'multiple_choice',
    question: "Mr. Lang _____ at home right now; he is at work.",
    options: ["isn't", "aren't", "am not", "not is"],
    correctAnswer: "isn't",
    explanation: "'Mr. Lang' is singular (he), so negative is 'is not' / 'isn't'."
  },
  {
    id: 12,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Short Answers",
    type: 'multiple_choice',
    question: "A: Are you a new student? - B: Yes, _____.",
    options: ["I am", "I'm", "I be", "you are"],
    correctAnswer: "I am",
    explanation: "In positive short answers, never use contractions: say 'Yes, I am'."
  },
  {
    id: 13,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Short Answers",
    type: 'multiple_choice',
    question: "A: Is Rick from Spain? - B: No, _____.",
    options: ["he isn't", "he not", "he am not", "he aren't"],
    correctAnswer: "he isn't",
    explanation: "For 'he' in negative short answers, use 'No, he isn't'."
  },
  {
    id: 14,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'fill_blank',
    question: "We _____ happy to welcome you to Riyadh! (Fill in: am, is, are)",
    correctAnswer: "are",
    explanation: "Subject 'We' takes 'are'."
  },
  {
    id: 15,
    category: 'verb_be',
    categoryLabel: "Verb 'Be' Forms",
    type: 'fill_blank',
    question: "It _____ a great school. (Fill in: am, is, are)",
    correctAnswer: "is",
    explanation: "Subject 'It' takes 'is'."
  },
  {
    id: 16,
    category: 'verb_be',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: The sentence 'They is students' is grammatically correct.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "False! 'They' takes 'are': 'They are students'."
  },
  {
    id: 17,
    category: 'verb_be',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: In English, 'I am' can be contracted to 'I'm'.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "True! 'I am' -> 'I'm'."
  },
  {
    id: 18,
    category: 'verb_be',
    categoryLabel: "Word Order",
    type: 'reorder',
    question: "Rearrange the words to make a correct question: [you / Are / student / a / new / ?]",
    options: [
      "Are you a new student?",
      "You are a new student?",
      "A new student are you?",
      "New student are you a?"
    ],
    correctAnswer: "Are you a new student?",
    explanation: "In questions, the verb 'Are' starts the sentence: 'Are you a new student?'"
  },
  {
    id: 19,
    category: 'verb_be',
    categoryLabel: "Plural Be",
    type: 'multiple_choice',
    question: "All our colleagues _____ waiting at the restaurant.",
    options: ["are", "is", "am", "be"],
    correctAnswer: "are",
    explanation: "'Colleagues' is plural (they), so use 'are'."
  },
  {
    id: 20,
    category: 'verb_be',
    categoryLabel: "Sentence Completion",
    type: 'multiple_choice',
    question: "A: How _____ you today? - B: I _____ fine, thank you.",
    options: ["are / am", "is / am", "are / is", "am / are"],
    correctAnswer: "are / am",
    explanation: "'How are you?' matches 'I am fine'."
  },

  // ==========================================
  // SECTION 2: POSSESSIVE ADJECTIVES (Exercises 21 to 40)
  // ==========================================
  {
    id: 21,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'multiple_choice',
    question: "This is my sister. _____ name is Amira.",
    options: ["Her", "His", "My", "Your"],
    correctAnswer: "Her",
    explanation: "'Sister' is female, so use the possessive 'Her'."
  },
  {
    id: 22,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'multiple_choice',
    question: "This is the principal. _____ name is Mr. Lee.",
    options: ["His", "Her", "My", "Their"],
    correctAnswer: "His",
    explanation: "'Mr. Lee' is male, so use 'His'."
  },
  {
    id: 23,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'multiple_choice',
    question: "Hi! I'm Alan. What is _____ name?",
    options: ["your", "his", "her", "my"],
    correctAnswer: "your",
    explanation: "When asking the other person, use 'your': 'What is your name?'"
  },
  {
    id: 24,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'multiple_choice',
    question: "Daniel is a student. _____ friends call him Dan.",
    options: ["His", "Her", "My", "Your"],
    correctAnswer: "His",
    explanation: "Daniel is male, so 'His friends call him Dan'."
  },
  {
    id: 25,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'multiple_choice',
    question: "My mother is a doctor. _____ name is Dr. Martinez.",
    options: ["Her", "His", "Your", "My"],
    correctAnswer: "Her",
    explanation: "Mother is female, so use 'Her'."
  },
  {
    id: 26,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'multiple_choice',
    question: "Good morning class! I'm your teacher. _____ name is Ms. Fatimah.",
    options: ["My", "Your", "His", "Her"],
    correctAnswer: "My",
    explanation: "The teacher speaking of herself says 'My name is Ms. Fatimah'."
  },
  {
    id: 27,
    category: 'possessives',
    categoryLabel: "Possessive vs Contraction",
    type: 'multiple_choice',
    question: "Choose the correct sentence:",
    options: [
      "His name is Ahmed.",
      "He's name is Ahmed.",
      "Hes name is Ahmed.",
      "Him name is Ahmed."
    ],
    correctAnswer: "His name is Ahmed.",
    explanation: "'His' is the possessive adjective. 'He's' means 'He is' (He is name is wrong!)."
  },
  {
    id: 28,
    category: 'possessives',
    categoryLabel: "Possessive vs Contraction",
    type: 'multiple_choice',
    question: "Choose the correct sentence:",
    options: [
      "She's a teacher and her name is Laura.",
      "Her a teacher and she's name is Laura.",
      "She a teacher and his name is Laura.",
      "She's a teacher and she's name is Laura."
    ],
    correctAnswer: "She's a teacher and her name is Laura.",
    explanation: "'She's' (She is) + 'her name' (possession)."
  },
  {
    id: 29,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'fill_blank',
    question: "Tom is talking to Rick. Tom asks: 'Is this _____ first time in Spain?' (my/your/his)",
    correctAnswer: "your",
    explanation: "Tom asks Rick directly: 'Is this your first time in Spain?'"
  },
  {
    id: 30,
    category: 'possessives',
    categoryLabel: "Possessive Adjectives",
    type: 'fill_blank',
    question: "Michael says: 'Hello, I'm Michael. But _____ friends call me Mike.' (my/your/his)",
    correctAnswer: "my",
    explanation: "Michael talking about himself uses 'my friends'."
  },
  {
    id: 31,
    category: 'possessives',
    categoryLabel: "Plural Possessive",
    type: 'multiple_choice',
    question: "We are students. _____ school is very big and modern.",
    options: ["Our", "Their", "Your", "His"],
    correctAnswer: "Our",
    explanation: "Subject 'We' corresponds to possessive 'Our'."
  },
  {
    id: 32,
    category: 'possessives',
    categoryLabel: "Plural Possessive",
    type: 'multiple_choice',
    question: "Adel and Fahd are classmates. _____ favorite subject is English.",
    options: ["Their", "Our", "His", "Her"],
    correctAnswer: "Their",
    explanation: "They (Adel and Fahd) corresponds to 'Their'."
  },
  {
    id: 33,
    category: 'possessives',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: 'Her name is David' is correct English.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "False! David is male, so it must be 'His name is David'."
  },
  {
    id: 34,
    category: 'possessives',
    categoryLabel: "Error Correction",
    type: 'multiple_choice',
    question: "Identify the mistake in: 'This is my brother. Her name is Leo.'",
    options: [
      "'Her' should be 'His'",
      "'my' should be 'your'",
      "'is' should be 'are'",
      "There is no mistake"
    ],
    correctAnswer: "'Her' should be 'His'",
    explanation: "Brother is male, so use 'His'."
  },
  {
    id: 35,
    category: 'possessives',
    categoryLabel: "Fill in the blank",
    type: 'fill_blank',
    question: "This is Fatima. _____ backpack is blue. (his/her/its)",
    correctAnswer: "her",
    explanation: "Fatima is female, so use 'her'."
  },
  {
    id: 36,
    category: 'possessives',
    categoryLabel: "Fill in the blank",
    type: 'fill_blank',
    question: "That dog is cute! _____ tail is wagging. (his/her/its)",
    correctAnswer: "its",
    explanation: "Use 'its' (without apostrophe) for animals or objects."
  },
  {
    id: 37,
    category: 'possessives',
    categoryLabel: "Dialogue Completion",
    type: 'multiple_choice',
    question: "A: What's _____ name? - B: My name's Yasmin.",
    options: ["your", "his", "her", "their"],
    correctAnswer: "your",
    explanation: "'What's your name?' is answered with 'My name's...'"
  },
  {
    id: 38,
    category: 'possessives',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: 'It's' and 'its' mean the exact same thing.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "False! 'It's' = It is (contraction). 'Its' = possessive of it."
  },
  {
    id: 39,
    category: 'possessives',
    categoryLabel: "Possessive Matching",
    type: 'multiple_choice',
    question: "Which pair is correctly matched? (Pronoun -> Possessive)",
    options: [
      "She -> Her",
      "He -> Her",
      "I -> Your",
      "They -> Our"
    ],
    correctAnswer: "She -> Her",
    explanation: "She corresponds to Her."
  },
  {
    id: 40,
    category: 'possessives',
    categoryLabel: "Multiple Choice",
    type: 'multiple_choice',
    question: "Look at Mr. Garcia and Mr. Porter. _____ classroom is down the hall.",
    options: ["Their", "Our", "His", "Its"],
    correctAnswer: "Their",
    explanation: "Two people (plural third person) -> 'Their classroom'."
  },

  // ==========================================
  // SECTION 3: GREETINGS & TIME PROTOCOL (Exercises 41 to 60)
  // ==========================================
  {
    id: 41,
    category: 'greetings',
    categoryLabel: "Time of Day Greetings",
    type: 'multiple_choice',
    question: "The clock shows 8:00 AM. What is the correct greeting?",
    options: ["Good morning!", "Good afternoon!", "Good evening!", "Good night!"],
    correctAnswer: "Good morning!",
    explanation: "Before 12:00 PM, always say 'Good morning!'."
  },
  {
    id: 42,
    category: 'greetings',
    categoryLabel: "Time of Day Greetings",
    type: 'multiple_choice',
    question: "The clock shows 2:30 PM. What is the correct greeting?",
    options: ["Good afternoon!", "Good morning!", "Good night!", "See you tomorrow!"],
    correctAnswer: "Good afternoon!",
    explanation: "Between 12:00 PM and approximately 6:00 PM, use 'Good afternoon!'."
  },
  {
    id: 43,
    category: 'greetings',
    categoryLabel: "Time of Day Greetings",
    type: 'multiple_choice',
    question: "You arrive at a dinner party at 7:30 PM. What should you say upon entering?",
    options: ["Good evening!", "Good night!", "Good morning!", "Goodbye!"],
    correctAnswer: "Good evening!",
    explanation: "'Good evening!' is the greeting when arriving at night."
  },
  {
    id: 44,
    category: 'greetings',
    categoryLabel: "Farewells & Goodbyes",
    type: 'multiple_choice',
    question: "You are going to bed at 10:30 PM. What do you say to your family?",
    options: ["Good night!", "Good evening!", "Good afternoon!", "Hello!"],
    correctAnswer: "Good night!",
    explanation: "'Good night!' is strictly used when going to sleep or parting ways late."
  },
  {
    id: 45,
    category: 'greetings',
    categoryLabel: "Farewells & Goodbyes",
    type: 'multiple_choice',
    question: "Your friend says: 'See you later, Adnan!' What is an appropriate reply?",
    options: ["Bye. Take care!", "Good morning!", "I am a student.", "Nice to meet you."],
    correctAnswer: "Bye. Take care!",
    explanation: "'Bye. Take care!' is a natural and polite farewell."
  },
  {
    id: 46,
    category: 'greetings',
    categoryLabel: "Informal Greetings",
    type: 'multiple_choice',
    question: "A classmate says: 'How's it going?' What is the most natural reply?",
    options: ["Not bad.", "Yes, I do.", "My name is Tom.", "I'm 15."],
    correctAnswer: "Not bad.",
    explanation: "'How's it going?' is casually answered with 'Not bad' or 'Great'."
  },
  {
    id: 47,
    category: 'greetings',
    categoryLabel: "Titles of Courtesy",
    type: 'multiple_choice',
    question: "Which title is used for an adult married woman in English?",
    options: ["Mrs.", "Mr.", "Miss", "Sir"],
    correctAnswer: "Mrs.",
    explanation: "'Mrs.' (pronounced missus) is traditionally for a married woman."
  },
  {
    id: 48,
    category: 'greetings',
    categoryLabel: "Titles of Courtesy",
    type: 'multiple_choice',
    question: "Which title is used for a man, regardless of his marital status?",
    options: ["Mr.", "Mrs.", "Miss", "Ms."],
    correctAnswer: "Mr.",
    explanation: "'Mr.' (pronounced mister) is used for any man."
  },
  {
    id: 49,
    category: 'greetings',
    categoryLabel: "Titles of Courtesy",
    type: 'multiple_choice',
    question: "Which neutral title is used for any woman when marital status is unknown or private?",
    options: ["Ms.", "Mr.", "Master", "Mrs."],
    correctAnswer: "Ms.",
    explanation: "'Ms.' (pronounced miz) is the modern title for any woman."
  },
  {
    id: 50,
    category: 'greetings',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: You should greet your teacher with 'Good night' when entering class at 7:00 PM.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "False! Never say 'Good night' when arriving. Use 'Good evening!'."
  },
  {
    id: 51,
    category: 'greetings',
    categoryLabel: "Intonation",
    type: 'multiple_choice',
    question: "In standard English, WH-questions like 'What's your name?' typically have:",
    options: [
      "Falling intonation (↘)",
      "Rising intonation (↗)",
      "Singing intonation",
      "No change in pitch"
    ],
    correctAnswer: "Falling intonation (↘)",
    explanation: "Information questions (What, Where, How) usually end with falling pitch (↘)."
  },
  {
    id: 52,
    category: 'greetings',
    categoryLabel: "Fill in the blank",
    type: 'fill_blank',
    question: "A: How are you? - B: Fine, _____! (thanks/name/later)",
    correctAnswer: "thanks",
    explanation: "'Fine, thanks' is the standard polite reply."
  },
  {
    id: 53,
    category: 'greetings',
    categoryLabel: "Dialogue Matching",
    type: 'multiple_choice',
    question: "Someone says: 'Hello, George. How are you?' What is the best response?",
    options: [
      "I'm fine, thanks. And you?",
      "Good night.",
      "See you yesterday.",
      "This is my pencil."
    ],
    correctAnswer: "I'm fine, thanks. And you?",
    explanation: "Polite reciprocal inquiry: 'I'm fine, thanks. And you?'."
  },
  {
    id: 54,
    category: 'greetings',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: 'Hi' is more informal than 'Good morning, Mr. Garcia'.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "True! 'Hi' is casual; 'Good morning, Mr. Garcia' is formal."
  },
  {
    id: 55,
    category: 'greetings',
    categoryLabel: "Farewell Phrases",
    type: 'multiple_choice',
    question: "Which of the following is NOT a way to say goodbye?",
    options: [
      "Good evening!",
      "See you tomorrow!",
      "Goodbye!",
      "Take care!"
    ],
    correctAnswer: "Good evening!",
    explanation: "'Good evening!' is a greeting (hello), not a farewell."
  },
  {
    id: 56,
    category: 'greetings',
    categoryLabel: "Vocabulary Identification",
    type: 'multiple_choice',
    question: "What does 'How's it going?' mean?",
    options: [
      "How are you doing?",
      "Where are you going?",
      "What time is it?",
      "Who is that?"
    ],
    correctAnswer: "How are you doing?",
    explanation: "'How's it going?' is a casual way to ask 'How are you?'."
  },
  {
    id: 57,
    category: 'greetings',
    categoryLabel: "Situational",
    type: 'multiple_choice',
    question: "At the airport in Madrid, Carlos meets Rick. He says: 'Welcome to Spain!' What does Rick reply?",
    options: ["Thank you.", "Good night.", "I am starving plane.", "No, I am from Abha."],
    correctAnswer: "Thank you.",
    explanation: "When welcomed, the standard response is 'Thank you!'."
  },
  {
    id: 58,
    category: 'greetings',
    categoryLabel: "Fill in the blank",
    type: 'fill_blank',
    question: "See you _____! (tomorrow/morning/hello - meaning the next day)",
    correctAnswer: "tomorrow",
    explanation: "'See you tomorrow' means we will meet again the next day."
  },
  {
    id: 59,
    category: 'greetings',
    categoryLabel: "Word Puzzle",
    type: 'multiple_choice',
    question: "Unscramble: 'E-R-A-L-T' -> What farewell word is this?",
    options: ["LATER", "ALERT", "ALTER", "RATEL"],
    correctAnswer: "LATER",
    explanation: "'See you LATER!'."
  },
  {
    id: 60,
    category: 'greetings',
    categoryLabel: "Word Puzzle",
    type: 'multiple_choice',
    question: "Unscramble: 'G-N-H-I-T' -> What word goes with 'Good _____'?",
    options: ["NIGHT", "THING", "LIGHT", "RIGHT"],
    correctAnswer: "NIGHT",
    explanation: "'Good NIGHT!'."
  },

  // ==========================================
  // SECTION 4: SCHOOL SUPPLIES & VOCABULARY (Exercises 61 to 80)
  // ==========================================
  {
    id: 61,
    category: 'vocabulary',
    categoryLabel: "School Supplies",
    type: 'multiple_choice',
    question: "You use this object to write in ink. What is it?",
    options: ["A pen", "An eraser", "A ruler", "A backpack"],
    correctAnswer: "A pen",
    explanation: "A pen writes in ink; a pencil writes in graphite."
  },
  {
    id: 62,
    category: 'vocabulary',
    categoryLabel: "School Supplies",
    type: 'multiple_choice',
    question: "You use this object to remove pencil marks from paper. What is it?",
    options: ["An eraser", "A scissors", "A desk", "A notebook"],
    correctAnswer: "An eraser",
    explanation: "An eraser erases pencil mistakes."
  },
  {
    id: 63,
    category: 'vocabulary',
    categoryLabel: "Articles: a vs an",
    type: 'multiple_choice',
    question: "Choose the correct article: 'This is _____ eraser.'",
    options: ["an", "a", "the two", "some"],
    correctAnswer: "an",
    explanation: "Use 'an' before vowel sounds: an eraser."
  },
  {
    id: 64,
    category: 'vocabulary',
    categoryLabel: "Articles: a vs an",
    type: 'multiple_choice',
    question: "Choose the correct article: 'I have _____ notebook on my desk.'",
    options: ["a", "an", "the one", "are"],
    correctAnswer: "a",
    explanation: "Use 'a' before consonant sounds: a notebook."
  },
  {
    id: 65,
    category: 'vocabulary',
    categoryLabel: "School Supplies",
    type: 'multiple_choice',
    question: "You carry your books and supplies to school in a:",
    options: ["backpack", "ruler", "pen", "crayon"],
    correctAnswer: "backpack",
    explanation: "A backpack holds school items."
  },
  {
    id: 66,
    category: 'vocabulary',
    categoryLabel: "School Supplies",
    type: 'multiple_choice',
    question: "You use a _____ to measure centimeters or draw straight lines.",
    options: ["ruler", "scissors", "eraser", "pencil"],
    correctAnswer: "ruler",
    explanation: "A ruler is used to measure length."
  },
  {
    id: 67,
    category: 'vocabulary',
    categoryLabel: "School Supplies",
    type: 'multiple_choice',
    question: "You use _____ to cut paper.",
    options: ["scissors", "a pencil", "a ruler", "an eraser"],
    correctAnswer: "scissors",
    explanation: "Scissors are used for cutting."
  },
  {
    id: 68,
    category: 'vocabulary',
    categoryLabel: "Plural Nouns",
    type: 'multiple_choice',
    question: "One book -> Two _____.",
    options: ["books", "bookes", "bookies", "book"],
    correctAnswer: "books",
    explanation: "Regular plural adds -s: books."
  },
  {
    id: 69,
    category: 'vocabulary',
    categoryLabel: "Plural Nouns",
    type: 'multiple_choice',
    question: "One pencil -> Three _____.",
    options: ["pencils", "penciles", "pencilies", "pencil"],
    correctAnswer: "pencils",
    explanation: "Add -s: pencils."
  },
  {
    id: 70,
    category: 'vocabulary',
    categoryLabel: "Classroom Furniture",
    type: 'multiple_choice',
    question: "The student sits on a _____ and writes on a _____.",
    options: [
      "chair / desk",
      "desk / chair",
      "pen / ruler",
      "backpack / pencil"
    ],
    correctAnswer: "chair / desk",
    explanation: "Sit on a chair, write on a desk."
  },
  {
    id: 71,
    category: 'vocabulary',
    categoryLabel: "Unscramble Vocabulary",
    type: 'multiple_choice',
    question: "Unscramble: 'O-L-S-H-O-C' -> What place is this?",
    options: ["SCHOOL", "CHOSLO", "SCOOL", "SCHOLL"],
    correctAnswer: "SCHOOL",
    explanation: "S-C-H-O-O-L."
  },
  {
    id: 72,
    category: 'vocabulary',
    categoryLabel: "Unscramble Vocabulary",
    type: 'multiple_choice',
    question: "Unscramble: 'D-E-T-N-U-S-T' -> Who studies at school?",
    options: ["STUDENT", "STUNDET", "STUDNET", "STUTEND"],
    correctAnswer: "STUDENT",
    explanation: "S-T-U-D-E-N-T."
  },
  {
    id: 73,
    category: 'vocabulary',
    categoryLabel: "Unscramble Vocabulary",
    type: 'multiple_choice',
    question: "Unscramble: 'D-R-E-N-I-F' -> A person you like and trust is a:",
    options: ["FRIEND", "FINDER", "FRIED", "FIEND"],
    correctAnswer: "FRIEND",
    explanation: "F-R-I-E-N-D."
  },
  {
    id: 74,
    category: 'vocabulary',
    categoryLabel: "Unscramble Vocabulary",
    type: 'multiple_choice',
    question: "Unscramble: 'E-T-E-M' -> 'Nice to _____ you.'",
    options: ["MEET", "TEEM", "METE", "MEAT"],
    correctAnswer: "MEET",
    explanation: "M-E-E-T."
  },
  {
    id: 75,
    category: 'vocabulary',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: We say 'a apple' in standard English.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "False! 'Apple' begins with a vowel sound, so we say 'an apple'."
  },
  {
    id: 76,
    category: 'vocabulary',
    categoryLabel: "Fill in the blank",
    type: 'fill_blank',
    question: "What is this? - It is a _____ (pencil/eraser - yellow writing tool with lead).",
    correctAnswer: "pencil",
    explanation: "Pencil is a writing tool with lead."
  },
  {
    id: 77,
    category: 'vocabulary',
    categoryLabel: "School People",
    type: 'multiple_choice',
    question: "The person in charge of the whole school is the:",
    options: ["principal", "student", "classmate", "child"],
    correctAnswer: "principal",
    explanation: "The principal leads the school (like Mr. Lee in the book)."
  },
  {
    id: 78,
    category: 'vocabulary',
    categoryLabel: "School People",
    type: 'multiple_choice',
    question: "Someone who studies in the same class with you is your:",
    options: ["classmate", "brother", "principal", "driver"],
    correctAnswer: "classmate",
    explanation: "A classmate shares your class."
  },
  {
    id: 79,
    category: 'vocabulary',
    categoryLabel: "Articles",
    type: 'multiple_choice',
    question: "Which of these uses 'an' correctly?",
    options: [
      "an English teacher",
      "an pen",
      "an book",
      "an desk"
    ],
    correctAnswer: "an English teacher",
    explanation: "'English' starts with a vowel sound, so use 'an'."
  },
  {
    id: 80,
    category: 'vocabulary',
    categoryLabel: "Secret Word Mystery",
    type: 'multiple_choice',
    question: "What is the secret 9-letter word formed from all Unit 1 exercises?",
    options: ["GREETINGS", "CLASSROOM", "NOTEBOOKS", "PRINCIPAL"],
    correctAnswer: "GREETINGS",
    explanation: "G-R-E-E-T-I-N-G-S."
  },

  // ==========================================
  // SECTION 5: REAL DIALOGUES & CONVERSATIONS (Exercises 81 to 100)
  // ==========================================
  {
    id: 81,
    category: 'dialogue',
    categoryLabel: "Meeting at the Airport",
    type: 'multiple_choice',
    question: "In the conversation on Page 6, what company colleague meets Rick Morgan?",
    options: ["Carlos Rodriguez", "Ahmed", "Omar", "Mr. Lang"],
    correctAnswer: "Carlos Rodriguez",
    explanation: "Carlos Rodriguez welcomes Rick to Spain."
  },
  {
    id: 82,
    category: 'dialogue',
    categoryLabel: "Meeting at the Airport",
    type: 'multiple_choice',
    question: "Why does Rick Morgan say 'Great. I'm starving'?",
    options: [
      "Because the food on planes is terrible and a big meal is ready.",
      "Because he has no money.",
      "Because he hates Spanish food.",
      "Because he lost his backpack."
    ],
    correctAnswer: "Because the food on planes is terrible and a big meal is ready.",
    explanation: "Rick says: 'The food on planes is terrible!'."
  },
  {
    id: 83,
    category: 'dialogue',
    categoryLabel: "Meeting at School",
    type: 'multiple_choice',
    question: "In the reading 'A New Student!', where is Ahmed from originally?",
    options: ["Abha", "Riyadh", "Madrid", "London"],
    correctAnswer: "Abha",
    explanation: "Ahmed answers: 'I'm from Abha.'."
  },
  {
    id: 84,
    category: 'dialogue',
    categoryLabel: "Meeting at School",
    type: 'multiple_choice',
    question: "Who introduces Ahmed to Omar?",
    options: ["Ali", "Mr. Bond", "Michael", "Mona"],
    correctAnswer: "Ali",
    explanation: "Ali says: 'Omar, this is Ahmed. He is a new student.'."
  },
  {
    id: 85,
    category: 'dialogue',
    categoryLabel: "Nicknames Protocol",
    type: 'multiple_choice',
    question: "Azma says: 'My name is Azma. My friends call me _____.'",
    options: ["Somi", "Mike", "Jenny", "Dan"],
    correctAnswer: "Somi",
    explanation: "Azma's nickname is Somi."
  },
  {
    id: 86,
    category: 'dialogue',
    categoryLabel: "Nicknames Protocol",
    type: 'multiple_choice',
    question: "Michael says: 'My name is Michael. But my friends call me _____.'",
    options: ["Mike", "Micky", "Leo", "Tom"],
    correctAnswer: "Mike",
    explanation: "Michael's friends call him Mike."
  },
  {
    id: 87,
    category: 'dialogue',
    categoryLabel: "Introductions Protocol",
    type: 'reorder',
    question: "Put the dialogue in the correct order: 1. Fine, thanks. 2. Hello, George. How are you? 3. Good afternoon, Mr. Garcia.",
    options: [
      "3 -> 2 -> 1",
      "1 -> 2 -> 3",
      "2 -> 1 -> 3",
      "3 -> 1 -> 2"
    ],
    correctAnswer: "3 -> 2 -> 1",
    explanation: "George greets (3), Mr. Garcia replies (2), George answers (1)."
  },
  {
    id: 88,
    category: 'dialogue',
    categoryLabel: "True or False",
    type: 'true_false',
    question: "True or False: When someone says 'Nice to meet you', you should say 'Nice to meet you, too'.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "True! Adding 'too' is the standard polite echo."
  },
  {
    id: 89,
    category: 'dialogue',
    categoryLabel: "Fill in the blank",
    type: 'fill_blank',
    question: "Nice to meet you, _____! (too/two/to)",
    correctAnswer: "too",
    explanation: "'Too' means 'also' or 'as well'."
  },
  {
    id: 90,
    category: 'dialogue',
    categoryLabel: "Situational Response",
    type: 'multiple_choice',
    question: "You bump into a classmate and say 'I'm sorry.' What is their natural response?",
    options: [
      "No problem / That's OK.",
      "Good morning class.",
      "My name is Ahmed.",
      "See you tomorrow."
    ],
    correctAnswer: "No problem / That's OK.",
    explanation: "'That's OK' or 'No problem' accepts an apology gracefully."
  },
  {
    id: 91,
    category: 'dialogue',
    categoryLabel: "Listening Challenge 1",
    type: 'multiple_choice',
    question: "Audio CD1 Track 5: When you hear 'How's it going?', which response is correct?",
    options: ["Fine, thanks.", "Good night.", "Nice to meet you.", "He's Ahmed."],
    correctAnswer: "Fine, thanks.",
    explanation: "'Fine, thanks' answers 'How's it going?'."
  },
  {
    id: 92,
    category: 'dialogue',
    categoryLabel: "Listening Challenge 2",
    type: 'multiple_choice',
    question: "Audio CD1 Track 5: When someone says 'My name is Steve', you should reply:",
    options: ["Nice to meet you, Steve.", "Good night.", "See you tomorrow.", "I am from Abha."],
    correctAnswer: "Nice to meet you, Steve.",
    explanation: "Reply to an introduction with 'Nice to meet you'."
  },
  {
    id: 93,
    category: 'dialogue',
    categoryLabel: "Listening Challenge 3",
    type: 'multiple_choice',
    question: "Audio CD1 Track 5: When the teacher says 'Good morning, class!', students say:",
    options: ["Good morning, teacher!", "Good night!", "Goodbye!", "Nice to meet you."],
    correctAnswer: "Good morning, teacher!",
    explanation: "Students respond with 'Good morning, teacher!'."
  },
  {
    id: 94,
    category: 'dialogue',
    categoryLabel: "Listening Challenge 4",
    type: 'multiple_choice',
    question: "Audio CD1 Track 5: When someone says 'See you tomorrow', you say:",
    options: ["See you! / Bye!", "Good afternoon!", "What's your name?", "I am hungry."],
    correctAnswer: "See you! / Bye!",
    explanation: "Echo the farewell: 'See you! / Bye!'."
  },
  {
    id: 95,
    category: 'dialogue',
    categoryLabel: "Listening Challenge 5",
    type: 'multiple_choice',
    question: "Audio CD1 Track 5: When someone says 'Good night', the polite reply is:",
    options: ["Good night.", "Good morning.", "Hello.", "Nice to meet you."],
    correctAnswer: "Good night.",
    explanation: "Reply 'Good night' when parting at bedtime."
  },
  {
    id: 96,
    category: 'dialogue',
    categoryLabel: "Pair Work Practice",
    type: 'multiple_choice',
    question: "A: Hi, John. How are you? - B: Fine, Paul. And you? - A: _____.",
    options: ["I'm OK. / I'm fine.", "Good night.", "My name is John.", "This is Spain."],
    correctAnswer: "I'm OK. / I'm fine.",
    explanation: "'I'm OK' or 'I'm fine' completes the exchange."
  },
  {
    id: 97,
    category: 'dialogue',
    categoryLabel: "Greeting Titles",
    type: 'multiple_choice',
    question: "How do you address your male English teacher whose last name is Garcia?",
    options: ["Mr. Garcia", "Mrs. Garcia", "Miss Garcia", "Teacher Garcia"],
    correctAnswer: "Mr. Garcia",
    explanation: "In English, address male teachers as 'Mr. + Last Name'."
  },
  {
    id: 98,
    category: 'dialogue',
    categoryLabel: "Conversation Skills",
    type: 'multiple_choice',
    question: "Which question is used to ask where someone comes from?",
    options: ["Where are you from?", "Who are you from?", "What are you from?", "How are you from?"],
    correctAnswer: "Where are you from?",
    explanation: "'Where are you from?' asks for someone's origin."
  },
  {
    id: 99,
    category: 'dialogue',
    categoryLabel: "Conversation Skills",
    type: 'multiple_choice',
    question: "Ahmed says: 'Welcome to Riyadh.' Ahmed is:",
    options: [
      "Welcoming someone to his city.",
      "Saying goodbye to Omar.",
      "Asking for directions.",
      "Complaining about the food."
    ],
    correctAnswer: "Welcoming someone to his city.",
    explanation: "'Welcome to [City]' is hospitable greeting language."
  },
  {
    id: 100,
    category: 'dialogue',
    categoryLabel: "Grand Mastery Challenge",
    type: 'multiple_choice',
    question: "You meet an international classmate at 9:00 AM. What is the most complete, courteous introduction?",
    options: [
      "Good morning! My name is Alex. It's nice to meet you.",
      "Good night! He is Alex. Bye.",
      "See you tomorrow! You are teacher.",
      "I'm starving. What is this?"
    ],
    correctAnswer: "Good morning! My name is Alex. It's nice to meet you.",
    explanation: "Combines time-appropriate greeting ('Good morning'), self-introduction ('My name is Alex'), and courtesy phrase ('Nice to meet you')."
  }
];
