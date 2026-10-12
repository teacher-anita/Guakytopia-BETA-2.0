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
import { UnitOneMasterClass } from './components/UnitOneMasterClass';
import { ClassroomHub } from './components/ClassroomHub';
import { AcademicLibrary } from './components/AcademicLibrary';
import { Student, ScheduleSlot, AudienceTheme, Teacher, StaffRole } from './types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS, ENGLISH_LEVELS } from './data/curriculumData';
import { INITIAL_TEACHERS } from './data/teachersData';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { 
  saveStudent, 
  deleteStudent,
  saveSlots, 
  subscribeToStudents, 
  getLocalSlots,
  saveTeacher,
  deleteTeacher,
  subscribeToTeachers,
  getLocalTeachers,
  subscribeToCoupons 
} from './services/db';
import { ShieldCheck, Calendar } from 'lucide-react';
import { GuakyChatbot } from './components/GuakyChatbot';
import { fetchLiveBcvRate, initMidnightBcvScheduler } from './services/currencyService';
import { trackStudentAction } from './services/telemetryService';

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
  const [isDirectScheduleBookingOpen, setIsDirectScheduleBookingOpen] = useState(false);

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

  // A remembered profile is only a convenience after student authentication, never proof of identity.
  // Visitors always start as guests even if this browser previously selected Ana or another student.
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const hasStudentSession = sessionStorage.getItem('cokito_student_auth') === 'true';
    const saved = hasStudentSession ? localStorage.getItem('cokito_active_student_id') : null;
    return saved || 'guest';
  });

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('cokito_active_student_id', currentStudentId);
    }
  }, [currentStudentId]);

  // Real-time Firestore Sync for Students
  useEffect(() => {
    const unsubStudents = subscribeToStudents((latestStudents) => {
      setStudents(latestStudents);
    });
    return () => {
      if (typeof unsubStudents === 'function') unsubStudents();
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
                placementTestScore: 20,
                placementTestDiagnosis: 'Acceso inicial activado con Google Sign-In',
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
      s.email.toLowerCase() === clean || 
      s.name.toLowerCase() === clean ||
      s.username?.toLowerCase() === clean ||
      s.cedula?.toLowerCase() === clean ||
      `${s.name} ${s.lastName || ''}`.trim().toLowerCase() === clean
    );

    if (matched) {
      // If student has a password set and user provided a password, verify it; otherwise permit direct email session
      if (!matched.password || !cleanPass || cleanPass === matched.password) {
        setCurrentStudentId(matched.id);
        setIsStudentAuthenticated(true);
        sessionStorage.setItem('cokito_student_auth', 'true');
        setIsProfileOpen(false);
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
        xp: 100,
        streak: 1,
        league: 'Bronce',
        rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
        notes: 'Acceso directo con correo electrónico',
        assignedSlots: []
      };
      void saveStudent(guestStudent);
      setStudents(prev => [...prev, guestStudent]);
      setCurrentStudentId(guestStudent.id);
      setIsStudentAuthenticated(true);
      sessionStorage.setItem('cokito_student_auth', 'true');
      setIsProfileOpen(false);
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCurrentStudentId('guest');
    setIsStudentAuthenticated(false);
    sessionStorage.removeItem('cokito_student_auth');
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
    const target = students.find(s => s.id === studentId);
    if (!target) return;
    const updated: Student = {
      ...target,
      xp: target.xp + amount,
      streak: target.streak + 1
    };
    await saveStudent(updated);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    await saveStudent(updatedStudent);

    // Also update slots if assigned
    if (updatedStudent.assignedSlots && updatedStudent.assignedSlots.length > 0) {
      const updatedSlots = slots.map(slot => {
        const slotTag = `${slot.day}-${slot.startTime}`;
        if (updatedStudent.assignedSlots.includes(slotTag)) {
          return {
            ...slot,
            status: 'booked' as const,
            studentId: updatedStudent.id,
            studentName: `${updatedStudent.name} ${updatedStudent.lastName || ''}`.trim(),
            levelId: updatedStudent.levelId,
            meetLink: 'https://meet.google.com/eng-cokito-class'
          };
        }
        return slot;
      });
      setSlots(updatedSlots);
      await saveSlots(updatedSlots);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
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

  const handlePaymentSuccess = async (method: string, reference: string) => {
    // If student exists, upgrade them to enrolled with digital pass
    if (currentStudent && currentStudent.id !== 'guest') {
      const updated: Student = {
        ...currentStudent,
        status: 'enrolled',
        plan: 'basic',
        xp: (currentStudent.xp || 0) + 200,
        notes: `${currentStudent.notes || ''} | Pase Digital $5 activado vía ${method} (Ref: ${reference})`
      };
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
      await saveStudent(updated);
    } else {
      const newStudentId = `student_${Date.now()}`;
      const newStudent: Student = {
        id: newStudentId,
        name: user?.displayName || 'Alumno Cokitö',
        lastName: '',
        email: user?.email || 'alumno@cokito.com',
        phone: '',
        age: 25,
        isKid: false,
        schoolOrProfession: 'Estudiante Digital',
        learningGoal: 'Aprender inglés a mi propio ritmo',
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=PaseDigital`,
        plan: 'basic',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Autónomo Asincrónico',
        status: 'enrolled',
        levelId: 'level_1',
        placementTestScore: 25,
        placementTestDiagnosis: 'Pase Digital $5 Activado',
        placementTestDate: new Date().toISOString().split('T')[0],
        registeredAt: new Date().toISOString().split('T')[0],
        currentUnit: 1,
        completedHours: 0,
        xp: 300,
        streak: 1,
        league: 'Bronce',
        rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
        notes: `Pase Digital $5 activado vía ${method} (Ref: ${reference})`,
        assignedSlots: []
      };
      setStudents(prev => [...prev, newStudent]);
      setCurrentStudentId(newStudent.id);
      await saveStudent(newStudent);
    }
    setIsPaymentModalOpen(false);
    setActiveTab('pathway');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      audienceTheme === 'kids' ? 'bg-sky-50/50 text-slate-800' : 'bg-slate-50 text-slate-900'
    }`}>
      
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
        onOpenProfile={() => setIsProfileOpen(true)}
        currentStudentXp={currentStudent?.xp || 0}
        currentStudentStreak={currentStudent?.streak || 0}
        currentStudent={currentStudent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allStudents={students}
        onSelectStudent={setCurrentStudentId}
      />

      {/* Main Content (with bottom padding on mobile for the floating bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        
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
            canSyncArenaLives={!isTeacherAuthenticated && Boolean(user && currentStudent && user.email?.toLowerCase() === currentStudent.email.toLowerCase())}
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
        audienceTheme={audienceTheme}
        onAudienceChange={setAudienceTheme}
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

      {/* Official Payment & Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        initialPlanName={checkoutPlan.title}
        initialAmountUsd={checkoutPlan.amount}
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
        studentName="Aspirante"
        onClose={() => setIsPlacementQuizOpen(false)}
        onFinishTest={() => {
          setIsPlacementQuizOpen(false);
          setActiveTab('register');
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
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Güakytopia • Open the World. Start where you are. Keep going.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#2EC4B6] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Privacidad y Confidencialidad Garantizada
            </span>
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
      </footer>

      {/* Güaky Macaw AI Chatbot with WhatsApp Welcome Lounge Bridge */}
      <GuakyChatbot 
        studentName={currentStudent?.name}
        teacherWhatsAppUsername="CokitoVZLA"
      />

    </div>
  );
}
