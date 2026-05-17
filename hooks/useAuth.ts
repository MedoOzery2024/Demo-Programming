import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  initialize: () => {
    if (get().initialized) return;
    
    set({ initialized: true });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ user, loading: true });
        
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            set({ profile: docSnap.data(), loading: false });
          } else {
            const newProfile = {
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0],
              photoURL: user.photoURL,
              xp: 0,
              level: 1,
              role: 'user'
            };
            await setDoc(userRef, newProfile);
            set({ profile: newProfile, loading: false });
          }
        } catch (error) {
          console.error("Error setting up user profile", error);
          set({ loading: false });
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  }
}));
