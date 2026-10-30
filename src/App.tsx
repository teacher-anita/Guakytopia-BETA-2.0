/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { RegistrationFlow } from './components/RegistrationFlow';
import { CalendarView } from './components/CalendarView';
import { GamificationHub } from './components/GamificationHub';
import { LearningPathway } from './components/LearningPathway';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ScheduleOptimizerModal } from './components/ScheduleOptimizerModal';
import { PlacementQuizModal } from './components/PlacementQuizModal';
import { CouponModal } from './components/CouponModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { PricingCalculatorModal } from './components/PricingCalculatorModal';
import { TeacherGate } from './components/TeacherGate';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentScheduleRequestModal } from './components/StudentScheduleRequestModal';
import { LanguageLab } from './components/LanguageLab';
import { PrincipalDashboard } from './components/PrincipalDashboard';
import { ThemeSelectorModal, StudyThemeId } from './components/ThemeSelectorModal';
import { GuakypackModal } from './components/GuakypackModal';
import { UnitOneMasterClass } from './components/UnitOneMasterClass';
import { ClassroomHub } from './components/ClassroomHub';
import { AcademicLibrary } from './components/AcademicLibrary';
import { GuakypediaView } from './components/GuakypediaView';
import { StudentSuperReportModal } from './components/StudentSuperReportModal';
import { Student, ScheduleSlot, AudienceTheme, Teacher, StaffRole } from './types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS, ENGLISH_LEVELS } from './data/curriculumData';
import { INITIAL_TEACHERS } from './data/teachersData';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { 
  saveStudent, 
  deleteStudent,
  saveSlots, 
  subscribeToStudents, 
  subscribeToSlots,
  getLocalSlots,
  saveTeacher,
  deleteTeacher,
  subscribeToTeachers,
  getLocalTeachers,
  subscribeToCoupons 
} from './services/db';
import { ShieldCheck, Calendar, Globe, ExternalLink, FlaskConical } from 'lucide-react';
import { GuakyChatbot } from './components/GuakyChatbot';
import { fetchLiveBcvRate, initMidnightBcvScheduler } from './services/currencyService';
import { trackStudentAction } from './services/telemetryService';
import { getThemeBackgroundClass } from './utils/themeStyles';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [audienceTheme, setAudienceTheme] = useState<AudienceTheme>('adults');
  const [studyTheme, setStudyTheme] = useState<StudyThemeId>(() => {
    const saved = localStorage.getItem('guakytopia_study_theme');
    return (saved as StudyThemeId) || 'official';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('guakytopia_study_theme', studyTheme);
    document.documentElement.setAttribute('data-theme', studyTheme);
  }, [studyTheme]);
  const [isPlacementQuizOpen, setIsPlacementQuizOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ title: string; amount: number }>({
    title: 'Membresía Plataforma Campus Güakytopia (Promo $4.99)',
    amount: 4.99
  });
  const [isGuakypackOpen, setIsGuakypackOpen] = useState(false);
  const [isDirectScheduleBookingOpen, setIsDirectScheduleBookingOpen] = useState(false);
  const [isSuperReportOpen, setIsSuperReportOpen] = useState(false);

  // Staff Authentication role: 'principal' (The Principal Waky) | 'teacher' (Coquito) | null
  const [staffRole, setStaffRole] = useState<StaffRole | null>(() => {
    const saved = sessionStorage.getItem('cokito_staff_role');
    if (saved === 'principal' || saved === 'teacher') return saved;
    return sessionStorage.getItem('cokito_teacher_auth') === 'true' ? 'principal' : null;
  });

  // Teacher Authentication state
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cokito_teacher_auth') === 'true' || !!sessionStorage.getItem('cokito_staff_role');
  });

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState<boolean>(() => sessionStorage.getItem('cokito_student_auth') === 'true');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Real-time Database State (Firestore + Local fallback)
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(() => getLocalTeachers());
  const [slots, setSlots] = useState<ScheduleSlot[]>(() => getLocalSlots());

  // Persistent student authentication across browser sessions
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const studentParam = urlParams.get('student') || urlParams.get('email') || urlParams.get('alumno') || urlParams.get('alumna');
      if (studentParam) {
        localStorage.setItem('cokito_url_student_param', studentParam);
      }
    } catch {}

    const hasStudentSession = 
      localStorage.getItem('cokito_student_auth') === 'true' || 
      sessionStorage.getItem('cokito_student_auth') === 'true';
    const saved = hasStudentSession ? localStorage.getItem('cokito_active_student_id') : null;
    return saved || 'guest';
  });

  useEffect(() => {
    if (currentStudentId && currentStudentId !== 'guest') {
      localStorage.setItem('cokito_active_student_id', currentStudentId);
    }
  }, [currentStudentId]);

  // Guest XP & Streak Tracking (Stored locally so visitors can accumulate progress even before logging in)
  const [guestXp, setGuestXp] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('guakytopia_guest_xp') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [guestStreak, setGuestStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('guakytopia_guest_streak') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Real-time Firestore Sync for Students
  useEffect(() => {
    const unsubStudents = subscribeToStudents((latestStudents) => {
      setStudents(latestStudents);
    });
    return () => {
      if (typeof unsubStudents === 'function') unsubStudents();
    };
  }, []);

  // Magic Link: Auto-login student from URL query parameter (e.g. ?student=felkisramos@hotmail.com)
  useEffect(() => {
    if (students.length === 0) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const param = urlParams.get('student') || urlParams.get('email') || urlParams.get('alumno') || urlParams.get('alumna') || localStorage.getItem('cokito_url_student_param');
      if (param) {
        const clean = param.trim().toLowerCase();
        const found = students.find(s => 
          s.id.toLowerCase() === clean ||
          s.email?.toLowerCase() === clean ||
          s.name?.toLowerCase() === clean ||
          s.username?.toLowerCase() === clean ||
          `${s.name || ''} ${s.lastName || ''}`.trim().toLowerCase() === clean
        );
        if (found) {
          setCurrentStudentId(found.id);
          setIsStudentAuthenticated(true);
          localStorage.setItem('cokito_student_auth', 'true');
          sessionStorage.setItem('cokito_student_auth', 'true');
          localStorage.setItem('cokito_active_student_id', found.id);
          localStorage.removeItem('cokito_url_student_param');
          // Clean URL without reloading page
          if (window.history.replaceState) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
          trackStudentAction(found, 'hub', 'Acceso directo mediante enlace oficial de alumno');
        }
      }
    } catch {}
  }, [students]);

  // Real-time Firestore Sync for Schedule Slots
  useEffect(() => {
    const unsubSlots = subscribeToSlots((latestSlots) => {
      setSlots(latestSlots);
    });
    return () => {
      if (typeof unsubSlots === 'function') unsubSlots();
    };
  }, []);

  // Real-time Firestore Sync for Teachers
  useEffect(() => {
    const unsubTeachers = subscribeToTeachers((latestTeachers) => {
      setTeachers(latestTeachers);
    });
    return () => {
      if (typeof unsubTeachers === 'function') unsubTeachers();
    };
  }, []);

  // Real-time Firestore Sync for Coupons & Scholarships
  useEffect(() => {
    const unsubCoupons = subscribeToCoupons(() => {
      // Synchronized across tabs & sessions in real time
    });
    return () => {
      if (typeof unsubCoupons === 'function') unsubCoupons();
    };
  }, []);

  // Initialize official BCV exchange rate and automated midnight (12:00 AM VET) scheduler
  useEffect(() => {
    void fetchLiveBcvRate();
    const unsubMidnight = initMidnightBcvScheduler(() => {
      console.log('Tasa oficial BCV actualizada a medianoche');
    });
    return () => {
      if (unsubMidnight) unsubMidnight();
    };
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          if (currentUser.email === 'anateresa.csb@gmail.com' || currentUser.email?.includes('anateresa')) {
            setIsTeacherAuthenticated(true);
            setStaffRole('principal');
            sessionStorage.setItem('cokito_teacher_auth', 'true');
            sessionStorage.setItem('cokito_staff_role', 'principal');
          } else {
            // If registered student matches this Google account email, auto-switch to their profile
            const matched = students.find(s => s.email?.toLowerCase() === currentUser.email?.toLowerCase());
            if (matched) {
              setCurrentStudentId(matched.id);
              setIsStudentAuthenticated(true);
              sessionStorage.setItem('cokito_student_auth', 'true');
            } else {
              // Seamlessly auto-provision student profile for the authenticated Google user!
              const newGoogleStudent: Student = {
                id: `student_${currentUser.uid}`,
                uid: currentUser.uid,
                name: currentUser.displayName?.split(' ')[0] || 'Estudiante',
                lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
                cedula: '',
                email: currentUser.email || '',
                phone: '',
                age: 20,
                isKid: false,
                schoolOrProfession: 'Estudiante Campus Güakytopia',
                learningGoal: 'Aprender y dominar el inglés con Teacher Cokitö',
                avatar: currentUser.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=${currentUser.uid}`,
                plan: 'basic',
                modality: 'online',
                groupSize: 'individual',
                preferredTimeSlot: '',
                status: 'enrolled',
                levelId: 'level_1',
                placementTestScore: 0,
                placementTestDiagnosis: 'Prueba diagnóstica pendiente por realizar a tu propio ritmo.',
                placementTestDate: new Date().toISOString().split('T')[0],
                registeredAt: new Date().toISOString().split('T')[0],
                currentUnit: 1,
                completedHours: 0,
                xp: 150,
                streak: 1,
                league: 'Bronce',
                rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
                notes: `Inscrito vía Google Sign-In el ${new Date().toLocaleDateString('es-VE')}`,
                assignedSlots: [],
                telemetry: {
                  hubVisits: 0,
                  classroomVisits: 0,
                  libraryVisits: 0,
                  labVisits: 0,
                  calendarVisits: 0,
                  totalInteractions: 1,
                  lastActiveAt: new Date().toISOString(),
                  recentActivity: [
                    {
                      id: `act_${Date.now()}`,
                      section: 'hub',
                      action: 'Inicio de sesión en Güakytopia',
                      detail: 'Cuenta vinculada con Google',
                      timestamp: new Date().toISOString()
                    }
                  ]
                }
              };
              void saveStudent(newGoogleStudent);
              setStudents(prev => [...prev.filter(s => s.id !== newGoogleStudent.id), newGoogleStudent]);
              setCurrentStudentId(newGoogleStudent.id);
              setIsStudentAuthenticated(true);
              sessionStorage.setItem('cokito_student_auth', 'true');
            }
          }
        }
      },
      () => setUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [students]);

  // Scroll to top whenever active tab changes to prevent abrupt jumping
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setIsProfileOpen(false);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err?.code === 'auth/popup-blocked') {
        alert('Tu navegador bloqueó la ventana emergente de Google. Por favor permite las ventanas emergentes en esta página para continuar, o inicia sesión con tu usuario/correo y clave.');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        alert('Aviso de inicio de sesión con Google: ' + (err?.message || 'No se pudo abrir la ventana de acceso'));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCredentialsLogin = (emailOrUser: string, pass: string): boolean => {
    const clean = emailOrUser.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Staff Authentication (Directora Waky / Teacher Coquito)
    if (
      cleanPass === '0112' || 
      clean === 'waky' || 
      clean === 'anateresa.csb@gmail.com' || 
      clean.includes('anateresa') || 
      clean === 'directora'
    ) {
      setIsTeacherAuthenticated(true);
      setStaffRole('principal');
      sessionStorage.setItem('cokito_teacher_auth', 'true');
      sessionStorage.setItem('cokito_staff_role', 'principal');
      setIsProfileOpen(false);
      return true;
    }
    if (cleanPass === '3223' || clean === 'coquito' || clean === 'cokito' || clean === 'teacher') {
      setIsTeacherAuthenticated(true);
      setStaffRole('teacher');
      sessionStorage.setItem('cokito_teacher_auth', 'true');
      sessionStorage.setItem('cokito_staff_role', 'teacher');
      setIsProfileOpen(false);
      return true;
    }

    // 2. Student Authentication
    const matched = students.find(s => 
      s.email?.toLowerCase() === clean || 
      s.name?.toLowerCase() === clean ||
      s.username?.toLowerCase() === clean ||
      s.cedula?.toLowerCase() === clean ||
      `${s.name || ''} ${s.lastName || ''}`.trim().toLowerCase() === clean
    );

    if (matched) {
      // Check password: allow matched.password, matched.customPassword, matched.temporaryPassword, default 'ingles2026', or director master PIN '0112'
      const assignedPass = (matched.password || matched.customPassword || matched.temporaryPassword || '').toLowerCase().trim();
      const isPasswordValid = 
        !assignedPass || 
        !cleanPass || 
        cleanPass === assignedPass || 
        cleanPass === 'ingles2026' || 
        cleanPass === '0112';

      if (isPasswordValid) {
        // Migrate any accumulated guest XP so no progress is ever lost
        let newXp = matched.xp || 0;
        if (guestXp > 0) {
          newXp += guestXp;
          setGuestXp(0);
          try {
            localStorage.removeItem('guakytopia_guest_xp');
          } catch {}
        }
        const updated: Student = {
          ...matched,
          xp: newXp
        };
        setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
        if (newXp !== matched.xp) {
          void saveStudent(updated);
        }

        setCurrentStudentId(matched.id);
        setIsStudentAuthenticated(true);
        localStorage.setItem('cokito_student_auth', 'true');
        sessionStorage.setItem('cokito_student_auth', 'true');
        localStorage.setItem('cokito_active_student_id', matched.id);
        setIsProfileOpen(false);

        void trackStudentAction(updated, 'hub', 'Inicio de sesión exitoso en campus');
        return true;
      }
    } else if (clean.includes('@') && clean.includes('.')) {
      // Auto-provision guest or new student session for valid email if not yet registered
      const guestStudent: Student = {
        id: `student_${Date.now()}`,
        name: clean.split('@')[0],
        email: clean,
        age: 18,
        isKid: false,
        schoolOrProfession: 'Estudiante Güakytopia',
        learningGoal: 'Aprender inglés con Güaky y Teacher Cokitö',
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${clean}`,
        plan: 'basic',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Flexible',
        status: 'enrolled',
        levelId: 'level_1',
        registeredAt: new Date().toISOString().split('T')[0],
        currentUnit: 1,
        completedHours: 0,
        xp: Math.max(100, guestXp),
        streak: 1,
        league: 'Bronce',
        rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
        notes: 'Acceso directo con correo electrónico',
        assignedSlots: []
      };
      setGuestXp(0);
      try {
        localStorage.removeItem('guakytopia_guest_xp');
      } catch {}
      void saveStudent(guestStudent);
      setStudents(prev => [...prev, guestStudent]);
      setCurrentStudentId(guestStudent.id);
      setIsStudentAuthenticated(true);
      localStorage.setItem('cokito_student_auth', 'true');
      sessionStorage.setItem('cokito_student_auth', 'true');
      localStorage.setItem('cokito_active_student_id', guestStudent.id);
      setIsProfileOpen(false);
      void trackStudentAction(guestStudent, 'hub', 'Registro y primer acceso');
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCurrentStudentId('guest');
    setIsStudentAuthenticated(false);
    localStorage.removeItem('cokito_student_auth');
    sessionStorage.removeItem('cokito_student_auth');
    localStorage.removeItem('cokito_active_student_id');
    sessionStorage.removeItem('cokito_teacher_auth');
    setIsTeacherAuthenticated(false);
  };

  // Find active student or null if guest
  const currentStudent = currentStudentId === 'guest'
    ? null
    : students.find(s => s.id === currentStudentId) || null;

  // Pilot Program Telemetry: Automatically record student interaction when visiting sections
  useEffect(() => {
    if (currentStudent && currentStudent.id && currentStudent.id !== 'guest') {
      const sectionMap: Record<string, 'hub' | 'classroom' | 'library' | 'lab' | 'calendar' | null> = {
        pathway: 'hub',
        classroom: 'classroom',
        library: 'library',
        lab: 'lab',
        calendar: 'calendar'
      };
      const sectionKey = sectionMap[activeTab];
      if (sectionKey) {
        trackStudentAction(currentStudent, sectionKey, `Ingresó a la sección ${sectionKey.toUpperCase()}`);
      }
    }
  }, [activeTab, currentStudent?.id]);

  // Registration Callback (Saves to Cloud Firestore + LocalStorage!)
  const handleRegisterComplete = async (newStudent: Student, bookedSlotIds: string[]) => {
    await saveStudent(newStudent);
    setCurrentStudentId(newStudent.id);
    setIsStudentAuthenticated(true);
    sessionStorage.setItem('cokito_student_auth', 'true');

    if (newStudent.isKid) {
      setAudienceTheme('kids');
    }

    if (bookedSlotIds.length > 0) {
      const updatedSlots = slots.map(slot => {
        if (bookedSlotIds.includes(slot.id)) {
          return {
            ...slot,
            status: 'booked' as const,
            studentId: newStudent.id,
            studentName: `${newStudent.name} ${newStudent.lastName || ''}`.trim(),
            levelId: newStudent.levelId,
            meetLink: 'https://meet.google.com/eng-class'
          };
        }
        return slot;
      });
      setSlots(updatedSlots);
      await saveSlots(updatedSlots);
    }
  };

  const handleUpdateSlots = async (updatedSlots: ScheduleSlot[]) => {
    setSlots(updatedSlots);
    await saveSlots(updatedSlots);
  };

  const handleApplyCoupon = async (redeemedStudent: Student) => {
    setStudents(prev => [redeemedStudent, ...prev.filter(s => s.id !== redeemedStudent.id)]);
    setCurrentStudentId(redeemedStudent.id);
    setIsStudentAuthenticated(true);
    sessionStorage.setItem('cokito_student_auth', 'true');
    localStorage.setItem('cokito_active_student_id', redeemedStudent.id);
    await saveStudent(redeemedStudent);
    setActiveTab('pathway');
  };

  const handleFreeSlot = async (slotId: string) => {
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: 'available' as const,
          studentId: undefined,
          studentName: undefined,
          levelId: undefined,
          meetLink: undefined
        };
      }
      return slot;
    });
    setSlots(updatedSlots);
    await saveSlots(updatedSlots);
  };

  const handleAwardXp = async (studentId: string, amount: number) => {
    // 1. Guest users: accumulate XP and streak locally
    if (!studentId || studentId === 'guest') {
      const today = new Date().toISOString().split('T')[0];
      const newXp = (guestXp || 0) + amount;
      setGuestXp(newXp);
      try {
        localStorage.setItem('guakytopia_guest_xp', String(newXp));
        const lastActive = localStorage.getItem('guakytopia_guest_last_active');
        let newStreak = guestStreak || 0;
        if (lastActive !== today) {
          newStreak += 1;
          setGuestStreak(newStreak);
          localStorage.setItem('guakytopia_guest_streak', String(newStreak));
          localStorage.setItem('guakytopia_guest_last_active', today);
        }
      } catch {}
      return;
    }

    // 2. Enrolled student users: update reactive state, calculate daily streak, and sync to Firestore
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = target.lastActiveDate !== today;
    const newStreak = isNewDay ? (target.streak || 0) + 1 : Math.max(target.streak || 1, 1);
    const newXp = (target.xp || 0) + amount;

    // League promotion based on XP milestones
    let newLeague: 'Bronce' | 'Plata' | 'Oro' | 'Diamante' = target.league || 'Bronce';
    if (newXp >= 1500) newLeague = 'Diamante';
    else if (newXp >= 800) newLeague = 'Oro';
    else if (newXp >= 300) newLeague = 'Plata';

    const updated: Student = {
      ...target,
      xp: newXp,
      streak: newStreak,
      league: newLeague,
      lastActiveDate: today
    };

    // Update React state immediately so header and gamification views update synchronously
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));

    // Persist to local storage and Firestore Cloud
    await saveStudent(updated);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    await saveStudent(updatedStudent);

    // Bidirectional sync with agenda slots
    const studentAssigned = Array.isArray(updatedStudent.assignedSlots) 
      ? updatedStudent.assignedSlots.filter((a): a is string => typeof a === 'string' && a.trim().length > 0)
      : [];
    const updatedSlots = slots.map(slot => {
      // Check if slot matches any assignment string
      const isAssignedToThis = studentAssigned.some(assignment => {
        if (!assignment || typeof assignment !== 'string') return false;
        const clean = assignment.toLowerCase().trim();
        const slotId = (slot.id || '').toLowerCase();
        if (slotId && clean === slotId) return true;
        const tag = `${slot.day || ''}-${slot.startTime || ''}`.toLowerCase();
        if (clean === tag) return true;

        const slotDay = (slot.day || '').toLowerCase();
        if (!slotDay) return false;

        // Text parsing: e.g. "Todos los Lunes de 17:00 a 18:00 (Semanal)" or "Lunes y Miércoles de 5 a 6"
        const mentionsDay = clean.includes(slotDay) || 
          (slotDay === 'lunes' && clean.includes('lun')) ||
          (slotDay === 'martes' && clean.includes('mar')) ||
          (slotDay === 'miércoles' && clean.includes('mie')) ||
          (slotDay === 'jueves' && clean.includes('jue')) ||
          (slotDay === 'viernes' && clean.includes('vie')) ||
          (slotDay === 'sábado' && clean.includes('sab'));
        if (!mentionsDay) return false;
        
        if (!slot.startTime) return false;
        const hourNum = parseInt(slot.startTime.split(':')[0], 10);
        if (isNaN(hourNum)) return false;
        const hour12 = hourNum > 12 ? hourNum - 12 : hourNum;
        const matchesHour = clean.includes(`${hourNum}:00`) || 
          clean.includes(`de ${hourNum}`) || 
          clean.includes(`a ${hourNum + 1}`) || 
          clean.includes(`${hour12}:00`) || 
          clean.includes(`${hour12} pm`) || 
          clean.includes(`${hour12} am`) || 
          clean.includes(`de ${hour12}`);
        return matchesHour;
      });

      if (isAssignedToThis) {
        return {
          ...slot,
          status: 'booked' as const,
          studentId: updatedStudent.id,
          studentName: `${updatedStudent.name} ${updatedStudent.lastName || ''}`.trim(),
          levelId: updatedStudent.levelId || 'level_1',
          teacherName: 'Teacher Cokitö / Head Teacher',
          meetLink: slot.meetLink || 'https://meet.google.com/eng-waky-class'
        };
      }

      // If slot previously belonged to this student but was unassigned, free it!
      if (slot.studentId === updatedStudent.id) {
        return {
          ...slot,
          status: 'available' as const,
          studentId: undefined,
          studentName: undefined,
          levelId: undefined,
          teacherName: 'Teacher Cokitö / Head Teacher'
        };
      }

      return slot;
    });

    setSlots(updatedSlots);
    await saveSlots(updatedSlots);
  };

  const handleDeleteStudent = async (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setSlots(prev => prev.map(slot => {
      const hasStudent = slot.studentId === studentId || slot.enrolledStudents?.some(e => e.studentId === studentId);
      if (!hasStudent) return slot;
      const enrolled = (slot.enrolledStudents || []).filter(e => e.studentId !== studentId);
      return {
        ...slot,
        enrolledStudents: enrolled,
        studentId: enrolled[0]?.studentId,
        studentName: enrolled[0]?.studentName,
        status: (enrolled.length === 0 ? 'available' : slot.status) as any
      };
    }));
    await deleteStudent(studentId);
  };

  const handleAddStudent = async (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev.filter(s => s.id !== newStudent.id)]);
    await saveStudent(newStudent);
  };

  const handleUpdateTeacher = async (teacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === teacher.id ? teacher : t));
    await saveTeacher(teacher);
  };

  const handleAddTeacher = async (teacher: Teacher) => {
    setTeachers(prev => [teacher, ...prev.filter(t => t.id !== teacher.id)]);
    await saveTeacher(teacher);
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    await deleteTeacher(teacherId);
  };

  const handlePaymentSuccess = async (
    method: string, 
    reference: string, 
    guestData?: { name: string; lastName: string; email: string; phone: string; password?: string }
  ) => {
    const isPaypal = method.toLowerCase().includes('paypal');
    const isPagoMovil = method.toLowerCase().includes('pago móvil') || method.toLowerCase().includes('pagomovil');
    const assignedMethod: 'paypal' | 'pagomovil' | 'cash' = isPaypal ? 'paypal' : isPagoMovil ? 'pagomovil' : 'cash';

    const isDirectCapture = isPaypal && reference.startsWith('ID:');
    const paymentStatusVal: 'fully_paid' | 'pending_approval' = isDirectCapture ? 'fully_paid' : 'pending_approval';

    // If student exists, upgrade them to enrolled with digital pass
    if (currentStudent && currentStudent.id !== 'guest') {
      const updated: Student = {
        ...currentStudent,
        status: 'enrolled',
        plan: currentStudent.plan || 'basic',
        paymentMethod: assignedMethod,
        paypalRef: isPaypal ? reference : currentStudent.paypalRef,
        pagoMovilRef: isPagoMovil ? reference : currentStudent.pagoMovilRef,
        paymentStatus: paymentStatusVal,
        xp: (currentStudent.xp || 0) + 250,
        notes: `${currentStudent.notes || ''} | Pago ${isDirectCapture ? 'DIRECTO CON TARJETA' : 'reportado'} vía ${method} (Ref: ${reference})`
      };
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
      await saveStudent(updated);
    } else {
      const newStudentId = `student_${Date.now()}`;
      const studentName = guestData?.name || user?.displayName || 'Alumno Güakytopia';
      const studentLastName = guestData?.lastName || '';
      const studentEmail = guestData?.email || user?.email || `alumno_${Date.now()}@guakytopia.com`;
      const studentPhone = guestData?.phone || '';

      const newStudent: Student = {
        id: newStudentId,
        name: studentName,
        lastName: studentLastName,
        email: studentEmail,
        phone: studentPhone,
        password: guestData?.password,
        age: 25,
        isKid: false,
        schoolOrProfession: 'Estudiante Campus Digital',
        learningGoal: 'Aprender inglés a mi propio ritmo',
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(studentName)}`,
        plan: 'basic',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Autónomo Asincrónico',
        status: 'enrolled',
        paymentMethod: assignedMethod,
        paypalRef: isPaypal ? reference : undefined,
        pagoMovilRef: isPagoMovil ? reference : undefined,
        paymentStatus: paymentStatusVal,
        levelId: 'level_1',
        placementTestScore: 0,
        placementTestDiagnosis: 'Pase Digital Activado vía Pago (Prueba diagnóstica pendiente por realizar)',
        placementTestDate: new Date().toISOString().split('T')[0],
        registeredAt: new Date().toISOString().split('T')[0],
        currentUnit: 1,
        completedHours: 0,
        xp: 350,
        streak: 1,
        league: 'Bronce',
        rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
        notes: `Cuenta creada y Pase Activado vía ${method} (Ref: ${reference}) para ${studentName} ${studentLastName}`,
        assignedSlots: []
      };
      setStudents(prev => [...prev, newStudent]);
      setCurrentStudentId(newStudent.id);
      setIsStudentAuthenticated(true);
      sessionStorage.setItem('cokito_student_auth', 'true');
      localStorage.setItem('cokito_active_student_id', newStudent.id);
      await saveStudent(newStudent);
      void trackStudentAction(newStudent, 'hub', `Cuenta creada e inscrita vía pago ${method}`);
    }
    setIsPaymentModalOpen(false);
    setActiveTab('pathway');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${getThemeBackgroundClass(studyTheme, audienceTheme === 'kids')}`}>
      {/* Junior Mode Floating Gamer Notification Banner */}
      {audienceTheme === 'kids' && (
        <aside aria-label="Aviso modo Junior" className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white px-3 py-1.5 text-xs font-black shadow-inner flex items-center justify-between overflow-hidden relative">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse-glow shrink-0">
                🕹️ JUNIOR ARCADE 12+
              </span>
              <span className="truncate text-purple-100 font-bold text-[11px] sm:text-xs">
                ¡Mundos interactivos, gaming slang y profesores que hablan tu mismo idioma! 🎧
              </span>
            </div>
            <button
              onClick={() => setAudienceTheme('adults')}
              className="text-[10px] sm:text-xs text-white/80 hover:text-white underline decoration-white/40 shrink-0 font-medium ml-2"
            >
              Cambiar a Adult 🎓
            </button>
          </div>
        </aside>
      )}
      
      {/* Top Navbar */}
      <Header
        user={user}
        isTeacherAuthenticated={isTeacherAuthenticated}
        staffRole={staffRole}
        onTeacherLogout={() => {
          setIsTeacherAuthenticated(false);
          setStaffRole(null);
          sessionStorage.removeItem('cokito_teacher_auth');
          sessionStorage.removeItem('cokito_staff_role');
          setActiveTab('landing');
        }}
        audienceTheme={audienceTheme}
        onAudienceChange={setAudienceTheme}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenCouponModal={() => setIsCouponOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenGuakypack={() => setIsGuakypackOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        currentStudentXp={currentStudent ? currentStudent.xp : guestXp}
        currentStudentStreak={currentStudent ? currentStudent.streak : guestStreak}
        currentStudent={currentStudent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allStudents={students}
        onSelectStudent={setCurrentStudentId}
        studyTheme={studyTheme}
      />

      {/* Main Content (with bottom padding on mobile for the floating bar) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-8">
        
        {/* TAB 1: LANDING PAGE (Initial Welcome Page) */}
        {activeTab === 'landing' && (
          <LandingHero
            audienceTheme={audienceTheme}
            onStartRegistration={() => setActiveTab('register')}
            onExploreCalendar={() => setActiveTab('calendar')}
            onExploreGamification={() => setActiveTab('duolingo')}
            onOpenOptimizer={() => setIsOptimizerOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
            onOpenGuakypedia={() => setActiveTab('guakypedia')}
            studyTheme={studyTheme}
          />
        )}

        {/* TAB: GÜAKYPEDIA (LA GUÍA OFICIAL PARA DESCUBRIR GÜAKYTOPIA) */}
        {activeTab === 'guakypedia' && (
          <GuakypediaView
            audienceTheme={audienceTheme}
            currentStudent={currentStudent}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
            onOpenCouponModal={() => setIsCouponOpen(true)}
            onOpenGuakypack={() => setIsGuakypackOpen(true)}
            studyTheme={studyTheme}
          />
        )}

        {/* TAB 2: REGISTRATION & PLACEMENT TEST FLOW */}
        {activeTab === 'register' && (
          currentStudent && currentStudent.id !== 'guest' ? (
            <div className="max-w-2xl mx-auto py-10 px-4 space-y-6 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 mx-auto flex items-center justify-center text-2xl shadow-inner">
                  ✅
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Perfil Activo en Güakytopia Campus
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-2">
                    ¡Hola, {currentStudent.name}! Ya estás registrado
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Tus datos ya están en el sistema de la academia. No tienes que volver a escribir todo desde cero. Puedes solicitar o consultar tu horario de clases de inmediato:
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Nivel asignado:</span>
                    <span className="font-bold text-slate-800">{currentStudent.levelId || 'Super Goal 1'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Plan:</span>
                    <span className="font-bold text-slate-800 capitalize">{currentStudent.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Horario / Turno:</span>
                    <span className="font-bold text-indigo-700">{currentStudent.preferredTimeSlot || 'Sin turno agendado'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 flex-wrap">
                  <button
                    onClick={() => setIsDirectScheduleBookingOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>📅 Solicitar / Agendar Mi Horario</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pathway')}
                    className="w-full sm:w-auto px-5 py-3 bg-[#2EC4B6] hover:bg-[#259C90] text-slate-950 font-bold rounded-2xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🧭 Ir al Hub de Progreso</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ver Agenda Semanal</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <RegistrationFlow
              slots={slots}
              onRegisterComplete={handleRegisterComplete}
              onExploreCalendar={() => setActiveTab('calendar')}
              audienceTheme={audienceTheme}
              existingStudents={students}
              onOpenLogin={() => setIsProfileOpen(true)}
              onOpenPricingModal={() => setIsPricingModalOpen(true)}
            />
          )
        )}

        {/* TAB 3: CONFIDENTIAL SHARED CALENDAR */}
        {activeTab === 'calendar' && (
          <CalendarView
            slots={slots}
            students={students}
            currentStudent={currentStudent}
            user={user}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            audienceTheme={audienceTheme}
            onFreeSlot={handleFreeSlot}
            onOpenRegister={() => setActiveTab('register')}
            onUpdateStudent={handleUpdateStudent}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            studyTheme={studyTheme}
          />
        )}

        {/* TAB 4: RETOS COKITÖ & TABLA DE LIGA */}
        {activeTab === 'duolingo' && (
          <GamificationHub
            currentStudent={currentStudent}
            students={students}
            onAwardXp={handleAwardXp}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            audienceTheme={audienceTheme}
            canSyncArenaLives={!isTeacherAuthenticated && Boolean(user && currentStudent && user.email?.toLowerCase() === currentStudent.email?.toLowerCase())}
            onOpenGuakypack={() => setIsGuakypackOpen(true)}
            studyTheme={studyTheme}
          />
        )}

        {/* TAB 5: HUB DE PROGRESO & RUTA CURRICULAR */}
        {activeTab === 'pathway' && (
          <LearningPathway
            currentStudent={currentStudent}
            user={user}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            audienceTheme={audienceTheme}
            onOpenRegister={() => setActiveTab('register')}
            onOpenPlacementTest={() => setIsPlacementQuizOpen(true)}
            onOpenCouponModal={() => setIsCouponOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onAwardXp={handleAwardXp}
            onGoToClassroom={() => setActiveTab('classroom')}
            onGoToLibrary={() => setActiveTab('library')}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* TAB 6: CLASSROOM (AULA INTERACTIVA DE INGLÉS EN VIVO) */}
        {activeTab === 'classroom' && (
          (isTeacherAuthenticated || (currentStudent && currentStudent.status === 'enrolled')) ? (
            <div className="max-w-7xl mx-auto py-6 px-4 space-y-4">
              <UnitOneMasterClass
                currentStudent={currentStudent}
                activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
                onAwardXp={handleAwardXp}
                onClose={() => setActiveTab('pathway')}
                onGoToLab={() => setActiveTab('lab')}
              />
            </div>
          ) : (
            <LearningPathway
              currentStudent={currentStudent}
              user={user}
              activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
              audienceTheme={audienceTheme}
              onOpenRegister={() => setActiveTab('register')}
              onOpenPlacementTest={() => setIsPlacementQuizOpen(true)}
              onOpenCouponModal={() => setIsCouponOpen(true)}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onAwardXp={handleAwardXp}
              onGoToClassroom={() => setActiveTab('classroom')}
              onGoToLibrary={() => setActiveTab('library')}
              onUpdateStudent={handleUpdateStudent}
            />
          )
        )}

        {/* TAB 7: LIBRARY (BIBLIOTECA OFICIAL • LIBROS, AUDIOS & WORKBOOKS) */}
        {activeTab === 'library' && (
          <AcademicLibrary
            currentStudent={currentStudent}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            onGoToClassroom={() => setActiveTab('classroom')}
            onGoToHub={() => setActiveTab('pathway')}
          />
        )}

        {/* TAB 8: LABORATORIO DE PRÁCTICA (Language Practice Lab • 100 Drills) */}
        {activeTab === 'lab' && (
          <LanguageLab
            key={currentStudent?.id || 'guest'}
            currentStudent={currentStudent}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            user={user}
            isTeacherAuthenticated={isTeacherAuthenticated}
            isStudentAuthenticated={isStudentAuthenticated}
            onAwardXp={handleAwardXp}
            onGoToClassroom={() => setActiveTab('pathway')}
            onLogin={handleLogin}
            onStartRegistration={() => setActiveTab('register')}
          />
        )}

        {/* TAB 7: TEACHER / RECTORÍA PORTAL (Protected Gate) */}
        {activeTab === 'teacher' && (
          isTeacherAuthenticated ? (
            staffRole === 'principal' ? (
              <PrincipalDashboard
                students={students}
                teachers={teachers}
                slots={slots}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onAddStudent={handleAddStudent}
                onUpdateTeacher={handleUpdateTeacher}
                onDeleteTeacher={handleDeleteTeacher}
                onAddTeacher={handleAddTeacher}
                onUpdateSlots={handleUpdateSlots}
                onSwitchView={(role) => {
                  if (role === 'teacher') {
                    setStaffRole('teacher');
                    sessionStorage.setItem('cokito_staff_role', 'teacher');
                  } else if (role === 'student') {
                    setActiveTab('landing');
                  }
                }}
                onLogout={() => {
                  setIsTeacherAuthenticated(false);
                  setStaffRole(null);
                  sessionStorage.removeItem('cokito_teacher_auth');
                  sessionStorage.removeItem('cokito_staff_role');
                  setActiveTab('landing');
                }}
              />
            ) : (
              <TeacherDashboard
                students={students}
                slots={slots}
                onUpdateStudent={handleUpdateStudent}
                onUpdateSlots={handleUpdateSlots}
                onOpenOptimizer={() => setIsOptimizerOpen(true)}
                onLogoutTeacher={() => {
                  setIsTeacherAuthenticated(false);
                  setStaffRole(null);
                  sessionStorage.removeItem('cokito_teacher_auth');
                  sessionStorage.removeItem('cokito_staff_role');
                  setActiveTab('landing');
                }}
                onSwitchToPrincipal={() => {
                  setStaffRole('principal');
                  sessionStorage.setItem('cokito_staff_role', 'principal');
                }}
              />
            )
          ) : (
            <TeacherGate
              user={user}
              onLoginWithGoogle={handleLogin}
              isLoggingIn={isLoggingIn}
              onAuthenticated={(role) => {
                setIsTeacherAuthenticated(true);
                setStaffRole(role);
                sessionStorage.setItem('cokito_teacher_auth', 'true');
                sessionStorage.setItem('cokito_staff_role', role);
              }}
              onBackToStudent={() => setActiveTab('landing')}
            />
          )
        )}

      </main>

      {/* Student Profile Modal for comfortable mobile & tablet access */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        student={currentStudent}
        user={user}
        isStudentAuthenticated={isStudentAuthenticated}
        onLogin={handleLogin}
        onCredentialsLogin={handleCredentialsLogin}
        isLoggingIn={isLoggingIn}
        onLogout={handleLogout}
        onOpenCoupon={() => {
          setIsProfileOpen(false);
          setIsCouponOpen(true);
        }}
        onOpenPlacementTest={() => setIsPlacementQuizOpen(true)}
        onOpenScheduleBooking={() => {
          setIsProfileOpen(false);
          setIsDirectScheduleBookingOpen(true);
        }}
        onOpenRegister={() => {
          setIsProfileOpen(false);
          setActiveTab('register');
        }}
        onOpenPaymentModal={() => {
          setIsProfileOpen(false);
          setIsPaymentModalOpen(true);
        }}
        onOpenPricingModal={() => {
          setIsProfileOpen(false);
          setIsPricingModalOpen(true);
        }}
        onOpenSuperReport={() => setIsSuperReportOpen(true)}
        audienceTheme={audienceTheme}
        onAudienceChange={setAudienceTheme}
      />

      {/* Super Report & The Flock Radar Modal */}
      <StudentSuperReportModal
        isOpen={isSuperReportOpen}
        onClose={() => setIsSuperReportOpen(false)}
        student={currentStudent}
        audienceTheme={audienceTheme}
        onOpenGuakypack={() => setIsGuakypackOpen(true)}
        onNavigateToTab={setActiveTab}
      />

      {/* Pricing & Calculator Modal */}
      <PricingCalculatorModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSelectPayment={(planName, amountUsd) => {
          setCheckoutPlan({ title: planName, amount: amountUsd });
          setIsPricingModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      {/* Güakypack Modal (Backpack del Explorador) */}
      <GuakypackModal
        isOpen={isGuakypackOpen}
        onClose={() => setIsGuakypackOpen(false)}
        currentStudent={currentStudent}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onNavigateToTab={setActiveTab}
        onUpdateStudent={handleUpdateStudent}
        audienceTheme={audienceTheme}
      />

      {/* Official Payment & Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        initialPlanName={checkoutPlan.title}
        initialAmountUsd={checkoutPlan.amount}
        currentStudent={currentStudent}
        onOpenLogin={() => {
          setIsPaymentModalOpen(false);
          setIsProfileOpen(true);
        }}
        onOpenFullRegistration={() => {
          setIsPaymentModalOpen(false);
          setActiveTab('register');
        }}
      />

      {/* Coupon / Beca Modal */}
      <CouponModal
        isOpen={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        onApplyCoupon={handleApplyCoupon}
        onBackToLogin={() => {
          setIsCouponOpen(false);
          setIsProfileOpen(true);
        }}
      />

      {/* Standalone Placement Quiz Modal */}
      <PlacementQuizModal
        isOpen={isPlacementQuizOpen}
        studentName={currentStudent?.name || 'Aspirante'}
        onClose={() => setIsPlacementQuizOpen(false)}
        onFinishTest={(result) => {
          setIsPlacementQuizOpen(false);
          if (currentStudent && currentStudent.id !== 'guest') {
            handleUpdateStudent({
              ...currentStudent,
              placementTestScore: result.score,
              placementTestDiagnosis: `Puntaje: ${result.score}/${result.total}. Sugerencia: ${result.suggestedLevelName}. ${result.diagnosisText}`,
              placementTestDate: new Date().toISOString().split('T')[0],
              levelId: result.suggestedLevelId,
              xp: (currentStudent.xp || 0) + 200
            });
            setActiveTab('pathway');
          } else {
            setActiveTab('register');
          }
        }}
      />

      {/* Direct Schedule Booking Modal (Instant booking without re-asking any personal data) */}
      {isDirectScheduleBookingOpen && currentStudent && currentStudent.id !== 'guest' && (
        <StudentScheduleRequestModal
          isOpen={isDirectScheduleBookingOpen}
          onClose={() => setIsDirectScheduleBookingOpen(false)}
          student={currentStudent}
          allSlots={slots}
          allLevels={ENGLISH_LEVELS}
          onSuccess={(msg) => {
            console.log(msg);
          }}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {/* Theme / Appearance Modal (Sensory & Neurodiversity Control) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        currentTheme={studyTheme}
        onSelectTheme={(t) => setStudyTheme(t)}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Pedagogical Optimizer Modal */}
      <ScheduleOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          
          {/* Cokito's Lab Unified Authorship & Credit Banner */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/60 border border-emerald-300/80 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xs">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5 sm:gap-4 text-left">
              
              {/* Left Column: Periodic Table Badge & 2-Line Text */}
              <div className="flex items-center gap-3.5 w-full lg:w-auto">
                {/* Element Badge */}
                <a
                  href="https://cokitos-lab-international.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-col justify-between w-11 h-13 sm:w-12 sm:h-14 p-1 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-900 to-slate-950 border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)] text-white hover:scale-105 transition-transform shrink-0 select-none group"
                  title="Cokito's Lab International • Laboratorio de Software & Soluciones Tecnológicas"
                >
                  <div className="text-[8px] font-mono leading-none text-emerald-300 font-bold">
                    31
                  </div>
                  <div className="text-center font-black text-base sm:text-lg tracking-tighter leading-none text-white group-hover:text-emerald-300 transition-colors">
                    CL
                  </div>
                  <div className="text-center text-[7px] font-bold tracking-widest uppercase text-emerald-300/90 leading-none">
                    LAB
                  </div>
                </a>

                {/* Copy Text in exactly 2 lines */}
                <div className="space-y-0.5 text-xs">
                  <p className="text-slate-800 font-medium leading-snug">
                    Esta solución tecnológica fue desarrollada por{' '}
                    <a
                      href="https://cokitos-lab-international.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-bold underline decoration-emerald-400 decoration-2 underline-offset-2 transition-colors"
                    >
                      Cokito's Lab
                    </a>
                  </p>
                  <p className="text-slate-500 text-[11px] sm:text-xs leading-snug">
                    ¿Quieres una plataforma a la medida para tu negocio? ¡Tú también puedes tener la tuya!
                  </p>
                </div>
              </div>

              {/* Right Column: 2 Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
                {/* Button 1: Web Oficial */}
                <a
                  href="https://cokitos-lab-international.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 text-xs font-bold border border-emerald-300 shadow-xs transition-all whitespace-nowrap"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Web Oficial</span>
                  <ExternalLink className="w-3 h-3 text-emerald-500" />
                </a>

                {/* Button 2: WhatsApp Lab (Breaking Bad x Dexter's Lab style) */}
                <a
                  href="https://wa.me/584224612534?text=Hola%20Cokito%27s%20Lab,%20vi%20la%20plataforma%20de%20G%C3%BCakytopia%20y%20quiero%20crear%20una%20soluci%C3%B3n%20tecnol%C3%B3gica%20para%20mi%20empresa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-slate-950 via-[#03241b] to-slate-950 hover:from-slate-900 hover:via-[#053629] hover:to-slate-900 text-white text-xs font-black border-2 border-emerald-400/90 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all whitespace-nowrap group"
                >
                  <div className="relative flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-lime-400 transition-transform group-hover:rotate-12" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span>¡Quiero mi plataforma!</span>
                </a>
              </div>

            </div>
          </div>

          {/* Copyright & Secondary Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <img 
                src="/guakytopia-nombre.png" 
                alt="Güakytopia (Guakytopia)" 
                className="h-5 w-auto object-contain" 
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
              <p>© 2026 Güakytopia (Guakytopia) • Open the World. Academia de Inglés de Teacher Cokitö. Start where you are. Keep going.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[#2EC4B6] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Privacidad y Confidencialidad Garantizada
              </span>
              <span>•</span>
              <button
                onClick={() => setActiveTab('guakypedia')}
                className="text-amber-600 hover:underline font-black flex items-center gap-1"
              >
                <span>🧭 Güakypedia Oficial</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="text-[#2EC4B6] hover:underline font-bold"
              >
                🎨 Personalizar Ambiente
              </button>
              <span>•</span>
              <button
                onClick={() => setIsOptimizerOpen(true)}
                className="text-[#243447] hover:underline font-bold"
              >
                Análisis Pedagógico de Tiempos
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Güaky The Macaw AI Chatbot with Voice Studio, Adaptive Greetings & Memory */}
      <GuakyChatbot 
        studentName={currentStudent?.name}
        currentStudent={currentStudent}
        user={user}
        audienceTheme={audienceTheme}
        activeTab={activeTab}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onOpenGuakypack={() => setIsGuakypackOpen(true)}
        onOpenSuperReport={() => setIsSuperReportOpen(true)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onOpenRegistration={() => setActiveTab('register')}
        onAwardXp={(amount, reason) => {
          if (currentStudent) {
            handleAwardXp(currentStudent.id, amount);
          }
        }}
        teacherWhatsAppUsername="CokitoVZLA"
      />

    </div>
  );
}
