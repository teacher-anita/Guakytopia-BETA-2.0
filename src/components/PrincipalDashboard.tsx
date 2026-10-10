import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Users, 
  UserCheck, 
  Clock, 
  Calendar, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  ArrowRightLeft, 
  Settings, 
  Phone, 
  Mail, 
  Lock, 
  Unlock, 
  DollarSign,
  Award,
  Video,
  X,
  Check,
  Coffee,
  Smartphone,
  MessageCircle,
  TrendingUp,
  Gift,
  Tag,
  Power,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  FileText,
  RefreshCw,
  Send,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Student, Teacher, ScheduleSlot, EnglishLevel } from '../types';
import { ENGLISH_LEVELS } from '../data/curriculumData';
import { TeachersLounge } from './TeachersLounge';
import { 
  OFFICIAL_PAGO_MOVIL, 
  getBcvExchangeRate, 
  setBcvExchangeRateOverride, 
  clearBcvExchangeRateOverride,
  convertUsdToBs,
  getBcvDetails,
  fetchLiveBcvRate,
  BcvDetails 
} from '../services/currencyService';
import { 
  sendTeacherFlockWelcomeEmail, 
  sendStudentCampusWelcomeEmail, 
  generateTemporaryPassword,
  buildTeacherWelcomeEmailContent,
  buildStudentWelcomeEmailContent 
} from '../services/institutionalService';
import { 
  getFlockTeachersForLevel, 
  getFlockMentorsLabel 
} from '../services/matrixEngine';
import { CouponItem, getStoredCoupons, saveStoredCoupons, BenefitType, CouponCategory } from '../data/couponsData';
import { saveCoupon, deleteCoupon, subscribeToCoupons } from '../services/db';
import confetti from 'canvas-confetti';
import { 
  addStudentNotification, 
  getStoredClassRequests, 
  updateClassRequestStatus, 
  StudentClassRequest 
} from '../services/notificationService';

interface PrincipalDashboardProps {
  students: Student[];
  teachers: Teacher[];
  slots: ScheduleSlot[];
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddStudent: (student: Student) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateSlots: (slots: ScheduleSlot[]) => void;
  onSwitchView: (role: 'principal' | 'teacher' | 'student') => void;
  onLogout: () => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  students,
  teachers,
  slots,
  onUpdateStudent,
  onDeleteStudent,
  onAddStudent,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddTeacher,
  onUpdateSlots,
  onSwitchView,
  onLogout
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'classrooms' | 'payments' | 'lounge' | 'coupons' | 'profile'>('payments');

  // Coupon Management (Directora Waky Control)
  const [couponsList, setCouponsList] = useState<CouponItem[]>(() => getStoredCoupons());
  const [couponSearch, setCouponSearch] = useState('');
  const [couponCategoryFilter, setCouponCategoryFilter] = useState<'all' | CouponCategory>('all');
  const [couponStatusFilter, setCouponStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [couponNotice, setCouponNotice] = useState<string | null>(null);

  // Real-time Firestore Cloud Sync for Coupons across all devices & sessions
  useEffect(() => {
    const unsub = subscribeToCoupons((latest) => {
      setCouponsList(latest);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const [newCouponData, setNewCouponData] = useState<{
    code: string;
    title: string;
    description: string;
    category: CouponCategory;
    benefitType: BenefitType;
    maxUses: string;
    notes: string;
  }>({
    code: '',
    title: '',
    description: '',
    category: 'scholarship',
    benefitType: 'scholar_100',
    maxUses: '1',
    notes: ''
  });

  const handleToggleCouponActive = async (couponId: string) => {
    const target = couponsList.find(c => c.id === couponId);
    if (!target) return;
    const toggled = { ...target, isActive: !target.isActive };

    const updated = couponsList.map(c => c.id === couponId ? toggled : c);
    setCouponsList(updated);
    saveStoredCoupons(updated);

    // Sync to Firestore Cloud immediately
    await saveCoupon(toggled);

    setCouponNotice(`Cupón [${toggled.code}] ${toggled.isActive ? 'ACTIVADO 🟢' : 'DESACTIVADO 🔴'}`);
    setTimeout(() => setCouponNotice(null), 3000);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    const toDelete = couponsList.find(c => c.id === couponId);
    if (!toDelete) return;
    if (confirm(`¿Eliminar definitivamente el cupón [${toDelete.code}]?`)) {
      const updated = couponsList.filter(c => c.id !== couponId);
      setCouponsList(updated);
      saveStoredCoupons(updated);

      // Delete from Firestore Cloud immediately
      await deleteCoupon(couponId);

      setCouponNotice(`Cupón [${toDelete.code}] eliminado del sistema.`);
      setTimeout(() => setCouponNotice(null), 3000);
    }
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponData.code.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode) return;

    if (couponsList.some(c => c.code.toUpperCase() === cleanCode)) {
      alert(`Ya existe un cupón con el código ${cleanCode}. Elige otro código.`);
      return;
    }

    const maxU = newCouponData.maxUses === '' || newCouponData.maxUses === '0' || newCouponData.maxUses === 'unlimited'
      ? null
      : parseInt(newCouponData.maxUses, 10);

    const categoryLabels: Record<CouponCategory, string> = {
      scholarship: 'Becas Institucionales',
      csb: 'Colegio Simón Bolívar',
      launch: 'Lanzamiento Especial',
      ambassador: 'Embajadores VIP',
      tester: 'Beta Testers'
    };

    const newCoupon: CouponItem = {
      id: `cp_${Date.now()}_${cleanCode.toLowerCase()}`,
      code: cleanCode,
      category: newCouponData.category,
      categoryLabel: categoryLabels[newCouponData.category] || 'General',
      benefitType: newCouponData.benefitType,
      title: newCouponData.title.trim() || `Pase Institucional ${cleanCode}`,
      description: newCouponData.description.trim() || "Official Güakytopia Academy benefit authorized by the Principal's Office.",
      maxUses: isNaN(maxU as number) ? null : maxU,
      currentUses: 0,
      isActive: true,
      notes: newCouponData.notes.trim() || 'Creado directamente por Directora Waky',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newCoupon, ...couponsList];
    setCouponsList(updated);
    saveStoredCoupons(updated);

    // Save to Firestore Cloud immediately so all clients and devices see it in real-time
    await saveCoupon(newCoupon);

    setIsNewCouponModalOpen(false);
    setNewCouponData({
      code: '',
      title: '',
      description: '',
      category: 'scholarship',
      benefitType: 'scholar_100',
      maxUses: '1',
      notes: ''
    });
    setCouponNotice(`¡Cupón [${cleanCode}] creado y activo inmediatamente en Güakytopia y la nube! ✨`);
    setTimeout(() => setCouponNotice(null), 3500);
  };

  // Student Full Profile Edit Modal State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editStudentForm, setEditStudentForm] = useState<Partial<Student>>({});

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditStudentForm({ ...student });
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const updated: Student = {
      ...editingStudent,
      ...editStudentForm,
      name: editStudentForm.name?.trim() || editingStudent.name,
      lastName: editStudentForm.lastName?.trim() || '',
      email: editStudentForm.email?.trim().toLowerCase() || editingStudent.email,
      username: editStudentForm.username?.trim().toLowerCase() || editingStudent.username,
      notes: `${editStudentForm.notes || ''} | Modificado por Directora Waky el ${new Date().toLocaleDateString('es-VE')}`
    };
    onUpdateStudent(updated);
    setEditingStudent(null);
    setApprovalNotice(`¡Perfil de ${updated.name} actualizado con éxito!`);
    setTimeout(() => setApprovalNotice(null), 3000);
  };

  const handleToggleStudentStatus = (student: Student) => {
    const nextStatus = student.status === 'enrolled' ? 'paused' : 'enrolled';
    const updated: Student = {
      ...student,
      status: nextStatus,
      notes: `${student.notes || ''} | Estado cambiado a ${nextStatus} por Directora Waky el ${new Date().toLocaleDateString('es-VE')}`
    };
    onUpdateStudent(updated);
    setApprovalNotice(`Alumno ${student.name} ${nextStatus === 'enrolled' ? 'activado' : 'pausado / suspendido'} correctamente.`);
    setTimeout(() => setApprovalNotice(null), 3000);
  };

  // Directora Waky: Class Assignment & Student Requests Management
  const [classRequests, setClassRequests] = useState<StudentClassRequest[]>(() => getStoredClassRequests());
  const [assigningClassesStudent, setAssigningClassesStudent] = useState<Student | null>(null);
  const [assignTeacherId, setAssignTeacherId] = useState<string>('teacher_cokito');
  const [assignSlots, setAssignSlots] = useState<string[]>(['Sábados de 10:00 am a 12:00 pm (Todos los Sábados)']);
  const [customScheduleText, setCustomScheduleText] = useState<string>('Sábados de 10:00 am a 12:00 pm (Todos los Sábados)');
  const [assignDays, setAssignDays] = useState<string[]>(['Sábado']);
  const [assignStartTime, setAssignStartTime] = useState<string>('10:00 AM');
  const [assignEndTime, setAssignEndTime] = useState<string>('12:00 PM');
  const [assignFrequency, setAssignFrequency] = useState<string>('Todos los Sábados');
  const [assignSlotsList, setAssignSlotsList] = useState<string[]>(['Sábados de 10:00 am a 12:00 pm (Todos los Sábados)']);
  const [assignLevelId, setAssignLevelId] = useState<string>('level_1');
  const [assignUnit, setAssignUnit] = useState<number>(1);
  const [assignPhoneNotes, setAssignPhoneNotes] = useState<string>('');
  const [assignMeetLink, setAssignMeetLink] = useState<string>('https://meet.google.com/cok-waky-cls');
  const [assignMessage, setAssignMessage] = useState<string>('');
  const [assignedNotificationSummary, setAssignedNotificationSummary] = useState<{
    studentName: string;
    studentEmail: string;
    teacherName: string;
    schedule: string;
    meetLink: string;
    whatsappUrl: string;
  } | null>(null);

  const handleOpenAssignClasses = (student: Student, preferredSchedule?: string, preferredTeacher?: string) => {
    setAssigningClassesStudent(student);
    setAssignLevelId(student.levelId || 'level_1');
    setAssignUnit(student.currentUnit || 1);
    
    // Auto select teacher
    if (preferredTeacher) {
      const match = teachers.find(t => t.name.toLowerCase().includes(preferredTeacher.toLowerCase()));
      setAssignTeacherId(match ? match.id : 'teacher_cokito');
    } else if (student.teacherId) {
      setAssignTeacherId(student.teacherId);
    } else {
      setAssignTeacherId('teacher_cokito');
    }

    // Directora phone call & schedule configuration logic
    if (student.assignedSlots && student.assignedSlots.length > 0) {
      setAssignSlotsList(student.assignedSlots);
      setCustomScheduleText(student.assignedSlots.join(' • '));
      const firstSlot = student.assignedSlots[0];
      if (firstSlot.toLowerCase().includes('sábado') || firstSlot.toLowerCase().includes('sabado')) {
        setAssignDays(['Sábado']);
        setAssignStartTime('10:00 AM');
        setAssignEndTime('12:00 PM');
        setAssignFrequency('Todos los Sábados');
      }
    } else {
      // Default to Saturdays 10:00 am - 12:00 pm (especially for Genesis and weekend intensives)
      const defaultSlot = 'Sábados de 10:00 am a 12:00 pm (Todos los Sábados)';
      setAssignDays(['Sábado']);
      setAssignStartTime('10:00 AM');
      setAssignEndTime('12:00 PM');
      setAssignFrequency('Todos los Sábados');
      setAssignSlotsList([defaultSlot]);
      setCustomScheduleText(defaultSlot);
      setAssignPhoneNotes('Acordado directamente por llamada telefónica: clases fijas todos los sábados de 10:00 am a 12:00 pm.');
    }

    setAssignMeetLink('https://meet.google.com/cok-waky-cls');
    setAssignMessage(
      `¡Hola ${student.name}! Directora Waky ha configurado oficialmente tus clases de inglés en Güakytopia. Tus sesiones quedan agendadas todos los sábados de 10:00 am a 12:00 pm con tu Teacher.`
    );
  };

  const handleToggleAssignDay = (day: string) => {
    const nextDays = assignDays.includes(day)
      ? (assignDays.length > 1 ? assignDays.filter(d => d !== day) : assignDays)
      : [...assignDays, day];
    setAssignDays(nextDays);
    const dayLabel = nextDays.length === 1 ? `Todos los ${nextDays[0]}s` : nextDays.join(' y ');
    const slotStr = `${dayLabel} de ${assignStartTime} a ${assignEndTime} (${assignFrequency})`;
    setCustomScheduleText(slotStr);
  };

  const handleApplyPresetSlot = (preset: {
    days: string[];
    start: string;
    end: string;
    frequency: string;
    label: string;
  }) => {
    setAssignDays(preset.days);
    setAssignStartTime(preset.start);
    setAssignEndTime(preset.end);
    setAssignFrequency(preset.frequency);
    setAssignSlotsList([preset.label]);
    setCustomScheduleText(preset.label);
    setAssignMessage(
      `¡Hola ${assigningClassesStudent?.name || ''}! Directora Waky ha configurado tus clases en Güakytopia para ${preset.label}. ¡Todo listo para iniciar!`
    );
  };

  const handleAddCurrentBlockToList = () => {
    const dayLabel = assignDays.length === 1 ? `Todos los ${assignDays[0]}s` : assignDays.join(' y ');
    const slotStr = `${dayLabel} de ${assignStartTime} a ${assignEndTime} (${assignFrequency})`;
    if (!assignSlotsList.includes(slotStr)) {
      const updated = [...assignSlotsList, slotStr];
      setAssignSlotsList(updated);
      setCustomScheduleText(updated.join(' • '));
    }
  };

  const handleRemoveSlotFromList = (slotToRemove: string) => {
    const updated = assignSlotsList.filter(s => s !== slotToRemove);
    setAssignSlotsList(updated);
    setCustomScheduleText(updated.length > 0 ? updated.join(' • ') : '');
  };

  const handleConfirmClassAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningClassesStudent) return;

    const teacherObj = teachers.find(t => t.id === assignTeacherId) || {
      id: assignTeacherId,
      name: assignTeacherId === 'teacher_cokito' ? 'Teacher Cokitö' : assignTeacherId === 'teacher_andrea' ? 'Teacher Andrea' : 'Teacher Carlos'
    };

    const finalSlots = assignSlotsList.length > 0 ? assignSlotsList : [customScheduleText];

    const updatedStudent: Student = {
      ...assigningClassesStudent,
      teacherId: teacherObj.id,
      teacherName: teacherObj.name,
      assignedSlots: finalSlots,
      levelId: assignLevelId,
      currentUnit: assignUnit,
      status: 'enrolled',
      notes: `${assigningClassesStudent.notes || ''} | ${assignPhoneNotes || 'Acuerdo de Rectoría'} (${teacherObj.name} • ${finalSlots.join(', ')}) el ${new Date().toLocaleDateString('es-VE')}`
    };

    onUpdateStudent(updatedStudent);

    // Save student notification to inbox
    addStudentNotification({
      studentId: assigningClassesStudent.id,
      type: 'class_assigned',
      title: `¡Tus clases de inglés han sido programadas! 🎓✨`,
      message: assignMessage || `Directora Waky te ha asignado a ${teacherObj.name}. Horario oficial: ${finalSlots.join(' • ')}. ¡Nos vemos en el aula virtual!`,
      teacherName: teacherObj.name,
      slots: finalSlots,
      levelTitle: ENGLISH_LEVELS.find(l => l.id === assignLevelId)?.levelName || assignLevelId,
      meetLink: assignMeetLink
    });

    // Mark any pending request as approved
    const pendingReq = classRequests.find(r => r.studentId === assigningClassesStudent.id && r.status === 'pending');
    if (pendingReq) {
      updateClassRequestStatus(pendingReq.id, 'approved');
      setClassRequests(getStoredClassRequests());
    }

    try {
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
    } catch {}

    const cleanPhone = (assigningClassesStudent.phone || '+584147891234').replace(/[^0-9]/g, '');
    const scheduleSummary = finalSlots.join(' • ');
    const waText = encodeURIComponent(
      `¡Hola ${assigningClassesStudent.name}! 🌴✨ Te saluda la Rectoría de Güakytopia (Directora Waky).\n\n` +
      `Tus clases oficiales de inglés han sido agendadas con éxito conforme a lo acordado:\n` +
      `🪶 Teacher Asignado: ${teacherObj.name}\n` +
      `📅 Horario Oficial: ${scheduleSummary}\n` +
      `📚 Nivel: ${ENGLISH_LEVELS.find(l => l.id === assignLevelId)?.levelName || assignLevelId} (Unidad ${assignUnit})\n` +
      `💻 Enlace Google Meet: ${assignMeetLink}\n\n` +
      `Tu cuenta ya tiene acceso completo a la plataforma interactiva y a tus unidades didácticas. ¡Bienvenida a tu camino hacia la fluidez bilingüe!`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

    setAssignedNotificationSummary({
      studentName: assigningClassesStudent.name,
      studentEmail: assigningClassesStudent.email,
      teacherName: teacherObj.name,
      schedule: scheduleSummary,
      meetLink: assignMeetLink,
      whatsappUrl
    });

    setAssigningClassesStudent(null);
    setApprovalNotice(`¡Clases de ${assigningClassesStudent.name} agendadas con éxito (${scheduleSummary})! ✨`);
    setTimeout(() => setApprovalNotice(null), 4500);
  };

  // BCV Rate Management (Waky Control) - Live Official BCV with automated midnight updates
  const [bcvDetails, setBcvDetails] = useState<BcvDetails>(() => getBcvDetails());
  const [currentBcvRate, setCurrentBcvRate] = useState<number>(() => getBcvExchangeRate());
  const [isEditingBcvRate, setIsEditingBcvRate] = useState(false);
  const [bcvRateInput, setBcvRateInput] = useState<string>(() => getBcvExchangeRate().toString());
  const [bcvRateSavedNotice, setBcvRateSavedNotice] = useState<string | null>(null);
  const [isSyncingBcv, setIsSyncingBcv] = useState(false);

  useEffect(() => {
    const handleBcvChange = () => {
      const details = getBcvDetails();
      setBcvDetails(details);
      setCurrentBcvRate(details.rate);
      setBcvRateInput(details.rate.toString());
    };
    window.addEventListener('bcv_rate_updated', handleBcvChange);
    return () => window.removeEventListener('bcv_rate_updated', handleBcvChange);
  }, []);

  const handleSaveBcvRate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(bcvRateInput);
    if (!isNaN(val) && val > 0) {
      setBcvExchangeRateOverride(val);
      setCurrentBcvRate(val);
      setBcvDetails(getBcvDetails());
      setIsEditingBcvRate(false);
      setBcvRateSavedNotice(`Tasa manual establecida en Bs. ${val.toFixed(2)}`);
      setTimeout(() => setBcvRateSavedNotice(null), 3000);
    }
  };

  const handleSyncBcv = async () => {
    setIsSyncingBcv(true);
    try {
      const freshRate = await fetchLiveBcvRate(true);
      const details = getBcvDetails();
      setBcvDetails(details);
      setCurrentBcvRate(freshRate);
      setBcvRateInput(freshRate.toString());
      setBcvRateSavedNotice(`Tasa sincronizada exitosamente con el BCV: Bs. ${freshRate.toFixed(2)}`);
      setTimeout(() => setBcvRateSavedNotice(null), 3500);
    } catch {
      setBcvRateSavedNotice('No se pudo sincronizar en este momento. Se mantiene la tasa activa.');
      setTimeout(() => setBcvRateSavedNotice(null), 3500);
    } finally {
      setIsSyncingBcv(false);
    }
  };

  const handleRestoreOfficialBcv = () => {
    clearBcvExchangeRateOverride();
    const details = getBcvDetails();
    setBcvDetails(details);
    setCurrentBcvRate(details.rate);
    setBcvRateInput(details.rate.toString());
    setBcvRateSavedNotice(`Tasa restaurada a la oficial del BCV (Bs. ${details.rate.toFixed(2)}). Actualización a medianoche reactivada.`);
    setTimeout(() => setBcvRateSavedNotice(null), 4000);
  };

  // Payment Management Tab State
  const [paymentSubFilter, setPaymentSubFilter] = useState<'pending' | 'trials' | 'deposits' | 'all'>('pending');
  const [approvingStudent, setApprovingStudent] = useState<Student | null>(null);
  const [approvalSlotId, setApprovalSlotId] = useState<string>('');
  const [approvalTeacherId, setApprovalTeacherId] = useState<string>('');
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);

