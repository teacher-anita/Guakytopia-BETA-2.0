import { TeacherAnnouncement, LoungeMessage, TeacherAttendanceLog } from '../types';

const ANNOUNCEMENTS_KEY = 'cokito_teacher_announcements';
const LOUNGE_MESSAGES_KEY = 'cokito_lounge_messages';
const ATTENDANCE_LOGS_KEY = 'cokito_attendance_logs';

const INITIAL_ANNOUNCEMENTS: TeacherAnnouncement[] = [
  {
    id: 'ann-1',
    title: '☕ Welcome to the Faculty & Teachers\' Lounge!',
    content: 'Dear Teachers: This collaborative space is for us. Here we coordinate schedules, track student progress, share pedagogical updates, and resolve any questions directly with Principal Waky.',
    authorName: 'Principal Waky',
    authorRole: 'principal',
    priority: 'important',
    createdAt: 'Today, 08:30 AM'
  },
  {
    id: 'ann-2',
    title: '📌 Student Verification & Welcome Protocol',
    content: 'Remember that students access Google Meet sessions after payment confirmation and schedule booking. If you see a student in courtesy status, support them with diagnostic speaking tips.',
    authorName: 'Principal Waky',
    authorRole: 'principal',
    priority: 'urgent',
    createdAt: 'Yesterday, 04:15 PM'
  }
];

const INITIAL_MESSAGES: LoungeMessage[] = [
  {
    id: 'msg-1',
    authorId: 'principal-waky',
    authorName: 'Principal Waky',
    authorRole: 'principal',
    avatar: '👑',
    text: 'Good morning Teachers! I posted the diagnostic guidelines on the board. Enjoy your virtual coffee ☕✨',
    timestamp: '09:00 AM',
    reactions: { '☕': 5, '❤️': 3 }
  },
  {
    id: 'msg-2',
    authorId: 'teacher-elena',
    authorName: 'Teacher Elena',
    authorRole: 'teacher',
    avatar: '👩‍🏫',
    text: 'Received Principal Waky! The Level 1 students are loving the new Güakypedia exercises and speaking sessions.',
    timestamp: '09:12 AM',
    reactions: { '🦜': 4, '👏': 3 }
  },
  {
    id: 'msg-3',
    authorId: 'teacher-marcos',
    authorName: 'Teacher Marcos',
    authorRole: 'teacher',
    avatar: '👨‍🏫',
    text: 'Colleagues, I have the 5:00 to 6:00 PM slot available today in case any group needs extra conversation practice.',
    timestamp: '09:45 AM',
    reactions: { '👍': 2 }
  }
];

export const getTeacherAnnouncements = (): TeacherAnnouncement[] => {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ANNOUNCEMENTS;
};

export const saveTeacherAnnouncement = (ann: Omit<TeacherAnnouncement, 'id' | 'createdAt'>): TeacherAnnouncement => {
  const announcements = getTeacherAnnouncements();
  const newAnn: TeacherAnnouncement = {
    ...ann,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Hoy'
  };
  const updated = [newAnn, ...announcements];
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
  } catch {}
  return newAnn;
};

export const deleteTeacherAnnouncement = (id: string): void => {
  const announcements = getTeacherAnnouncements().filter(a => a.id !== id);
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
  } catch {}
};

export const getLoungeMessages = (): LoungeMessage[] => {
  try {
    const raw = localStorage.getItem(LOUNGE_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_MESSAGES;
};

export const postLoungeMessage = (
  authorId: string,
  authorName: string,
  authorRole: 'principal' | 'teacher',
  avatar: string,
  text: string
): LoungeMessage => {
  const messages = getLoungeMessages();
  const newMsg: LoungeMessage = {
    id: `msg-${Date.now()}`,
    authorId,
    authorName,
    authorRole,
    avatar,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: {}
  };
  const updated = [...messages, newMsg];
  try {
    localStorage.setItem(LOUNGE_MESSAGES_KEY, JSON.stringify(updated));
  } catch {}
  return newMsg;
};

export const addLoungeReaction = (messageId: string, emoji: string): void => {
  const messages = getLoungeMessages();
  const msg = messages.find(m => m.id === messageId);
  if (msg) {
    if (!msg.reactions) msg.reactions = {};
    msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
    try {
      localStorage.setItem(LOUNGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch {}
  }
};

export const getAttendanceLogs = (): TeacherAttendanceLog[] => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveAttendanceLog = (log: Omit<TeacherAttendanceLog, 'id'>): TeacherAttendanceLog => {
  const logs = getAttendanceLogs();
  const newLog: TeacherAttendanceLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  const updated = [newLog, ...logs];
  try {
    localStorage.setItem(ATTENDANCE_LOGS_KEY, JSON.stringify(updated));
  } catch {}
  return newLog;
};
