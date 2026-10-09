// The Brain of Cokitö: Flock Matrix & Relational Campus Matching Engine
// Manages teacher certifications, dynamic schedule projections, and level-to-mentor routing.

import { Teacher, Student, ScheduleSlot } from '../types';

/**
 * Returns all active Flock Mentors certified to teach a specific English level.
 */
export function getFlockTeachersForLevel(teachers: Teacher[], levelId: string): Teacher[] {
  if (!levelId) return teachers.filter(t => t.status === 'active');
  return teachers.filter(t => 
    t.status === 'active' && 
    Array.isArray(t.levelsAssigned) && 
    t.levelsAssigned.includes(levelId)
  );
}

/**
 * Intelligent Schedule Slot Filter for a Student.
 * - If student has an Exclusive Mentor: only returns slots belonging to that specific teacher.
 * - If student is in Rotational Mode (The Flock): returns all available slots from ANY mentor certified for their level.
 */
export function getCampusSlotsForStudent(
  slots: ScheduleSlot[],
  teachers: Teacher[],
  student: Student | null
): ScheduleSlot[] {
  if (!student) return slots;

  const studentLevel = student.levelId || 'level_1';

  // 1. Exclusive Mentor Mode
  if (student.isExclusiveTeacher && student.teacherId) {
    return slots.filter(slot => {
      const matchTeacherId = slot.teacherId === student.teacherId;
      const matchTeacherName = slot.teacherName && student.teacherName && 
        slot.teacherName.toLowerCase().includes(student.teacherName.toLowerCase());
      return matchTeacherId || matchTeacherName;
    });
  }

  // 2. Rotational Flock Mode (Academy Campus)
  // Identify all teachers certified for the student's level
  const certifiedTeachers = getFlockTeachersForLevel(teachers, studentLevel);
  const certifiedTeacherIds = new Set(certifiedTeachers.map(t => t.id));
  const certifiedTeacherNames = new Set(certifiedTeachers.map(t => t.name.toLowerCase()));

  return slots.filter(slot => {
    // If slot has explicit allowed levels
    if (Array.isArray(slot.allowedLevels) && slot.allowedLevels.length > 0) {
      if (slot.allowedLevels.includes(studentLevel)) return true;
    }

    // If slot belongs to a certified mentor
    if (slot.teacherId && certifiedTeacherIds.has(slot.teacherId)) {
      return true;
    }

    // Name fallback
    if (slot.teacherName) {
      const cleanName = slot.teacherName.toLowerCase().replace('teacher', '').trim();
      for (const tName of certifiedTeacherNames) {
        if (cleanName.includes(tName)) return true;
      }
    }

    // If slot already has this student booked
    if (slot.studentId === student.id || slot.enrolledStudents?.some(e => e.studentId === student.id)) {
      return true;
    }

    return false;
  });
}

/**
 * Formats a summary of Flock Mentors for a given level (e.g. "Teacher Waky y Teacher David").
 */
export function getFlockMentorsLabel(teachers: Teacher[], levelId: string): string {
  const certified = getFlockTeachersForLevel(teachers, levelId);
  if (certified.length === 0) return 'Directora Waky (Rectoría)';
  if (certified.length === 1) return `Teacher ${certified[0].name}`;
  if (certified.length === 2) return `Teacher ${certified[0].name} y Teacher ${certified[1].name}`;
  return `${certified.map(t => `Teacher ${t.name}`).slice(0, -1).join(', ')} y Teacher ${certified[certified.length - 1].name}`;
}