  // Quick Approval Handler
  const handleApprovePayment = (student: Student, slotId?: string, teacherId?: string) => {
    const isDeposit = student.depositAmountUsd === 5 && student.plan !== 'basic';
    const chosenTeacher = teachers.find(t => t.id === teacherId);
    
    let updatedSlots = [...(student.assignedSlots || [])];
    if (slotId && !updatedSlots.includes(slotId)) {
      updatedSlots.push(slotId);
      // Update schedule slots
      if (onUpdateSlots) {
        const nextSlots = slots.map(s => {
          if (s.id === slotId) {
            const currentEnrolled = s.enrolledStudents || [];
            if (!currentEnrolled.some(e => e.studentId === student.id)) {
              return {
                ...s,
                enrolledStudents: [
                  ...currentEnrolled,
                  {
                    studentId: student.id,
                    studentName: `${student.name} ${student.lastName || ''}`.trim(),
                    levelId: student.levelId || 'level_1',
                    avatar: student.avatar,
                    email: student.email
                  }
                ],
                status: 'booked' as const
              };
            }
          }
          return s;
        });
        onUpdateSlots(nextSlots);
      }
    }

    const updated: Student = {
      ...student,
      status: 'enrolled',
      paymentStatus: isDeposit ? 'deposit_5_paid' : 'fully_paid',
      teacherId: teacherId || student.teacherId,
      teacherName: chosenTeacher ? `Teacher ${chosenTeacher.name}` : student.teacherName,
      assignedSlots: updatedSlots,
      notes: `${student.notes || ''} | Pago verificado y aprobado por Directora Waky el ${new Date().toLocaleDateString('es-VE')}`
    };

    onUpdateStudent(updated);
    setApprovingStudent(null);
    setApprovalNotice(`¡Pago de ${student.name} aprobado y matrícula activada exitosamente!`);
    setTimeout(() => setApprovalNotice(null), 3500);
  };

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');

