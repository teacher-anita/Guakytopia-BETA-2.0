/**
 * Service to handle downloadable official materials for each unit
 * Standard Naming Convention:
 * SG: Super Goal (SG01 = Book 1, SG02 = Book 2, etc.)
 * MG: Mega Goal (MG01 = Book 1, etc.)
 * SB: Student Book
 * WB: WorkBook
 * U: Unit (U01, U02, etc.)
 * Example: SG01-SB-U01 (Super Goal 1, Student Book, Unit 1)
 *          SG01-WB-U01 (Super Goal 1, WorkBook, Unit 1)
 */

export interface UnitDownloadableMaterial {
  unitNumber: number;
  bookTitle: string;
  sbCode: string;
  wbCode: string;
  sbPages: string;
  wbPages: string;
  pdfFileName: string;
  workbookFileName: string;
  pdfTitle: string;
  pdfDescription: string;
  driveUrl?: string; // Student Book Drive URL
  workbookDriveUrl?: string; // Workbook Drive URL
  audioPackageUrl?: string;
}

export const formatMaterialCode = (
  series: 'SG' | 'MG' = 'SG',
  bookNum: number = 1,
  type: 'SB' | 'WB' = 'SB',
  unitNum: number = 1
): string => {
  const bookStr = String(bookNum).padStart(2, '0');
  const unitStr = String(unitNum).padStart(2, '0');
  return `${series}${bookStr}-${type}-U${unitStr}`;
};

export const getUnitDownloadableMaterial = (levelId: string, unitNumber: number): UnitDownloadableMaterial => {
  if (levelId === 'level_1' && unitNumber === 1) {
    return {
      unitNumber: 1,
      bookTitle: 'Super Goal 1',
      sbCode: 'SG01-SB-U01',
      wbCode: 'SG01-WB-U01',
      sbPages: 'Pages 2–9',
      wbPages: 'Pages 89–92',
      pdfFileName: 'SG01-SB-U01.pdf',
      workbookFileName: 'SG01-WB-U01.pdf',
      pdfTitle: 'SG01-SB-U01 • Super Goal 1 — Unit 1: Good Morning! (Student Book)',
      pdfDescription: 'Student Book oficial de McGraw-Hill (Páginas 2 a 9): Greetings, Introductions, Verb BE, Pronunciation, Conversation, Reading & School Supplies.',
      // Student Book (SG01-SB-U01): 17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE
      driveUrl: 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link',
      // Workbook (SG01-WB-U01): 13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw
      workbookDriveUrl: 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link',
      audioPackageUrl: '/audio/supergoal1/track02.mp3'
    };
  }

  const isMega = levelId.startsWith('level_7') || levelId.startsWith('level_8') || levelId.startsWith('level_9');
  const series: 'SG' | 'MG' = isMega ? 'MG' : 'SG';
  const bookNum = parseInt(levelId.replace('level_', ''), 10) || 1;
  const sbCode = formatMaterialCode(series, bookNum, 'SB', unitNumber);
  const wbCode = formatMaterialCode(series, bookNum, 'WB', unitNumber);

  return {
    unitNumber,
    bookTitle: isMega ? 'Mega Goal' : 'Super Goal',
    sbCode,
    wbCode,
    sbPages: `Unit ${unitNumber} Pages`,
    wbPages: `Workbook Unit ${unitNumber}`,
    pdfFileName: `${sbCode}.pdf`,
    workbookFileName: `${wbCode}.pdf`,
    pdfTitle: `${sbCode} • Unit ${unitNumber} Official Student Book`,
    pdfDescription: `Material oficial de trabajo para la Unidad ${unitNumber}.`,
    driveUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc',
    workbookDriveUrl: 'https://drive.google.com/drive/folders/18M-iUz1w4PTH2kaTkoXGj6p02fs1MYtc'
  };
};

/**
 * Opens the official student study materials directly from Google Drive
 * Correctly distinguishes Student Book (SB) from WorkBook (WB)
 */
export const downloadUnitPdf = (levelId: string, unitNumber: number, unitTitle: string, type: 'student_book' | 'workbook' = 'student_book') => {
  if (levelId === 'level_1' && unitNumber === 1) {
    const url = type === 'student_book'
      ? 'https://drive.google.com/file/d/17Oqq95rEd2Qy9fbltoHA_86jYBOoyitE/view?usp=drive_link' // SG01-SB-U01
      : 'https://drive.google.com/file/d/13JNZQ1NpbLF-DodPPkAnHVaMaPqkImmw/view?usp=drive_link'; // SG01-WB-U01
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
  a.download = `SG01-Audio-Track0${trackNumber}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
