import { getAccessToken } from './firebaseAuth';

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  alternateLink?: string;
  courseState?: string;
}

export async function fetchClassroomCourses(): Promise<{ courses: ClassroomCourse[]; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { courses: [], error: 'NO_AUTH' };
    }

    const response = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { courses: data.courses || [] };
  } catch (err: any) {
    console.error('Error fetching Classroom courses:', err);
    return { courses: [], error: err.message };
  }
}
