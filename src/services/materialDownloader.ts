/**
 * Service to handle downloadable official materials for each unit
 */

export interface UnitDownloadableMaterial {
  unitNumber: number;
  bookTitle: string;
  sbPages: string;
  wbPages: string;
  pdfFileName: string;
  pdfTitle: string;
  pdfDescription: string;
  driveUrl?: string;
  workbookDriveUrl?: string;
  audioPackageUrl?: string;
}

export const getUnitDownloadableMaterial = (levelId: string, unitNumber: number): UnitDownloadableMaterial => {
  if (levelId === 'level_1' && unitNumber === 1) {
    return {
      unitNumber: 1,
      bookTitle: 'Super Goal 1',
      sbPages: 'Pages 2–9',
      wbPages: 'Pages 89–92',
      pdfFileName: 'SuperGoal_1_Unit_1_Student_Book.pdf',
      pdfTitle: 'Super Goal 1 — Unit 1: Good Morning! (Student Book)',
      pdfDescription: 'Student Book oficial de McGraw-Hill (Páginas 2 a 9): Greetings, Introductions, Verb BE, Pronunciation, Conversation, Reading & School Supplies.',
      driveUrl: 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link',
      workbookDriveUrl: 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link',
      audioPackageUrl: '/audio/supergoal1/track02.mp3'
    };
  }

  return {
    unitNumber,
    bookTitle: levelId.startsWith('level_7') || levelId.startsWith('level_8') ? 'Mega Goal' : 'Super Goal',
    sbPages: `Unit ${unitNumber} Pages`,
    wbPages: `Workbook Unit ${unitNumber}`,
    pdfFileName: `Unit_${unitNumber}_Official_Student_Guide.pdf`,
    pdfTitle: `Unit ${unitNumber} Official Course Book & Workbook`,
    pdfDescription: `Material oficial de trabajo para la Unidad ${unitNumber}.`,
    driveUrl: 'https://drive.google.com/drive/folders/1mJOxkclFXZ6cSRouNVXgt15j-Y4AVB9a?usp=drive_link'
  };
};

/**
 * Opens the official student study materials directly from Google Drive (Zero synthetic files!)
 */
export const downloadUnitPdf = (levelId: string, unitNumber: number, unitTitle: string, type: 'student_book' | 'workbook' = 'student_book') => {
  if (levelId === 'level_1' && unitNumber === 1) {
    const url = type === 'workbook'
      ? 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link'
      : 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link';
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  // Fallback to official shared drive folder
  window.open('https://drive.google.com/drive/folders/1mJOxkclFXZ6cSRouNVXgt15j-Y4AVB9a?usp=drive_link', '_blank', 'noopener,noreferrer');
};

export const downloadUnitAudio = (trackNumber: number = 2) => {
  const audioUrl = `/audio/supergoal1/track0${trackNumber}.mp3`;
  const a = document.createElement('a');
  a.href = audioUrl;
  a.download = `SuperGoal1_Audio_Track0${trackNumber}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
