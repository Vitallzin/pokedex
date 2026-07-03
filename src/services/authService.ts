import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  auth as firebaseAuth,
  db as firestoreDb,
  googleProvider,
  isFirebaseConfigured,
} from './firebase';
import { getDefaultAvatar } from '../utils/avatar';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  providerIds: string[];
}

const createAuthError = (code: string, message: string) => {
  return Object.assign(new Error(message), { code });
};

const getFirebaseServices = () => {
  if (!isFirebaseConfigured || !firebaseAuth || !firestoreDb) {
    throw new Error('Firebase não está configurado. Preencha o arquivo .env.');
  }

  return { auth: firebaseAuth, db: firestoreDb };
};

const getUserName = (firebaseUser: FirebaseUser) =>
  firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Treinador';

const getGoogleProfilePhoto = (firebaseUser: FirebaseUser) =>
  firebaseUser.providerData.find((provider) => provider.providerId === 'google.com')?.photoURL;

const getGoogleProfilePhotoFromCredential = (credential: UserCredential) => {
  const profile = getAdditionalUserInfo(credential)?.profile as { picture?: unknown } | null | undefined;
  return typeof profile?.picture === 'string' ? profile.picture : undefined;
};

const getUserAvatar = (firebaseUser: FirebaseUser, googlePhotoURL?: string) => {
  const name = getUserName(firebaseUser);
  return googlePhotoURL || getGoogleProfilePhoto(firebaseUser) || firebaseUser.photoURL || getDefaultAvatar(firebaseUser.email || name);
};

const mapFirebaseUser = (firebaseUser: FirebaseUser, googlePhotoURL?: string): User => ({
  id: firebaseUser.uid,
  name: getUserName(firebaseUser),
  email: firebaseUser.email || '',
  avatar: getUserAvatar(firebaseUser, googlePhotoURL),
  providerIds: firebaseUser.providerData.map((provider) => provider.providerId),
});

const usesPasswordProvider = (firebaseUser: FirebaseUser) =>
  firebaseUser.providerData.some((provider) => provider.providerId === 'password');

const canUseAuthenticatedSession = (firebaseUser: FirebaseUser) =>
  !usesPasswordProvider(firebaseUser) || firebaseUser.emailVerified;

const requireVerifiedEmailSession = async (firebaseUser: FirebaseUser) => {
  if (canUseAuthenticatedSession(firebaseUser)) return;

  await sendEmailVerification(firebaseUser);
  await signOut(firebaseAuth!);
  throw createAuthError(
    'auth/email-not-verified',
    'Confirme seu e-mail antes de entrar. Enviamos um novo link de verificação.'
  );
};

const upsertUserProfile = async (firebaseUser: FirebaseUser, googlePhotoURL?: string) => {
  const { db } = getFirebaseServices();
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(userRef);
  const user = mapFirebaseUser(firebaseUser, googlePhotoURL);
  const payload = {
    uid: user.id,
    email: user.email,
    displayName: user.name,
    photoURL: user.avatar,
    providerIds: user.providerIds,
    updatedAt: serverTimestamp(),
  };

  if (snapshot.exists()) {
    await setDoc(userRef, payload, { merge: true });
    return;
  }

  await setDoc(userRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

const tryUpsertUserProfile = async (firebaseUser: FirebaseUser, googlePhotoURL?: string) => {
  try {
    await upsertUserProfile(firebaseUser, googlePhotoURL);
  } catch {
    // Keep authentication usable even if the optional Firestore profile write fails.
  }
};

const syncGoogleProfilePhoto = async (firebaseUser: FirebaseUser, googlePhotoURL?: string) => {
  const nextGooglePhotoURL = googlePhotoURL || getGoogleProfilePhoto(firebaseUser);

  if (!nextGooglePhotoURL) return undefined;

  if (firebaseUser.photoURL !== nextGooglePhotoURL) {
    await updateProfile(firebaseUser, {
      displayName: getUserName(firebaseUser),
      photoURL: nextGooglePhotoURL,
    });
  }

  return nextGooglePhotoURL;
};

export const authService = {
  getUser: (): User | null => {
    const currentUser = firebaseAuth?.currentUser;
    if (!currentUser || !canUseAuthenticatedSession(currentUser)) return null;
    return mapFirebaseUser(currentUser);
  },

  onAuthChanged: (callback: (user: User | null) => void) => {
    if (!firebaseAuth || !firestoreDb) {
      callback(null);
      return () => undefined;
    }

    return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser || !canUseAuthenticatedSession(firebaseUser)) {
        callback(null);
        return;
      }

      const googlePhotoURL = await syncGoogleProfilePhoto(firebaseUser);
      await tryUpsertUserProfile(firebaseUser, googlePhotoURL);
      callback(mapFirebaseUser(firebaseUser, googlePhotoURL));
    });
  },

  login: async (email: string, password: string): Promise<User> => {
    const { auth } = getFirebaseServices();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await credential.user.reload();
    const user = auth.currentUser || credential.user;
    await requireVerifiedEmailSession(user);
    await tryUpsertUserProfile(user);
    return mapFirebaseUser(user);
  },

  loginWithGoogle: async (): Promise<User> => {
    const { auth } = getFirebaseServices();
    const credential = await signInWithPopup(auth, googleProvider);
    const googlePhotoURL = await syncGoogleProfilePhoto(
      credential.user,
      getGoogleProfilePhotoFromCredential(credential)
    );
    const user = auth.currentUser || credential.user;
    await tryUpsertUserProfile(user, googlePhotoURL);
    return mapFirebaseUser(user, googlePhotoURL);
  },

  register: async (nickname: string, email: string, password: string): Promise<void> => {
    const { auth } = getFirebaseServices();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const cleanNickname = nickname.trim();
    const name = cleanNickname || email.split('@')[0];
    const avatar = getDefaultAvatar(email);

    await updateProfile(credential.user, {
      displayName: name,
      photoURL: avatar,
    });

    await sendEmailVerification(credential.user);
    await signOut(auth);
  },

  logout: async (): Promise<void> => {
    const { auth } = getFirebaseServices();
    await signOut(auth);
  },

  updateUser: async (userData: Partial<Pick<User, 'name' | 'avatar'>>): Promise<User> => {
    const { auth, db } = getFirebaseServices();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Usuário não encontrado.');
    }

    const nextName = userData.name ?? getUserName(currentUser);
    const nextAvatar =
      getGoogleProfilePhoto(currentUser) ||
      userData.avatar ||
      currentUser.photoURL ||
      getDefaultAvatar(currentUser.email || nextName);

    await updateProfile(currentUser, {
      displayName: nextName,
      photoURL: nextAvatar,
    });

    await updateDoc(doc(db, 'users', currentUser.uid), {
      displayName: nextName,
      photoURL: nextAvatar,
      updatedAt: serverTimestamp(),
    });

    return mapFirebaseUser(currentUser);
  },

  updatePasswordWithCurrentPassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const { auth } = getFirebaseServices();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      throw new Error('Usuário não encontrado.');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  },

  sendPasswordReset: async (): Promise<void> => {
    const { auth } = getFirebaseServices();
    const currentUser = auth.currentUser;

    if (!currentUser?.email) {
      throw new Error('Usuário não encontrado.');
    }

    await sendPasswordResetEmail(auth, currentUser.email);
  },
};
