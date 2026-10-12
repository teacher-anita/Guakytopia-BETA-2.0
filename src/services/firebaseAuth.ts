import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
  'https://www.googleapis.com/auth/gmail.send'
];

// Clean provider for rapid, frictionless user/student login (never blocked by third-party scope warnings)
export const standardGoogleProvider = new GoogleAuthProvider();
standardGoogleProvider.setCustomParameters({ prompt: 'select_account' });

// Advanced provider for Google Workspace features (Gmail, Classroom, Calendar) when explicitly requested
export const workspaceGoogleProvider = new GoogleAuthProvider();
SCOPES.forEach(scope => workspaceGoogleProvider.addScope(scope));
workspaceGoogleProvider.setCustomParameters({ prompt: 'consent' });

let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || '');
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, standardGoogleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google:', error);
    // Return friendly error code/message so caller can display notice
    throw error;
  }
};

export const googleWorkspaceSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, workspaceGoogleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.error('Error al solicitar permisos Google Workspace:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const emailPasswordSignIn = async (email: string, pass: string): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
};

export const emailPasswordSignUp = async (email: string, pass: string): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  return cred.user;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};