  // Teacher Modals
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isNewTeacherModalOpen, setIsNewTeacherModalOpen] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState<Partial<Teacher>>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: 'Super Goal & Kids Foundations',
    levelsAssigned: ['level_1', 'level_2'],
    assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    workingHours: '08:00 - 14:00',
    status: 'active',
    hourlyRate: 15,
    bio: ''
  });
  const [sendTeacherWelcomeEmailFlag, setSendTeacherWelcomeEmailFlag] = useState(true);

  // Student Modals
  const [movingStudent, setMovingStudent] = useState<Student | null>(null);
  const [targetLevelId, setTargetLevelId] = useState('level_1');
  const [targetUnit, setTargetUnit] = useState(1);
  const [targetTeacherId, setTargetTeacherId] = useState('');
  const [targetStatus, setTargetStatus] = useState<'enrolled' | 'pending_evaluation' | 'paused' | 'completed'>('enrolled');
  const [targetSlotId, setTargetSlotId] = useState<string>('none');

  // Classrooms filter and assignment state
  const [slotDayFilter, setSlotDayFilter] = useState<string>('all');
  const [slotTeacherFilter, setSlotTeacherFilter] = useState<string>('all');
  const [slotSearch, setSlotSearch] = useState<string>('');
  const [selectedSlotForEnrollStudent, setSelectedSlotForEnrollStudent] = useState<ScheduleSlot | null>(null);
  const [studentToEnrollId, setStudentToEnrollId] = useState<string>('');

  // New Student Manual Registration Modal
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [sendStudentWelcomeEmailFlag, setSendStudentWelcomeEmailFlag] = useState(true);
  const [newStudentMentorshipMode, setNewStudentMentorshipMode] = useState<'rotational' | 'exclusive'>('rotational');
  const [newStudentExclusiveTeacherId, setNewStudentExclusiveTeacherId] = useState<string>('');
  const [newStudentData, setNewStudentData] = useState<Partial<Student>>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    age: 25,
    isKid: false,
    schoolOrProfession: 'Estudiante Campus Güakytopia',
    learningGoal: 'Superación laboral y fluidez conversacional',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Tardes',
    levelId: 'level_1',
    currentUnit: 1,
    status: 'enrolled'
  });

  // Slot Teacher Assignment Modal
  const [selectedSlotForTeacher, setSelectedSlotForTeacher] = useState<ScheduleSlot | null>(null);

  // Modal de Carta Oficial y Credenciales (The Flock & Campus)
  const [activeCredentialsModal, setActiveCredentialsModal] = useState<{
    recipientName: string;
    recipientEmail: string;
    role: 'teacher' | 'student';
    temporaryPassword: string;
    subject: string;
    bodyText: string;
    gmailWebUrl: string;
    mode: 'gmail_api' | 'campus_logged';
  } | null>(null);

  // Ver carta oficial de teacher en modal
  const handleOpenTeacherLetterModal = (teacher: Teacher) => {
    const tempPass = teacher.temporaryPassword || 'FLOCK-3223';
    const content = buildTeacherWelcomeEmailContent(teacher, tempPass);
    setActiveCredentialsModal({
      recipientName: `Teacher ${teacher.name}`,
      recipientEmail: teacher.email,
      role: 'teacher',
      temporaryPassword: tempPass,
      subject: content.subject,
      bodyText: content.bodyText,
      gmailWebUrl: content.gmailWebUrl,
      mode: teacher.welcomeEmailSent ? 'gmail_api' : 'campus_logged'
    });
  };

  // Ver carta oficial de alumno en modal
  const handleOpenStudentLetterModal = (student: Student) => {
    const tempPass = student.temporaryPassword || 'FLOCK-CAMPUS';
    const mentorsSummary = getFlockMentorsLabel(teachers, student.levelId || 'level_1');
    const content = buildStudentWelcomeEmailContent(student, {
      temporaryPassword: tempPass,
      flockMentorsSummary: mentorsSummary,
      mentorName: student.teacherName
    });
    setActiveCredentialsModal({
      recipientName: `${student.name} ${student.lastName || ''}`.trim(),
      recipientEmail: student.email,
      role: 'student',
      temporaryPassword: tempPass,
      subject: content.subject,
      bodyText: content.bodyText,
      gmailWebUrl: content.gmailWebUrl,
      mode: student.welcomeEmailSent ? 'gmail_api' : 'campus_logged'
    });
  };

  // Reenviar credenciales de teachers
  const handleResendTeacherEmail = async (teacher: Teacher) => {
    const tempPass = teacher.temporaryPassword || generateTemporaryPassword();
    const res = await sendTeacherFlockWelcomeEmail(teacher, tempPass);
    if (res.success) {
      onUpdateTeacher({
        ...teacher,
        temporaryPassword: tempPass,
        welcomeEmailSent: true,
        welcomeEmailSentAt: new Date().toISOString()
      });
      setActiveCredentialsModal({
        recipientName: `Teacher ${teacher.name}`,
        recipientEmail: teacher.email,
        role: 'teacher',
        temporaryPassword: tempPass,
        subject: res.subject,
        bodyText: res.bodyText || '',
        gmailWebUrl: res.gmailWebUrl || '',
        mode: res.mode
      });
      setApprovalNotice(`🪶 Credenciales de la Manada preparadas para ${teacher.email} (Clave: ${tempPass})`);
      setTimeout(() => setApprovalNotice(null), 4500);
    }
  };

  // Reenviar credenciales de alumno
  const handleResendStudentEmail = async (student: Student) => {
    const tempPass = student.temporaryPassword || generateTemporaryPassword();
    const mentorsSummary = getFlockMentorsLabel(teachers, student.levelId || 'level_1');
    const res = await sendStudentCampusWelcomeEmail(student, {
      temporaryPassword: tempPass,
      flockMentorsSummary: mentorsSummary,
      mentorName: student.teacherName
    });
    if (res.success) {
      onUpdateStudent({
        ...student,
        temporaryPassword: tempPass,
        welcomeEmailSent: true,
        welcomeEmailSentAt: new Date().toISOString()
      });
      setActiveCredentialsModal({
        recipientName: `${student.name} ${student.lastName || ''}`.trim(),
        recipientEmail: student.email,
        role: 'student',
        temporaryPassword: tempPass,
        subject: res.subject,
        bodyText: res.bodyText || '',
        gmailWebUrl: res.gmailWebUrl || '',
        mode: res.mode
      });
      setApprovalNotice(`🎉 Credenciales de acceso al Campus preparadas para ${student.email} (Clave: ${tempPass})`);
      setTimeout(() => setApprovalNotice(null), 4500);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const fullName = `${s.name} ${s.lastName || ''}`.toLowerCase();
    const matchesSearch = !studentSearch || 
      fullName.includes(studentSearch.toLowerCase()) || 
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesLevel = studentLevelFilter === 'all' || s.levelId === studentLevelFilter;
    const matchesStatus = studentStatusFilter === 'all' || s.status === studentStatusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Calculate Statistics
  const activeStudentsCount = students.filter(s => s.status === 'enrolled').length;
  const pendingStudentsCount = students.filter(s => s.status === 'pending_evaluation').length;
  const activeTeachersCount = teachers.filter(t => t.status === 'active').length;
  const bookedSlotsCount = slots.filter(s => s.status === 'booked').length;

  // Handle Save Teacher
  const handleSaveTeacherEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    onUpdateTeacher(editingTeacher);
    setEditingTeacher(null);
  };

  // Handle Create Teacher
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherData.name || !newTeacherData.email) return;

    const tempPassword = generateTemporaryPassword();
    const teacherToAdd: Teacher = {
      id: `teacher_${Date.now()}`,
      name: newTeacherData.name.trim(),
      lastName: newTeacherData.lastName?.trim() || '',
      email: newTeacherData.email.trim().toLowerCase(),
      phone: newTeacherData.phone?.trim() || '',
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${newTeacherData.name}`,
      specialty: newTeacherData.specialty || 'General English & Communicative Confidence',
      levelsAssigned: newTeacherData.levelsAssigned || ['level_1', 'level_2'],
      assignedDays: newTeacherData.assignedDays || ['Lunes', 'Miércoles'],
      workingHours: newTeacherData.workingHours || '08:00 - 14:00',
      status: (newTeacherData.status as any) || 'active',
      hourlyRate: Number(newTeacherData.hourlyRate) || 15,
      bio: newTeacherData.bio || 'Mentor de Güakytopia\'s Flock',
      flockRole: 'Flock Mentor',
      password: tempPassword,
      temporaryPassword: tempPassword,
      welcomeEmailSent: false
    };

    let emailRes: any = null;
    if (sendTeacherWelcomeEmailFlag) {
      emailRes = await sendTeacherFlockWelcomeEmail(teacherToAdd, tempPassword);
      if (emailRes?.success) {
        teacherToAdd.welcomeEmailSent = true;
        teacherToAdd.welcomeEmailSentAt = emailRes.timestamp;
      }
    }

    onAddTeacher(teacherToAdd);
    setIsNewTeacherModalOpen(false);
    setNewTeacherData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: 'Super Goal & Kids Foundations',
      levelsAssigned: ['level_1', 'level_2'],
      assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      workingHours: '08:00 - 14:00',
      status: 'active',
      hourlyRate: 15,
      bio: ''
    });

    if (emailRes) {
      setActiveCredentialsModal({
        recipientName: `Teacher ${teacherToAdd.name}`,
        recipientEmail: teacherToAdd.email,
        role: 'teacher',
        temporaryPassword: tempPassword,
        subject: emailRes.subject,
        bodyText: emailRes.bodyText || '',
        gmailWebUrl: emailRes.gmailWebUrl || '',
        mode: emailRes.mode
      });
    }

    setApprovalNotice(`🪶 ¡Teacher ${teacherToAdd.name} guardado en base de datos e integrado a la Manada (The Flock)! ${sendTeacherWelcomeEmailFlag ? `Credenciales preparadas para ${teacherToAdd.email} (Clave provisional: ${tempPassword})` : ''}`);
    setTimeout(() => setApprovalNotice(null), 4500);
  };

  // Handle Student Movement / Reassignment
  const handleApplyStudentMove = () => {
    if (!movingStudent) return;

    const matchedTeacher = teachers.find(t => t.id === targetTeacherId);
    let newAssignedSlots = [...(movingStudent.assignedSlots || [])];

    if (targetSlotId && targetSlotId !== 'none') {
      if (!newAssignedSlots.includes(targetSlotId)) {
        newAssignedSlots.push(targetSlotId);
      }
      // Also update slot's enrolled students
      const slot = slots.find(s => s.id === targetSlotId);
      if (slot) {
        const curEnrolled = slot.enrolledStudents || [];
        if (!curEnrolled.some(e => e.studentId === movingStudent.id)) {
          const newEnrolled = [
            ...curEnrolled,
            {
              studentId: movingStudent.id,
              studentName: `${movingStudent.name} ${movingStudent.lastName || ''}`.trim(),
              levelId: targetLevelId,
              avatar: movingStudent.avatar,
              email: movingStudent.email
            }
          ];
          const maxCap = slot.maxCapacity || 1;
          const isNowBooked = newEnrolled.length >= maxCap;
          const updatedSlot: ScheduleSlot = {
            ...slot,
            status: isNowBooked ? 'booked' : 'available',
            studentId: movingStudent.id,
            studentName: `${movingStudent.name} ${movingStudent.lastName || ''}`.trim(),
            levelId: targetLevelId,
            enrolledStudents: newEnrolled
          };
          onUpdateSlots(slots.map(s => s.id === slot.id ? updatedSlot : s));
        }
      }
    }

    const updated: Student = {
      ...movingStudent,
      levelId: targetLevelId,
      currentUnit: targetUnit,
      status: targetStatus,
      teacherId: targetTeacherId || movingStudent.teacherId,
      teacherName: matchedTeacher ? `${matchedTeacher.name} ${matchedTeacher.lastName || ''}`.trim() : movingStudent.teacherName,
      assignedSlots: newAssignedSlots,
      notes: `${movingStudent.notes || ''} | [Rectoría Waky]: Movido a ${targetLevelId} Unidad ${targetUnit} (${new Date().toLocaleDateString()})`
    };

    onUpdateStudent(updated);
    setMovingStudent(null);
  };

  // Remove student from specific classroom slot
  const handleRemoveStudentFromSlot = (slotId: string, studentId: string) => {
    const updatedSlots = slots.map(s => {
      if (s.id === slotId) {
        const remaining = (s.enrolledStudents || []).filter(e => e.studentId !== studentId);
        return {
          ...s,
          enrolledStudents: remaining,
          status: remaining.length > 0 ? ('booked' as const) : ('available' as const),
          studentId: remaining[0]?.studentId,
          studentName: remaining[0]?.studentName,
          levelId: remaining[0]?.levelId
        };
      }
      return s;
    });
    onUpdateSlots(updatedSlots);

    const student = students.find(s => s.id === studentId);
    if (student) {
      onUpdateStudent({
        ...student,
        assignedSlots: (student.assignedSlots || []).filter(id => id !== slotId)
      });
    }
  };

  // Enroll student in classroom slot
  const handleEnrollStudentInSlot = (slotId: string, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const curEnrolled = slot.enrolledStudents || [];
    if (curEnrolled.some(e => e.studentId === student.id)) return;

    const newEnrolled = [
      ...curEnrolled,
      {
        studentId: student.id,
        studentName: `${student.name} ${student.lastName || ''}`.trim(),
        levelId: student.levelId || 'level_1',
        avatar: student.avatar,
        email: student.email
      }
    ];

    const maxCap = slot.maxCapacity || 1;
    const isNowBooked = newEnrolled.length >= maxCap;

    const updatedSlot: ScheduleSlot = {
      ...slot,
      status: isNowBooked ? 'booked' : 'available',
      studentId: student.id,
      studentName: `${student.name} ${student.lastName || ''}`.trim(),
      levelId: student.levelId,
      meetLink: slot.meetLink || `https://meet.google.com/eng-${slot.id}-${Date.now().toString().slice(-4)}`,
      enrolledStudents: newEnrolled
    };

    onUpdateSlots(slots.map(s => s.id === slot.id ? updatedSlot : s));
    onUpdateStudent({
      ...student,
      status: 'enrolled',
      assignedSlots: Array.from(new Set([...(student.assignedSlots || []), slot.id]))
    });
    setSelectedSlotForEnrollStudent(null);
    setStudentToEnrollId('');
  };

  // Handle Create Student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.email) return;

    const tempPassword = generateTemporaryPassword();
    const isExclusive = newStudentMentorshipMode === 'exclusive' && Boolean(newStudentExclusiveTeacherId);
    const exclusiveTeacher = isExclusive ? teachers.find(t => t.id === newStudentExclusiveTeacherId) : null;

    const studentToAdd: Student = {
      id: `student_${Date.now()}`,
      name: newStudentData.name.trim(),
      lastName: newStudentData.lastName?.trim() || '',
      email: newStudentData.email.trim().toLowerCase(),
      phone: newStudentData.phone?.trim() || '',
      age: Number(newStudentData.age) || 20,
      isKid: Boolean(newStudentData.isKid),
      schoolOrProfession: newStudentData.schoolOrProfession || 'Estudiante Campus Güakytopia',
      learningGoal: newStudentData.learningGoal || 'Inglés conversacional y fluidez',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newStudentData.name}`,
      plan: newStudentData.plan || 'basic',
      modality: newStudentData.modality || 'online',
      groupSize: newStudentData.groupSize || 'individual',
      preferredTimeSlot: newStudentData.preferredTimeSlot || 'Tardes',
      levelId: newStudentData.levelId || 'level_1',
      currentUnit: Number(newStudentData.currentUnit) || 1,
      status: newStudentData.status || 'enrolled',
      registeredAt: new Date().toISOString().split('T')[0],
      completedHours: 0,
      xp: 300,
      streak: 1,
      league: 'Bronce',
      rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
      notes: `Matriculado directamente en el Campus por The Principal (Directora Waky). ${isExclusive ? `Mentor exclusivo: ${exclusiveTeacher?.name}` : 'Modo rotativo Manada (The Flock)'}`,
      assignedSlots: [],
      isExclusiveTeacher: isExclusive,
      teacherId: isExclusive ? exclusiveTeacher?.id : undefined,
      teacherName: isExclusive ? `Teacher ${exclusiveTeacher?.name}` : undefined,
      password: tempPassword,
      temporaryPassword: tempPassword,
      welcomeEmailSent: false
    };

    let emailRes: any = null;
    if (sendStudentWelcomeEmailFlag) {
      const mentorsSummary = getFlockMentorsLabel(teachers, studentToAdd.levelId || 'level_1');
      emailRes = await sendStudentCampusWelcomeEmail(studentToAdd, {
        temporaryPassword: tempPassword,
        flockMentorsSummary: mentorsSummary,
        mentorName: exclusiveTeacher?.name
      });
      if (emailRes?.success) {
        studentToAdd.welcomeEmailSent = true;
        studentToAdd.welcomeEmailSentAt = emailRes.timestamp;
      }
    }

    onAddStudent(studentToAdd);
    setIsNewStudentModalOpen(false);

    if (emailRes) {
      setActiveCredentialsModal({
        recipientName: `${studentToAdd.name} ${studentToAdd.lastName || ''}`.trim(),
        recipientEmail: studentToAdd.email,
        role: 'student',
        temporaryPassword: tempPassword,
        subject: emailRes.subject,
        bodyText: emailRes.bodyText || '',
        gmailWebUrl: emailRes.gmailWebUrl || '',
        mode: emailRes.mode
      });
    }

    setApprovalNotice(`🎉 ¡${studentToAdd.name} matriculado en el Campus y guardado en base de datos! ${sendStudentWelcomeEmailFlag ? `Carta oficial con credenciales preparada para ${studentToAdd.email} (Clave: ${tempPassword})` : ''}`);
    setTimeout(() => setApprovalNotice(null), 4500);
  };

  // Assign Teacher to Slot
  const handleAssignTeacherToSlot = (teacherId: string) => {
    if (!selectedSlotForTeacher) return;
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const updatedSlots = slots.map(s => {
      if (s.id === selectedSlotForTeacher.id) {
        return {
          ...s,
          teacherName: `Teacher ${teacher.name}`
        };
      }
      return s;
    });

    onUpdateSlots(updatedSlots);
    setSelectedSlotForTeacher(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      
      {/* 1. TOP INSTITUTIONAL COMMAND HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-6 sm:p-8 text-slate-950 shadow-xl border border-amber-400">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Crown className="w-4 h-4 text-amber-400" />
                The Principal • Directora General
              </span>
              <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                👑 Office Session
              </span>
              <span className="bg-amber-100 text-amber-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs border border-amber-300">
                <Settings className="w-3.5 h-3.5 text-amber-700" />
                <span>Panel de dirección</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              Güakytopia Academy • Principal's Office
            </h1>

            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              Lead the academy from one place: manage scholarships and rewards, support students and teachers, review payments, and keep learning moving forward with Waky, The Principal.
            </p>
          </div>

          {/* Quick Impersonation / Role Switcher */}
          <div className="bg-slate-950 text-white rounded-2xl p-4 border border-amber-300/40 w-full lg:w-80 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Vista de demostración
              </span>
              <span className="text-[10px] text-slate-400">Ver como:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => onSwitchView('teacher')}
                className="py-2 px-3 bg-blue-900/80 hover:bg-blue-800 text-blue-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Ver la plataforma tal como la ve un Teacher"
              >
                <span>👩‍🏫 Teacher</span>
              </button>
              <button
                onClick={() => onSwitchView('student')}
                className="py-2 px-3 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Ver la plataforma tal como la ve un Alumno"
              >
                <span>🎓 Alumno</span>
              </button>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-1.5 text-center text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Cerrar Sesión de Directora
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Teachers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeTeachersCount}</div>
          <div className="text-[11px] text-emerald-600 font-bold">En plantilla activa</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Alumnos Activos</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeStudentsCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">+{pendingStudentsCount} pendientes</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Salones Ocupados</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bookedSlotsCount}</div>
          <div className="text-[11px] text-purple-600 font-bold">Bloques con alumnos</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Niveles Curriculares</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">12</div>
          <div className="text-[11px] text-amber-700 font-bold">Super Goal & Mega Goal</div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div role="group" aria-label="Principal's Office sections" className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('payments')}
          aria-pressed={activeTab === 'payments'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all relative ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Payments & Enrollment</span>
          {students.filter(s => s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef)).length > 0 && (
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs animate-pulse">
              🔔 {students.filter(s => s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef)).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lounge')}
          aria-pressed={activeTab === 'lounge'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'lounge'
              ? 'bg-amber-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Coffee className="w-4 h-4 text-amber-500" />
          <span>☕ Teacher's Lounge & Bulletin Board</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          aria-pressed={activeTab === 'teachers'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'teachers'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>Faculty & Teachers ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          aria-pressed={activeTab === 'students'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Manage Students ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classrooms')}
          aria-pressed={activeTab === 'classrooms'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'classrooms'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Classrooms & Teacher Schedules</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          aria-pressed={activeTab === 'coupons'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'coupons'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Scholarships & Rewards ({couponsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          aria-pressed={activeTab === 'profile'}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-300" />
          <span>👑 Waky's Office</span>
        </button>
      </div>

      {/* 4. TAB CONTENT: TEACHERS MANAGEMENT */}
      {activeTab === 'teachers' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Faculty & Teacher Schedule Assignment
              </h2>
              <p className="text-xs text-slate-500">
                Como Directora, asigna los horarios de trabajo de cada Teacher, qué niveles imparten y cuántos alumnos tienen.
              </p>
            </div>

            <button
              onClick={() => setIsNewTeacherModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Contratar / Agregar Teacher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map(t => {
              const studentsAssignedToThisTeacher = students.filter(s => s.teacherId === t.id);
              return (
                <div key={t.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${t.name}`}
                        alt={t.name}
                        className="w-12 h-12 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            Teacher {t.name} {t.lastName || ''}
                          </h3>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.status === 'active' ? 'Activo' : 'De Permiso'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-700 font-semibold">{t.specialty}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTeacher(t)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Modificar horarios y niveles del teacher"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {t.id !== 'teacher_cokito' && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Dar de baja a Teacher ${t.name}?`)) {
                              onDeleteTeacher(t.id);
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Dar de baja teacher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Días Asignados:</span>
                      <span className="font-bold text-slate-800">{t.assignedDays.join(', ') || 'Sin definir'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Franja de Horario:</span>
                      <span className="font-bold text-slate-800">{t.workingHours || 'Flexible'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Niveles que Imparte:</span>
                      <span className="font-bold text-indigo-700">{t.levelsAssigned.join(', ').toUpperCase()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Alumnos Asignados:</span>
                      <span className="font-bold text-emerald-700">{studentsAssignedToThisTeacher.length} alumnos</span>
                    </div>
                  </div>

                  {/* Contact Info & Flock Credential Dispatch */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                      <span className="text-amber-500 text-sm">🪶</span>
                      <span className="truncate font-medium">{t.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenTeacherLetterModal(t)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title="Ver carta oficial y credenciales del teacher"
                      >
                        <FileText className="w-3 h-3 text-slate-600" />
                        <span>Ver carta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResendTeacherEmail(t)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title="Despachar carta oficial con credenciales de la Manada a su correo"
                      >
                        <Send className="w-3 h-3 text-amber-600" />
                        <span>{t.welcomeEmailSent ? 'Reenviar' : 'Enviar'}</span>
                      </button>

                      <button
                        onClick={() => setEditingTeacher(t)}
                        className="text-indigo-600 hover:underline font-bold text-xs"
                      >
                        Horarios →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: STUDENTS MANAGEMENT & MOVEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Movimiento de Alumnos & Control de Niveles
              </h2>
              <p className="text-xs text-slate-500">
                Mueve alumnos de nivel, cambia sus unidades, reasígnalos de teacher o dálos de baja.
              </p>
            </div>

            <button
              onClick={() => setIsNewStudentModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Matricular Nuevo Alumno</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Buscar por nombre o correo de alumno..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={studentLevelFilter}
                onChange={e => setStudentLevelFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">Todos los Niveles</option>
                {ENGLISH_LEVELS.map(lvl => (
                  <option key={lvl.id} value={lvl.id}>{lvl.levelName} ({lvl.book})</option>
                ))}
              </select>

              <select
                value={studentStatusFilter}
                onChange={e => setStudentStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">Todos los Estados</option>
                <option value="enrolled">Inscritos</option>
                <option value="pending_evaluation">Pendientes</option>
                <option value="paused">Pausados</option>
                <option value="completed">Graduados</option>
              </select>
            </div>
          </div>

          {/* Pending Class Requests Alert Banner (e.g., Génesis or any applicant) */}
          {classRequests.some(r => r.status === 'pending') && (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-sm text-lg">
                  🔔
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                      Solicitud de Clases Pendiente en Rectoría
                    </span>
                    <span className="text-xs text-amber-900 font-bold">
                      {classRequests.filter(r => r.status === 'pending').length} por agendar
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                    {classRequests.find(r => r.status === 'pending')?.studentName} necesita asignación de clases
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    "{classRequests.find(r => r.status === 'pending')?.notes || 'Solicitud de horarios y teacher para iniciar clases.'}" • Horario tentativo: <strong className="text-slate-800">{classRequests.find(r => r.status === 'pending')?.preferredDaysTimes}</strong>
                  </p>
                </div>
              </div>
              <div className="shrink-0 w-full sm:w-auto">
                {(() => {
                  const firstPending = classRequests.find(r => r.status === 'pending');
                  if (!firstPending) return null;
                  const targetStudent = students.find(s => s.id === firstPending.studentId) || {
                    id: firstPending.studentId,
                    name: firstPending.studentName,
                    email: firstPending.studentEmail,
                    age: 25,
                    isKid: false,
                    schoolOrProfession: 'Estudiante Institucional',
                    learningGoal: 'Superación laboral y fluidez conversacional',
                    avatar: '🦜',
                    plan: 'basic',
                    modality: 'online',
                    groupSize: 'individual',
                    preferredTimeSlot: 'Tardes',
                    status: 'enrolled',
                    levelId: 'level_1',
                    registeredAt: new Date().toISOString(),
                    currentUnit: 1,
                    completedHours: 0,
                    xp: 0,
                    streak: 0,
                    league: 'Bronce',
                    rating: { fluency: 0, grammar: 0, vocabulary: 0, pronunciation: 0 },
                    notes: '',
                    assignedSlots: []
                  } satisfies Student;
                  return (
                    <button
                      type="button"
                      onClick={() => handleOpenAssignClasses(targetStudent, firstPending.preferredDaysTimes, firstPending.preferredTeacher)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>📅 Asignar Horario & Notificar Ahora</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Nivel Actual</th>
                    <th className="py-3 px-4">Unidad</th>
                    <th className="py-3 px-4">Código de cupón</th>
                    <th className="py-3 px-4">Teacher & Horarios</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones de Directora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    const matchedLevel = ENGLISH_LEVELS.find(l => l.id === student.levelId);
                    const hasClasses = student.assignedSlots && student.assignedSlots.length > 0;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                              alt={student.name}
                              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{student.name} {student.lastName || ''}</div>
                              <div className="text-[11px] text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-indigo-700">
                          {matchedLevel ? `${matchedLevel.levelName} (${matchedLevel.book})` : student.levelId || 'Sin asignar'}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          Unidad {student.currentUnit || 1}
                        </td>
                        <td className="py-3 px-4 min-w-[190px]">
                          <div className="font-bold text-slate-800 mb-1">{student.couponCodeUsed || student.couponCodeAssigned || "Sin cupón registrado"}</div>
                          <select aria-label={"Asignar cupón a " + student.name} value={student.couponCodeAssigned || ""} onChange={e => { const selected = couponsList.find(c => c.code === e.target.value); onUpdateStudent({ ...student, couponCodeAssigned: selected?.code || undefined, notes: (student.notes || "") + (selected ? " | Cupón asignado por Directora Waky: " + selected.code : " | Asignación manual de cupón retirada") }); setCouponNotice(selected ? "Cupón " + selected.code + " registrado. Beneficios/pagos no se modifican automáticamente." : "Asignación retirada."); setTimeout(() => setCouponNotice(null), 4000); }} className="w-full max-w-[220px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700">
                            <option value="">Asignar cupón…</option>
                            {couponsList.filter(c => c.isActive).map(coupon => <option key={coupon.id} value={coupon.code}>{coupon.code} — {coupon.title}</option>)}
                          </select>
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                student.isExclusiveTeacher 
                                  ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}>
                                {student.isExclusiveTeacher ? '🔒 Mentor Exclusivo' : '🌟 La Manada (Rotativo)'}
                              </span>
                              <span className="font-semibold text-slate-900 text-xs">
                                {student.isExclusiveTeacher 
                                  ? (student.teacherName || 'Por asignar') 
                                  : 'Mentores del Nivel'}
                              </span>
                            </div>

                            {student.isDigitalPass ? (
                              <div className="text-[10px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-200 inline-flex items-center gap-1"><Smartphone className="w-3 h-3" /><span>Pase Digital · sin horario requerido</span></div>
                            ) : hasClasses ? (
                              <div className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-indigo-600" />
                                <span>{student.assignedSlots.join(' • ')}</span>
                              </div>
                            ) : (
                              <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300 inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                <span>⚠️ Sin horario agendado</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            student.status === 'enrolled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.status === 'pending_evaluation'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {student.status === 'enrolled' ? 'Inscrito' : student.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ver Carta Oficial y Credenciales */}
                            <button
                              onClick={() => handleOpenStudentLetterModal(student)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                              title="Ver carnet oficial y carta de bienvenida"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                            </button>

                            {/* Resend Welcome Email with Credentials */}
                            <button
                              onClick={() => handleResendStudentEmail(student)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition-colors"
                              title="Reenviar carta oficial con credenciales y acceso al Campus por correo"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-700" />
                            </button>

                            {/* Assign / Edit Classes Button */}
                            <button
                              onClick={() => handleOpenAssignClasses(student)}
                              className={`px-2.5 py-1.5 font-bold rounded-xl border transition-all flex items-center gap-1 text-xs ${
                                !hasClasses
                                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-xs'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                              }`}
                              title={hasClasses ? 'Modificar clases y notificar' : 'Asignar horario y notificar a la alumna'}
                            >
                              <Calendar className={`w-3.5 h-3.5 ${!hasClasses ? 'text-slate-950' : 'text-emerald-700'}`} />
                              <span>{!hasClasses ? 'Asignar Clases' : 'Clases'}</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditStudent(student)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold border border-blue-200 rounded-xl transition-colors flex items-center gap-1"
                              title="Editar perfil completo, credenciales y plan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => handleToggleStudentStatus(student)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                student.status === 'enrolled'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              }`}
                              title={student.status === 'enrolled' ? 'Pausar o suspender alumno temporalmente' : 'Reactivar alumno'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setMovingStudent(student);
                                setTargetLevelId(student.levelId || 'level_1');
                                setTargetUnit(student.currentUnit || 1);
                                setTargetTeacherId(student.teacherId || '');
                                setTargetStatus(student.status || 'enrolled');
                                setTargetSlotId(student.assignedSlots?.[0] || 'none');
                              }}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-xl transition-colors flex items-center gap-1"
                              title="Mover de nivel, unidad o teacher"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span>Mover</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Dar de baja y eliminar a ${student.name} del sistema?`)) {
                                  onDeleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Dar de baja definitiva y eliminar al alumno"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: CLASSROOMS & TEACHER SLOTS */}
      {activeTab === 'classrooms' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Classrooms & Teacher Schedule Assignment
            </h2>
            <p className="text-xs text-slate-500">
              Haz clic en cualquier bloque para asignar qué Teacher dictará la clase en ese horario.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.slice(0, 18).map(slot => (
              <div 
                key={slot.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800">{slot.day} • {slot.startTime} - {slot.endTime}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    slot.status === 'booked' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {slot.status === 'booked' ? 'Ocupado' : 'Disponible'}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">{slot.classroomTitle || 'Aula General'}</div>
                  <div className="text-amber-800 font-bold mt-1">
                    Teacher: {slot.teacherName || 'Sin asignar'}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSlotForTeacher(slot)}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Asignar / Cambiar Teacher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: GESTIÓN DE PAGOS Y MATRÍCULA (WAKY RECTORÍA) */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fadeIn">
          {approvalNotice && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{approvalNotice}</span>
            </div>
          )}

          {/* Top Row: Rate Management & Bank Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: BCV Exchange Rate Control */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-sm">🏛️</span>
                  <span>Tasa Oficial BCV</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-black border ${
                  bcvDetails.isManualOverride 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {bcvDetails.isManualOverride ? 'Ajuste Manual' : 'Oficial BCV • Auto'}
                </span>
              </div>

              {isEditingBcvRate ? (
                <form onSubmit={handleSaveBcvRate} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={bcvRateInput}
                      onChange={e => setBcvRateInput(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900"
                      required
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBcvRate(false)}
                      className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Fija temporalmente una tasa manual para casos especiales.</span>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900">
                        Bs. {currentBcvRate.toFixed(2)}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        por 1.00 USD (Fecha valor: {bcvDetails.effectiveDate})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleSyncBcv}
                        disabled={isSyncingBcv}
                        title="Sincronizar directamente con el Banco Central de Venezuela"
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingBcv ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBcvRateInput(currentBcvRate.toString());
                          setIsEditingBcvRate(true);
                        }}
                        className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        title="Ajustar manualmente"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Auto-update Schedule Notice */}
                  <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>🕛 Ajuste automático:</span>
                      <strong className="text-slate-900 font-semibold">12:00 AM (Medianoche VET)</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Próximo ciclo:</span>
                      <span className="font-mono text-indigo-600 font-bold">en ~{bcvDetails.hoursUntilMidnight}h</span>
                    </div>
                  </div>

                  {bcvDetails.isManualOverride && (
                    <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200 text-[11px] text-amber-900 space-y-1.5">
                      <p>
                        ⚠️ Hay un ajuste manual activo. Tasa oficial BCV: <strong>Bs. {bcvDetails.officialRate.toFixed(2)}</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={handleRestoreOfficialBcv}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-[10px] shadow-xs"
                      >
                        Restaurar tasa oficial del BCV
                      </button>
                    </div>
                  )}
                </div>
              )}

              {bcvRateSavedNotice && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg font-bold animate-fadeIn border border-emerald-200">
                  {bcvRateSavedNotice}
                </p>
              )}
            </div>

            {/* Box 2: Official Account Provincial */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1.5 text-xs md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cuenta Oficial de Recepción (Pago Móvil)
                </span>
                <span className="text-[11px] font-bold text-blue-700">Directora Waky</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-medium">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Banco:</span>
                  <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.bankName} ({OFFICIAL_PAGO_MOVIL.bankCode})</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Cédula:</span>
                  <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.cedula}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Teléfono:</span>
                  <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.phone}</strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Comunidad WhatsApp Welcome Lounge vinculada para preinscripciones.</span>
              </div>
            </div>

          </div>

          {/* Subfilter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setPaymentSubFilter('pending')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                paymentSubFilter === 'pending'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Por Validar ({students.filter(s => s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef)).length})</span>
            </button>

            <button
              onClick={() => setPaymentSubFilter('trials')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                paymentSubFilter === 'trials'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Pases de Cortesía 24h ({students.filter(s => s.paymentStatus === 'trial_24h').length})</span>
            </button>

            <button
              onClick={() => setPaymentSubFilter('deposits')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                paymentSubFilter === 'deposits'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Reservas $5 / Saldo Pendiente ({students.filter(s => s.paymentStatus === 'deposit_5_paid' || (s.balanceDueUsd && s.balanceDueUsd > 0)).length})</span>
            </button>

            <button
              onClick={() => setPaymentSubFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                paymentSubFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Todos los Alumnos</span>
            </button>
          </div>

          {/* Student Payment Cards / Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Bandeja de Conciliación Bancaria y Activación de Cupos
                </h3>
                <p className="text-xs text-slate-500">
                  Verifica el comprobante con tu aplicación de Banco Provincial y aprueba con un solo clic para abrir el acceso del alumno.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Plan & Modalidad</th>
                    <th className="py-3 px-4">Datos de Pago Móvil</th>
                    <th className="py-3 px-4">Estado Actual</th>
                    <th className="py-3 px-4 text-right">Decisión de Directora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => {
                      if (paymentSubFilter === 'pending') {
                        return s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef);
                      }
                      if (paymentSubFilter === 'trials') return s.paymentStatus === 'trial_24h';
                      if (paymentSubFilter === 'deposits') return s.paymentStatus === 'deposit_5_paid' || (s.balanceDueUsd && s.balanceDueUsd > 0);
                      return true;
                    })
                    .map(st => {
                      const isPending = st.paymentStatus === 'pending_approval' || (st.status === 'pending_evaluation' && st.pagoMovilRef);
                      const isTrial = st.paymentStatus === 'trial_24h';

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                              />
                              <div>
                                <strong className="text-slate-900 block font-semibold">{st.name} {st.lastName || ''}</strong>
                                <span className="text-xs text-slate-400 block">{st.email}</span>
                                <span className="text-[11px] text-slate-500">{st.phone || 'Sin WhatsApp'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-blue-900 block capitalize">{st.plan}</span>
                            <span className="text-xs text-slate-500 block capitalize">
                              {st.modality} • {st.groupSize === 'individual' ? '1 a 1' : 'Grupal'}
                            </span>
                            {st.preferredTimeSlot && (
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Preferencia: {st.preferredTimeSlot}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {st.pagoMovilRef ? (
                              <div className="space-y-0.5">
                                <span className="font-black text-slate-900 block text-xs">
                                  Ref: {st.pagoMovilRef}
                                </span>
                                <span className="text-[11px] text-slate-600 block">
                                  {st.pagoMovilBank || 'Banco emisor'} • {st.pagoMovilAmountBs ? `Bs. ${st.pagoMovilAmountBs}` : '$5 USD'}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {st.pagoMovilDate ? new Date(st.pagoMovilDate).toLocaleDateString() : 'Fecha reciente'}
                                </span>
                              </div>
                            ) : isTrial ? (
                              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                ⏱️ Pase de Cortesía 24h
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Sin reporte de referencia</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                              st.status === 'enrolled' && st.paymentStatus !== 'trial_24h'
                                ? 'bg-emerald-100 text-emerald-800'
                                : isTrial
                                ? 'bg-amber-100 text-amber-800'
                                : isPending
                                ? 'bg-blue-100 text-blue-900 animate-pulse'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {st.status === 'enrolled' && st.paymentStatus !== 'trial_24h'
                                ? '🟢 Matriculado / Activo'
                                : isTrial
                                ? '🎁 Modo Cortesía'
                                : isPending
                                ? '🔔 Por Conciliar'
                                : '🟡 Modo Guest'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* WhatsApp Contact */}
                              {st.phone && (
                                <a
                                  href={`https://wa.me/${st.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${st.name}! Te saluda la Directora Waky de Cokits Academy. Te escribo con respecto a tu inscripción y confirmación de horario en la academia.`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition-colors"
                                  title="Escribir por WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Approve Button */}
                              {st.status !== 'enrolled' || isTrial ? (
                                <button
                                  onClick={() => {
                                    setApprovingStudent(st);
                                    setApprovalSlotId(st.assignedSlots?.[0] || '');
                                    setApprovalTeacherId(st.teacherId || '');
                                  }}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aprobar Pago & Activar</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Al día
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for Approving Student with Slot & Teacher Assignment */}
          {approvingStudent && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      Aprobar Matrícula: {approvingStudent.name} {approvingStudent.lastName || ''}
                    </h3>
                    <p className="text-xs text-slate-400">Conciliación bancaria de Banco Provincial</p>
                  </div>
                  <button onClick={() => setApprovingStudent(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Referencia reportada:</span>
                    <strong className="text-slate-900">{approvingStudent.pagoMovilRef || 'Depósito manual'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Banco de origen:</span>
                    <strong className="text-slate-900">{approvingStudent.pagoMovilBank || 'No especificado'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monto transferido:</span>
                    <strong className="text-emerald-700 font-bold">{approvingStudent.pagoMovilAmountBs ? `Bs. ${approvingStudent.pagoMovilAmountBs}` : '$5 USD'}</strong>
                  </div>
                </div>

                {/* Teacher and Slot assignment */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teacher Asignado:</label>
                    <select
                      value={approvalTeacherId}
                      onChange={e => setApprovalTeacherId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="">Teacher Waky (General)</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>Teacher {t.name} {t.lastName || ''} ({t.specialty})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Salón / Horario Confirmado por Waky:</label>
                    <select
                      value={approvalSlotId}
                      onChange={e => setApprovalSlotId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="">A convenir / Asincrónico</option>
                      {slots.slice(0, 15).map(s => (
                        <option key={s.id} value={s.id}>{s.day} {s.startTime} - {s.classroomTitle || 'Aula Regular'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setApprovingStudent(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprovePayment(approvingStudent, approvalSlotId, approvalTeacherId)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmar Conciliación & Activar</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: TEACHER'S LOUNGE (LOUNGE DE TEACHERS Y STAFF HUB) */}
      {activeTab === 'lounge' && (
        <div className="space-y-6 animate-fadeIn">
          <TeachersLounge
            currentStaffRole="principal"
            staffName="Directora Waky"
            staffAvatar="👑"
            students={students}
            teachers={teachers}
            slots={slots}
          />
        </div>
      )}

      {/* 7. TAB CONTENT: GESTIÓN DE CUPONES, BECAS & PROMOS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & New Coupon Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                  🎟️ Güakytopia • Principal's Office
                </span>
                <span className="text-xs text-slate-500 font-bold">Validación en tiempo real</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Matriz de Cupones, Becas & Promociones
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl">
                Crea códigos confidenciales para becas totales o parciales, convenios institucionales (CSB) o promociones. Puedes activar y desactivar códigos con un clic sin recargar la plataforma.
              </p>
            </div>

            <button
              onClick={() => setIsNewCouponModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Cupón / Beca</span>
            </button>
          </div>

          {/* Quick Notice Banner */}
          {couponNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{couponNotice}</span>
            </div>
          )}

          {/* Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Cupones</span>
              <div className="text-2xl font-black text-slate-900">{couponsList.length}</div>
              <span className="text-[10px] text-slate-500 font-medium">En catálogo</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Activos (En Línea)</span>
              <div className="text-2xl font-black text-emerald-600">
                {couponsList.filter(c => c.isActive).length}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Listos para canjear</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-rose-600 uppercase">Inactivos / Pausados</span>
              <div className="text-2xl font-black text-rose-600">
                {couponsList.filter(c => !c.isActive).length}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Bloqueados temporalmente</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase">Canjes Realizados</span>
              <div className="text-2xl font-black text-amber-700">
                {couponsList.reduce((acc, c) => acc + (c.currentUses || 0), 0)}
              </div>
              <span className="text-[10px] text-amber-800 font-medium">Alumnos beneficiados</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={couponSearch}
                onChange={e => setCouponSearch(e.target.value)}
                placeholder="Buscar por código, título o descripción..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={couponCategoryFilter}
                onChange={e => setCouponCategoryFilter(e.target.value as any)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">Todas las Categorías</option>
                <option value="scholarship">Becas Institucionales</option>
                <option value="csb">Convenio Simón Bolívar (CSB)</option>
                <option value="launch">Lanzamiento</option>
                <option value="ambassador">Embajadores</option>
                <option value="tester">Beta Testers</option>
              </select>

              <select
                value={couponStatusFilter}
                onChange={e => setCouponStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">Todos los Estados</option>
                <option value="active">Solo Activos 🟢</option>
                <option value="inactive">Solo Inactivos 🔴</option>
              </select>
            </div>
          </div>

          {/* Coupons Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Código Secreto</th>
                    <th className="py-3 px-4">Título & Categoría</th>
                    <th className="py-3 px-4">Beneficio</th>
                    <th className="py-3 px-4">Usos / Límite</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción de Rectora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {couponsList
                    .filter(c => {
                      const matchesSearch = !couponSearch || 
                        c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
                        c.title.toLowerCase().includes(couponSearch.toLowerCase()) ||
                        (c.description && c.description.toLowerCase().includes(couponSearch.toLowerCase()));
                      const matchesCategory = couponCategoryFilter === 'all' || c.category === couponCategoryFilter;
                      const matchesStatus = couponStatusFilter === 'all' || 
                        (couponStatusFilter === 'active' && c.isActive) ||
                        (couponStatusFilter === 'inactive' && !c.isActive);
                      return matchesSearch && matchesCategory && matchesStatus;
                    })
                    .map(c => {
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-slate-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                                {c.code}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Creado: {c.createdAt || '2026-10'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{c.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{c.description}</div>
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-200 mt-1 inline-block">
                              {c.categoryLabel || c.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                              c.benefitType === 'scholar_100' || c.benefitType === 'free_webapp_3m'
                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                : c.benefitType === 'scholar_50'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : c.benefitType === 'webapp_5usd_3m'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}>
                              {c.benefitType === 'scholar_100' ? 'Beca Total 100%' :
                               c.benefitType === 'free_webapp_3m' ? '100% Free 3 Meses' :
                               c.benefitType === 'scholar_50' ? '50% Descuento' :
                               c.benefitType === 'scholar_20' ? '20% Descuento' :
                               c.benefitType === 'webapp_5usd_3m' ? 'Web App $5/mes' :
                               c.benefitType === 'friend_pass' ? 'Pase VIP Amigo' :
                               c.benefitType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            <span>{c.currentUses}</span>
                            <span className="text-slate-400"> / </span>
                            <span className="text-slate-500">
                              {c.maxUses === null ? '∞ Ilimitado' : c.maxUses}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${
                              c.isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                              {c.isActive ? 'Activo' : 'Pausado'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle Active / Inactive */}
                              <button
                                onClick={() => handleToggleCouponActive(c.id)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                                  c.isActive
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                                title={c.isActive ? 'Desactivar cupón temporalmente' : 'Activar cupón de inmediato'}
                              >
                                <Power className="w-3.5 h-3.5" />
                                <span>{c.isActive ? 'Desactivar' : 'Activar'}</span>
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteCoupon(c.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar cupón definitivamente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: DESPACHO & PERFIL DE LA DIRECTORA WAKY */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Presidential Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-6 sm:p-10 text-slate-950 shadow-2xl border-2 border-amber-300">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              {/* Avatar Waky */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-950 p-2 shadow-2xl border-4 border-amber-200 flex items-center justify-center text-6xl sm:text-7xl overflow-hidden">
                  🦜
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-950 text-amber-300 p-2 rounded-2xl border-2 border-amber-400 shadow-md">
                  <Crown className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Info */}
              <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    The Principal • Directora General
                  </span>
                  <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                    Güakytopia • Coquitos Academy
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
                  Waky - The Principal
                </h2>

                <p className="text-sm sm:text-base font-bold text-slate-900/90 leading-relaxed max-w-2xl">
                  Rectora y Fundadora Académica. Supervisora del Pensum Oficial Bilingüe SuperGoal / MegaGoal y de la Matriz Tropical de Aprendizaje Acelerado.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-black text-slate-950">
                  <span className="flex items-center gap-1.5 bg-amber-400/80 px-3 py-1.5 rounded-xl border border-amber-300">
                    🎓 Ph.D. in Tropical Pedagogy & Bilingual Systems
                  </span>
                  <span className="flex items-center gap-1.5 bg-amber-400/80 px-3 py-1.5 rounded-xl border border-amber-300">
                    🇬🇧 British & American CEFR Standard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Creed & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                📜
              </div>
              <h3 className="font-black text-slate-900 text-base">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transformar el aprendizaje del inglés en Venezuela y Latinoamérica eliminando el miedo a hablar, mediante inmersión lúdica y acompañamiento humano de alta categoría.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                🏆
              </div>
              <h3 className="font-black text-slate-900 text-base">Lema Institucional</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                &ldquo;Donde cada estudiante descubre el poder de comunicarse con fluidez, confianza y excelencia global.&rdquo;
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl block w-fit">
                ✨ Excelencia &amp; Liderazgo Académico
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                🏛️
              </div>
              <h3 className="font-black text-slate-900 text-base">Políticas Escolares</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Admisiones:</span>
                  <span className="font-bold text-emerald-600">🟢 Abiertas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tasa Oficial BCV:</span>
                  <span className="font-bold text-slate-900">Bs. {currentBcvRate} / $</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Modalidad:</span>
                  <span className="font-bold text-slate-900">100% Online + En Vivo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel from the Principal */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-amber-400/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Panel de Despacho Inmediato
                </span>
                <h3 className="text-xl font-black text-white">
                  Controles de Alta Dirección de Güakytopia
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Ver Alumnos ({students.length})
                </button>
                <button
                  onClick={() => setActiveTab('coupons')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors"
                >
                  Ver Cupones ({couponsList.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-amber-300 font-bold block mb-1">👑 Autoridad Académica</span>
                <p className="text-slate-300 text-[11px]">
                  Todos los cambios realizados en pensum, asignación de teachers o cupones tienen validez inmediata en toda la plataforma.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-amber-300 font-bold block mb-1">🔒 Privacidad y Resguardo</span>
                <p className="text-slate-300 text-[11px]">
                  Los códigos y accesos confidenciales de becas permanecen cifrados y solo visibles dentro de este despacho.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-amber-300 font-bold block mb-1">🌴 Sello Institucional</span>
                <p className="text-slate-300 text-[11px]">
                  Firma digital registrada bajo la jurisdicción de Güakytopia & Coquitos Academy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MOVER ALUMNO (NIVEL, UNIDAD, TEACHER, ESTADO) */}
      {movingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Mover Alumno: {movingStudent.name} {movingStudent.lastName || ''}
                  </h3>
                  <p className="text-xs text-slate-400">{movingStudent.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setMovingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Target Level */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  1. Nivel Académico (Reubicación de Pensum):
                </label>
                <select
                  value={targetLevelId}
                  onChange={e => setTargetLevelId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.levelName} - {l.book} ({l.cefrEquiv})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Unit */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  2. Unidad Activa (1 a 8):
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={targetUnit}
                  onChange={e => setTargetUnit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>

              {/* Target Teacher */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  3. Asignar Teacher Responsable:
                </label>
                <select
                  value={targetTeacherId}
                  onChange={e => setTargetTeacherId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="">Teacher Waky (General)</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      Teacher {t.name} {t.lastName || ''} ({t.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Status */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  4. Estado del Alumno:
                </label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="enrolled">Inscrito / Activo</option>
                  <option value="pending_evaluation">Pendiente de Diagnóstico</option>
                  <option value="paused">Pausado / Permiso</option>
                  <option value="completed">Graduado</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setMovingStudent(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyStudentMove}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors"
              >
                Aplicar Cambio en Rectoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR TEACHER (HORARIOS, DÍAS, NIVELES - DINÁMICO) */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveTeacherEdit(e);
              setApprovalNotice(`¡Horarios y disponibilidad de Teacher ${editingTeacher.name} guardados con éxito!`);
              setTimeout(() => setApprovalNotice(null), 3000);
            }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-auto animate-scaleUp max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={editingTeacher.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${editingTeacher.name}`}
                  alt={editingTeacher.name}
                  className="w-11 h-11 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                />
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Gestión de Horarios: Teacher {editingTeacher.name} {editingTeacher.lastName || ''}
                  </h3>
                  <span className="text-xs text-amber-700 font-bold">{editingTeacher.specialty}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
              {/* Especialidad */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Especialidad del Teacher:</label>
                <input
                  type="text"
                  value={editingTeacher.specialty}
                  onChange={e => setEditingTeacher({ ...editingTeacher, specialty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              {/* DÍAS ASIGNADOS (SELECTOR INTERACTIVO) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Días de Disponibilidad Laboral:</span>
                  </label>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {editingTeacher.assignedDays.length} días activos
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const).map(day => {
                    const isSelected = editingTeacher.assignedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const nextDays = isSelected
                            ? editingTeacher.assignedDays.filter(d => d !== day)
                            : [...editingTeacher.assignedDays, day];
                          setEditingTeacher({ ...editingTeacher, assignedDays: nextDays });
                        }}
                        className={`py-1.5 px-3 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-slate-950 text-amber-300 ring-2 ring-amber-400 shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                        <span>{day === 'Sábado' ? '⭐ Sábado' : day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FRANJA DE HORAS LABORALES (PRESETS + INPUT) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Franja de Horas Laborales:</span>
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Mañanas (08:00 - 13:00)', val: '08:00 - 13:00' },
                    { label: 'Tardes (14:00 - 19:00)', val: '14:00 - 19:00' },
                    { label: 'Tardes/Noches (15:00 - 21:00)', val: '15:00 - 21:00' },
                    { label: 'Sábados (09:00 - 14:00)', val: '09:00 - 14:00' },
                    { label: 'Jornada Completa (08:00 - 18:00)', val: '08:00 - 18:00' }
                  ].map(shift => (
                    <button
                      key={shift.val}
                      type="button"
                      onClick={() => setEditingTeacher({ ...editingTeacher, workingHours: shift.val })}
                      className={`text-[11px] py-1 px-2.5 rounded-lg border font-bold transition-all ${
                        editingTeacher.workingHours === shift.val
                          ? 'bg-amber-400 text-slate-950 border-amber-500 ring-1 ring-amber-400'
                          : 'bg-white text-slate-700 hover:bg-amber-50 border-slate-200'
                      }`}
                    >
                      {shift.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={editingTeacher.workingHours}
                  onChange={e => setEditingTeacher({ ...editingTeacher, workingHours: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900"
                  placeholder="Ej. 08:00 - 14:00 o Sábados 09:00 - 14:00"
                  required
                />
              </div>

              {/* NIVELES QUE IMPARTE (BADGES INTERACTIVOS) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] block">
                  Niveles del Pensum Habilitados:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'level_1', name: 'SuperGoal 1 (A1)' },
                    { id: 'level_2', name: 'SuperGoal 2 (A2)' },
                    { id: 'level_3', name: 'SuperGoal 3 (B1)' },
                    { id: 'level_4', name: 'MegaGoal 1 (B2)' },
                    { id: 'level_5', name: 'MegaGoal 2 (C1)' },
                    { id: 'conversacion', name: 'Conversación Adultos' },
                    { id: 'kids', name: 'Kids & Teens' }
                  ].map(lvl => {
                    const isAssigned = editingTeacher.levelsAssigned.includes(lvl.id);
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => {
                          const nextLevels = isAssigned
                            ? editingTeacher.levelsAssigned.filter(l => l !== lvl.id)
                            : [...editingTeacher.levelsAssigned, lvl.id];
                          setEditingTeacher({ ...editingTeacher, levelsAssigned: nextLevels });
                        }}
                        className={`text-[11px] py-1 px-2.5 rounded-lg border font-bold transition-all ${
                          isAssigned
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {isAssigned && '✓ '}
                        {lvl.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ESTADO DEL TEACHER & HONORARIOS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado en Plantilla:</label>
                  <select
                    value={editingTeacher.status}
                    onChange={e => setEditingTeacher({ ...editingTeacher, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="active">Activo en Clases 🟢</option>
                    <option value="leave">De Permiso / Vacaciones 🟡</option>
                    <option value="inactive">Inactivo 🔴</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarifa Honorarios (USD/h):</label>
                  <input
                    type="number"
                    value={editingTeacher.hourlyRate || 10}
                    onChange={e => setEditingTeacher({ ...editingTeacher, hourlyRate: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-black rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Guardar Horarios del Teacher</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CONTRATAR / AGREGAR NUEVO TEACHER A LA MANADA (THE FLOCK) */}
      {isNewTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form 
            onSubmit={handleCreateTeacher}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 my-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪶</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Contratar Mentor • Güakytopia's Flock
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Suma un nuevo teacher a la manada y expide sus credenciales
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewTeacherModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    value={newTeacherData.name}
                    onChange={e => setNewTeacherData({ ...newTeacherData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Elena"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido:</label>
                  <input
                    type="text"
                    value={newTeacherData.lastName}
                    onChange={e => setNewTeacherData({ ...newTeacherData, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Rondón"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={newTeacherData.email}
                    onChange={e => setNewTeacherData({ ...newTeacherData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="profe@guakytopia.com"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp:</label>
                  <input
                    type="text"
                    value={newTeacherData.phone}
                    onChange={e => setNewTeacherData({ ...newTeacherData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="+58 414 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Especialidad Pedagógica:</label>
                <input
                  type="text"
                  value={newTeacherData.specialty}
                  onChange={e => setNewTeacherData({ ...newTeacherData, specialty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="Super Goal 1–3, Fonética y Confianza Oral"
                />
              </div>

              {/* Niveles Certificados en Matriz */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Niveles que Certifica en la Matriz Cokitö:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {ENGLISH_LEVELS.slice(0, 8).map(lvl => {
                    const isChecked = (newTeacherData.levelsAssigned || []).includes(lvl.id);
                    return (
                      <label key={lvl.id} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            const cur = newTeacherData.levelsAssigned || [];
                            const next = e.target.checked 
                              ? [...cur, lvl.id]
                              : cur.filter(id => id !== lvl.id);
                            setNewTeacherData({ ...newTeacherData, levelsAssigned: next });
                          }}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="truncate">{lvl.levelName}</span>
                      </label>
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Los alumnos de estos niveles podrán ser atendidos por este mentor.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Franja de Horario:</label>
                  <input
                    type="text"
                    value={newTeacherData.workingHours}
                    onChange={e => setNewTeacherData({ ...newTeacherData, workingHours: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="08:00 - 14:00 (Mañanas)"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarifa Horaria ($/h):</label>
                  <input
                    type="number"
                    value={newTeacherData.hourlyRate}
                    onChange={e => setNewTeacherData({ ...newTeacherData, hourlyRate: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* Enviar Correo de Bienvenida a la Manada */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                <input
                  id="send-teacher-welcome-checkbox"
                  type="checkbox"
                  checked={sendTeacherWelcomeEmailFlag}
                  onChange={e => setSendTeacherWelcomeEmailFlag(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="send-teacher-welcome-checkbox" className="text-[11px] text-amber-950 font-medium cursor-pointer">
                  <strong className="block text-amber-900 font-bold">Enviar carta oficial "Welcome to Güakytopia's Flock!" por correo</strong>
                  Genera una contraseña provisional y despacha las credenciales, enlace al portal y bienvenida oficial al buzón del teacher.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewTeacherModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>🪶 Contratar e Integrar a la Manada</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: MATRICULAR ALUMNO EN GÜAKYTOPIA CAMPUS */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form 
            onSubmit={handleCreateStudent}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 my-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Matricular Alumno • Güakytopia Campus
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Expide carnet digital, asigna nivel y vincula mentoría
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    value={newStudentData.name}
                    onChange={e => setNewStudentData({ ...newStudentData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Carlos"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido:</label>
                  <input
                    type="text"
                    value={newStudentData.lastName}
                    onChange={e => setNewStudentData({ ...newStudentData, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Gómez"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={newStudentData.email}
                    onChange={e => setNewStudentData({ ...newStudentData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="alumno@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp:</label>
                  <input
                    type="text"
                    value={newStudentData.phone}
                    onChange={e => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="+58 412 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nivel Curricular de Inicio:</label>
                <select
                  value={newStudentData.levelId}
                  onChange={e => setNewStudentData({ ...newStudentData, levelId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>{l.levelName} - {l.book}</option>
                  ))}
                </select>
              </div>

              {/* Modelo de Mentoría (La Manada vs Exclusivo) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Dinámica de Mentoría en el Campus:
                </span>
                
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="mentorshipMode"
                      checked={newStudentMentorshipMode === 'rotational'}
                      onChange={() => setNewStudentMentorshipMode('rotational')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <strong className="block text-slate-900 font-bold">🌟 La Manada (The Flock • Modo Rotativo)</strong>
                      <span className="text-[11px] text-slate-500 block leading-tight">
                        El alumno puede agendar con cualquier mentor certificado en su nivel ({getFlockMentorsLabel(teachers, newStudentData.levelId || 'level_1')}), manteniendo su bitácora unificada.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="mentorshipMode"
                      checked={newStudentMentorshipMode === 'exclusive'}
                      onChange={() => setNewStudentMentorshipMode('exclusive')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <strong className="block text-slate-900 font-bold">🔒 Mentor Exclusivo Dedicado</strong>
                      <span className="text-[11px] text-slate-500 block leading-tight mb-2">
                        El alumno únicamente tomará clases con un teacher específico de la manada.
                      </span>
                      {newStudentMentorshipMode === 'exclusive' && (
                        <select
                          value={newStudentExclusiveTeacherId}
                          onChange={e => setNewStudentExclusiveTeacherId(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-purple-300 rounded-xl font-bold text-purple-900"
                        >
                          <option value="">Selecciona el Mentor Exclusivo...</option>
                          {getFlockTeachersForLevel(teachers, newStudentData.levelId || 'level_1').map(t => (
                            <option key={t.id} value={t.id}>Teacher {t.name} ({t.specialty})</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkbox de Envío de Correo */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
                <input
                  id="send-student-welcome-checkbox"
                  type="checkbox"
                  checked={sendStudentWelcomeEmailFlag}
                  onChange={e => setSendStudentWelcomeEmailFlag(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="send-student-welcome-checkbox" className="text-[11px] text-emerald-950 font-medium cursor-pointer">
                  <strong className="block text-emerald-900 font-bold">Enviar carta oficial "Welcome to Güakytopia Campus!" por correo</strong>
                  Despacha el carnet digital, contraseña provisional, enlace de acceso y detalles de su nivel al correo del alumno.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewStudentModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Matricular y Expedir Carnet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ASIGNAR TEACHER A UN SLOT DE HORARIO */}
      {selectedSlotForTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Asignar Teacher a {selectedSlotForTeacher.day} {selectedSlotForTeacher.startTime}
              </h3>
              <button 
                onClick={() => setSelectedSlotForTeacher(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Selecciona el Teacher que dictará la clase en este horario:
            </p>

            <div className="space-y-2">
              {teachers.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleAssignTeacherToSlot(t.id)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-left transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Teacher {t.name} {t.lastName || ''}</div>
                      <div className="text-[11px] text-slate-500">{t.specialty}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVO CUPÓN / BECA / PROMO (RECTORÍA WAKY) */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCouponSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Crear Cupón, Beca o Promoción
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Directora Waky • Emisión de Pases Oficiales
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCouponModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Código y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Código Secreto (Sin espacios):
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponData.code}
                    onChange={e => setNewCouponData({ ...newCouponData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    placeholder="Ej. BECA-OCT26 o VIP-AMIGO"
                    className="w-full p-2.5 bg-amber-50/60 border border-amber-300 rounded-xl font-mono font-bold text-slate-900 uppercase focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Categoría Institucional:
                  </label>
                  <select
                    value={newCouponData.category}
                    onChange={e => setNewCouponData({ ...newCouponData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="scholarship">Beca Institucional 🎓</option>
                    <option value="csb">Colegio Simón Bolívar (CSB) 🏫</option>
                    <option value="launch">Lanzamiento Oficial 🚀</option>
                    <option value="ambassador">Embajador VIP 🌟</option>
                    <option value="tester">Beta Tester 🧪</option>
                  </select>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Título Descriptivo del Cupón:
                </label>
                <input
                  type="text"
                  required
                  value={newCouponData.title}
                  onChange={e => setNewCouponData({ ...newCouponData, title: e.target.value })}
                  placeholder="Ej. Beca de Mérito Académico 100% Free"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>

              {/* Tipo de Beneficio & Límite de Usos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Beneficio Asignado:
                  </label>
                  <select
                    value={newCouponData.benefitType}
                    onChange={e => setNewCouponData({ ...newCouponData, benefitType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="scholar_100">Beca Total 100% (Clases + Web App)</option>
                    <option value="free_webapp_3m">100% Free Web App 3 Meses</option>
                    <option value="scholar_50">50% de Descuento</option>
                    <option value="scholar_20">20% de Descuento</option>
                    <option value="webapp_5usd_3m">Pase Web App $5.00/mes</option>
                    <option value="friend_pass">Pase VIP de Amigo / Cortesía</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Límite de Canjes:
                  </label>
                  <input
                    type="text"
                    value={newCouponData.maxUses}
                    onChange={e => setNewCouponData({ ...newCouponData, maxUses: e.target.value })}
                    placeholder="1 (uso único) o 'unlimited'"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Descripción o Condiciones para el Alumno:
                </label>
                <textarea
                  rows={2}
                  value={newCouponData.description}
                  onChange={e => setNewCouponData({ ...newCouponData, description: e.target.value })}
                  placeholder="Ej. Acceso completo y becado por rendimiento académico en Güakytopia."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              {/* Notas de Rectoría */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notas Internas de Rectoría:
                </label>
                <input
                  type="text"
                  value={newCouponData.notes}
                  onChange={e => setNewCouponData({ ...newCouponData, notes: e.target.value })}
                  placeholder="Ej. Autorizado por Directora Waky para convenio especial."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewCouponModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Emitir y Activar Cupón</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDITAR PERFIL COMPLETO DE ALUMNO (RECTORÍA WAKY) */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveStudentEdit}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={editingStudent.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${editingStudent.name}`}
                  alt={editingStudent.name}
                  className="w-10 h-10 rounded-2xl border border-slate-200 object-cover"
                />
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Editar Perfil: {editingStudent.name} {editingStudent.lastName || ''}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Modificación directa autorizada por Directora Waky
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.name || ''}
                    onChange={e => setEditStudentForm({ ...editStudentForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido:</label>
                  <input
                    type="text"
                    value={editStudentForm.lastName || ''}
                    onChange={e => setEditStudentForm({ ...editStudentForm, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Usuario y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usuario (@username):</label>
                  <input
                    type="text"
                    value={editStudentForm.username || ''}
                    onChange={e => setEditStudentForm({ ...editStudentForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    value={editStudentForm.email || ''}
                    onChange={e => setEditStudentForm({ ...editStudentForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Contraseña (para resetear si el alumno la olvidó) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Contraseña de Acceso (Resetear si el alumno la olvidó):
                </label>
                <input
                  type="text"
                  value={editStudentForm.password || ''}
                  onChange={e => setEditStudentForm({ ...editStudentForm, password: e.target.value })}
                  placeholder="Define una nueva contraseña"
                  className="w-full p-2.5 bg-amber-50/50 border border-amber-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              {/* Plan y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan de Estudio:</label>
                  <select
                    value={editStudentForm.plan || 'basic'}
                    onChange={e => setEditStudentForm({ ...editStudentForm, plan: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="basic">Básico (2 h/sem)</option>
                    <option value="regular">Regular (3 h/sem)</option>
                    <option value="intensive">Intensivo (4 h/sem)</option>
                    <option value="express">Express (6 h/sem)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado de Matrícula:</label>
                  <select
                    value={editStudentForm.status || 'enrolled'}
                    onChange={e => setEditStudentForm({ ...editStudentForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="enrolled">Inscrito / Activo 🟢</option>
                    <option value="paused">Pausado / Permiso 🟡</option>
                    <option value="pending_evaluation">Pendiente de Diagnóstico ⏱️</option>
                    <option value="completed">Graduado Oficial 🎓</option>
                  </select>
                </div>
              </div>

              {/* Nivel y Unidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nivel Curricular:</label>
                  <select
                    value={editStudentForm.levelId || 'level_1'}
                    onChange={e => setEditStudentForm({ ...editStudentForm, levelId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  >
                    {ENGLISH_LEVELS.map(l => (
                      <option key={l.id} value={l.id}>{l.levelName} ({l.book})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unidad Activa (1 a 8):</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editStudentForm.currentUnit || 1}
                    onChange={e => setEditStudentForm({ ...editStudentForm, currentUnit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Notas de Rectoría */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas Oficiales de Rectoría:</label>
                <textarea
                  rows={2}
                  value={editStudentForm.notes || ''}
                  onChange={e => setEditStudentForm({ ...editStudentForm, notes: e.target.value })}
                  placeholder="Comentarios sobre el rendimiento o beca del estudiante..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Cambios de Perfil</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASIGNAR CLASES & NOTIFICAR ALUMNO (DIRECTORA WAKY - CALENDARIO DINÁMICO) */}
      {/* ========================================================================= */}
      {assigningClassesStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <form
            onSubmit={handleConfirmClassAssignment}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-auto animate-scaleUp max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md text-xl">
                  📅
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                      Rectoría Güakytopia • Asignación Dinámica
                    </span>
                    <span className="text-xs text-slate-300 font-bold">
                      {assigningClassesStudent.phone || 'Contacto Telefónico'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                    Planificador de Clases: {assigningClassesStudent.name} {assigningClassesStudent.lastName || ''}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssigningClassesStudent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1">
              
              {/* Directora Authority Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent p-3.5 rounded-2xl border border-amber-300/80 flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-amber-950">
                  <span className="font-black text-xs block">Control Total de Rectoría: Horario Acordado</span>
                  <p className="leading-relaxed text-[11px] text-amber-900">
                    Define con total libertad los días y horas que acordaste por llamada con <strong>{assigningClassesStudent.name}</strong>. Al confirmar, sus clases quedarán programadas y recibirá de inmediato su notificación con acceso al aula.
                  </p>
                </div>
              </div>

              {/* 1. SELECCIÓN RÁPIDA DE PLANTILLAS DE HORARIO */}
              <div>
                <label className="font-black text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                  ⚡ Plantillas Rápidas de Horario:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSlot({
                      days: ['Sábado'],
                      start: '10:00 AM',
                      end: '12:00 PM',
                      frequency: 'Todos los Sábados',
                      label: 'Sábados de 10:00 am a 12:00 pm (Todos los Sábados)'
                    })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      assignDays.includes('Sábado') && assignStartTime === '10:00 AM' && assignEndTime === '12:00 PM'
                        ? 'bg-amber-400/20 border-amber-500 ring-2 ring-amber-400/60 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">⭐ Todos los Sábados (10am - 12m)</span>
                      <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">2 Horas</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Ideal para alumnos de fin de semana (Génesis, intensivo laboral).</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetSlot({
                      days: ['Sábado'],
                      start: '09:00 AM',
                      end: '11:00 AM',
                      frequency: 'Todos los Sábados',
                      label: 'Sábados de 09:00 am a 11:00 am (Todos los Sábados)'
                    })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      assignDays.includes('Sábado') && assignStartTime === '09:00 AM' && assignEndTime === '11:00 AM'
                        ? 'bg-amber-400/20 border-amber-500 ring-2 ring-amber-400/60 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">Sábados Mañana (9am - 11am)</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">2 Horas</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Franja matutina de fin de semana.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetSlot({
                      days: ['Lunes', 'Miércoles'],
                      start: '05:00 PM',
                      end: '06:00 PM',
                      frequency: '2 veces por semana',
                      label: 'Lunes y Miércoles 05:00 pm - 06:00 pm (2 veces por semana)'
                    })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      assignDays.includes('Lunes') && assignDays.includes('Miércoles') && assignStartTime === '05:00 PM'
                        ? 'bg-amber-400/20 border-amber-500 ring-2 ring-amber-400/60 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">Lunes y Miércoles (5pm - 6pm)</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">2 h/sem</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Frecuencia entre semana vespertina.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetSlot({
                      days: ['Martes', 'Jueves'],
                      start: '04:00 PM',
                      end: '05:00 PM',
                      frequency: '2 veces por semana',
                      label: 'Martes y Jueves 04:00 pm - 05:00 pm (2 veces por semana)'
                    })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      assignDays.includes('Martes') && assignDays.includes('Jueves')
                        ? 'bg-amber-400/20 border-amber-500 ring-2 ring-amber-400/60 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">Martes y Jueves (4pm - 5pm)</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">2 h/sem</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Frecuencia dúo entre semana.</span>
                  </button>
                </div>
              </div>

              {/* 2. SELECTOR DINÁMICO DE DÍAS (PILLS CLICKEABLES) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Paso 1: Días de Clase (Haz clic para activar/desactivar)</span>
                  </label>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {assignDays.join(', ') || 'Ninguno'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => {
                    const isSelected = assignDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleAssignDay(day)}
                        className={`py-2 px-3.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-950 text-amber-300 shadow-md ring-2 ring-amber-400'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{day === 'Sábado' ? '⭐ Sábado' : day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. SELECTOR DINÁMICO DE HORAS Y DURACIÓN */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Paso 2: Rango Horario de la Clase</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Hora de Inicio:</span>
                    <select
                      value={assignStartTime}
                      onChange={e => {
                        setAssignStartTime(e.target.value);
                        const dayLabel = assignDays.length === 1 ? `Todos los ${assignDays[0]}s` : assignDays.join(' y ');
                        setCustomScheduleText(`${dayLabel} de ${e.target.value} a ${assignEndTime} (${assignFrequency})`);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900"
                    >
                      {[
                        '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
                        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
                        '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
                      ].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Hora de Fin:</span>
                    <select
                      value={assignEndTime}
                      onChange={e => {
                        setAssignEndTime(e.target.value);
                        const dayLabel = assignDays.length === 1 ? `Todos los ${assignDays[0]}s` : assignDays.join(' y ');
                        setCustomScheduleText(`${dayLabel} de ${assignStartTime} a ${e.target.value} (${assignFrequency})`);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900"
                    >
                      {[
                        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
                        '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
                      ].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">Frecuencia / Tipo:</span>
                    <select
                      value={assignFrequency}
                      onChange={e => {
                        setAssignFrequency(e.target.value);
                        const dayLabel = assignDays.length === 1 ? `Todos los ${assignDays[0]}s` : assignDays.join(' y ');
                        setCustomScheduleText(`${dayLabel} de ${assignStartTime} a ${assignEndTime} (${e.target.value})`);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="Todos los Sábados">Todos los Sábados (Fijo)</option>
                      <option value="Semanal Recurrente">Semanal Recurrente</option>
                      <option value="2 veces por semana">2 veces por semana</option>
                      <option value="Intensivo Fin de Semana">Intensivo Fin de Semana</option>
                      <option value="Sesión Quincenal">Sesión Quincenal</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bloque: {assignDays.join(' / ')} {assignStartTime} a {assignEndTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCurrentBlockToList}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Agregar este bloque</span>
                  </button>
                </div>
              </div>

              {/* 4. LISTA DE BLOQUES ASIGNADOS AL ALUMNO */}
              <div>
                <label className="font-black text-slate-900 uppercase tracking-wider text-[11px] block mb-1.5">
                  📅 Bloques de Clase que Tendrá {assigningClassesStudent.name}:
                </label>
                <div className="space-y-1.5">
                  {assignSlotsList.map((slot, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <strong className="text-indigo-950 font-black">{slot}</strong>
                      </div>
                      {assignSlotsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlotFromList(slot)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Eliminar este bloque"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. TEACHER, NIVEL & UNIDAD ACORDADA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Teacher */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Teacher Asignado:
                  </label>
                  <select
                    value={assignTeacherId}
                    onChange={e => setAssignTeacherId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialty || 'Teacher'})
                      </option>
                    ))}
                    {teachers.length === 0 && (
                      <option value="teacher_cokito">Teacher Cokitö (Head Teacher)</option>
                    )}
                  </select>
                </div>

                {/* Nivel Oficial */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Nivel de Pensum:
                  </label>
                  <select
                    value={assignLevelId}
                    onChange={e => setAssignLevelId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-900"
                  >
                    {ENGLISH_LEVELS.map(lvl => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.levelName} ({lvl.book})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unidad de Inicio */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Unidad de Arranque:
                  </label>
                  <select
                    value={assignUnit}
                    onChange={e => setAssignUnit(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(u => (
                      <option key={u} value={u}>Unidad {u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. AULA VIRTUAL (GOOGLE MEET) */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Enlace del Aula Virtual (Google Meet):
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={assignMeetLink}
                    onChange={e => setAssignMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/cok-waky-cls"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 text-[11px]"
                  />
                  <Video className="w-4 h-4 text-indigo-500 absolute right-3 top-3" />
                </div>
              </div>

              {/* 7. ACUERDO TELEFÓNICO / NOTAS DE RECTORÍA */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Acuerdo Telefónico / Notas Oficiales de Rectoría:
                </label>
                <textarea
                  rows={2}
                  value={assignPhoneNotes}
                  onChange={e => setAssignPhoneNotes(e.target.value)}
                  placeholder="Ej. Acordado por llamada con Génesis: clases de 2 horas todos los sábados de 10:00 am a 12:00 pm con Teacher Cokitö."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs"
                />
              </div>

              {/* 8. MENSAJE PARA LA ALUMNA (INBOX & NOTIFICACIÓN) */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Mensaje Institucional para {assigningClassesStudent.name}:
                </label>
                <textarea
                  rows={2}
                  value={assignMessage}
                  onChange={e => setAssignMessage(e.target.value)}
                  placeholder="Mensaje de bienvenida y confirmación de inicio de clases..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2.5 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                Firma oficial de Waky - The Principal
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningClassesStudent(null)}
                  className="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>🎓 Confirmar Horario & Activar Alumna</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMACIÓN & DESPACHO WHATSAPP / CORREO                        */}
      {/* ========================================================================= */}
      {assignedNotificationSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-auto text-center p-6 space-y-4 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ¡Clases Asignadas con Éxito!
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1.5">
                {assignedNotificationSummary.studentName} ha sido notificada
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Su matrícula está activa con <strong>{assignedNotificationSummary.teacherName}</strong> en el horario <strong>{assignedNotificationSummary.schedule}</strong>.
              </p>
            </div>

            {/* Quick dispatch actions */}
            <div className="space-y-2 pt-2">
              <a
                href={assignedNotificationSummary.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Enviar Notificación por WhatsApp 📲</span>
              </a>

              <a
                href={`mailto:${assignedNotificationSummary.studentEmail}?subject=${encodeURIComponent('Tus Clases en Güakytopia han sido Asignadas')}&body=${encodeURIComponent(`Hola ${assignedNotificationSummary.studentName}!\n\nTus clases en Güakytopia han sido agendadas con éxito con ${assignedNotificationSummary.teacherName}.\nHorario: ${assignedNotificationSummary.schedule}\nAula: ${assignedNotificationSummary.meetLink}`)}`}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Enviar Resumen por Correo Electrónico</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setAssignedNotificationSummary(null)}
              className="w-full py-2 text-slate-400 hover:text-slate-700 font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CARTA OFICIAL Y CREDENCIALES (THE FLOCK & CAMPUS) */}
      {activeCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-auto animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-xl shrink-0">
                  {activeCredentialsModal.role === 'teacher' ? '🪶' : '🎓'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                      {activeCredentialsModal.role === 'teacher' ? 'Credenciales de The Flock' : 'Carnet de Campus'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeCredentialsModal.mode === 'gmail_api'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {activeCredentialsModal.mode === 'gmail_api' ? '✓ Enviado vía Gmail API' : '✉️ Listo para Despacho'}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mt-0.5">
                    {activeCredentialsModal.recipientName}
                  </h3>
                  <p className="text-xs text-slate-500">{activeCredentialsModal.recipientEmail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCredentialsModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Info */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Guardado en Base de Datos</strong> (Firestore Cloud & Sincronizado en Vivo).
                </span>
              </div>
              <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded font-bold text-emerald-900">
                Sincronizado
              </span>
            </div>

            {/* Temporary password box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Contraseña Provisional Generada
                </span>
                <span className="text-base font-mono font-black text-amber-950 select-all">
                  {activeCredentialsModal.temporaryPassword}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeCredentialsModal.temporaryPassword);
                  setApprovalNotice(`¡Contraseña ${activeCredentialsModal.temporaryPassword} copiada al portapapeles!`);
                  setTimeout(() => setApprovalNotice(null), 3000);
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Clave</span>
              </button>
            </div>

            {/* Email Letter Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Carta Oficial Despachada / Texto del Correo:
                </label>
                <span className="text-[11px] text-slate-400 truncate max-w-[280px]">
                  {activeCredentialsModal.subject}
                </span>
              </div>
              <div className="bg-slate-900 text-amber-100/90 text-xs p-3.5 rounded-2xl max-h-52 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed border border-slate-800 select-all">
                {activeCredentialsModal.bodyText}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeCredentialsModal.bodyText);
                    setApprovalNotice('¡Carta oficial copiada al portapapeles!');
                    setTimeout(() => setApprovalNotice(null), 3000);
                  }}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copiar Carta</span>
                </button>

                <a
                  href={activeCredentialsModal.gmailWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en Gmail</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setActiveCredentialsModal(null)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black rounded-xl text-xs transition-colors"
              >
                Entendido • Continuar en Rectoría
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
