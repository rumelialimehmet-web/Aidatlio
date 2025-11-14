import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // Kullanıcı durumunu dinle
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  // Email/Password ile giriş
  signInWithEmail: async (email, password) => {
    try {
      set({ error: null, loading: true });
      await signInWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (error) {
      const errorMessages = {
        'auth/invalid-email': 'Geçersiz email adresi',
        'auth/user-disabled': 'Bu hesap devre dışı bırakılmış',
        'auth/user-not-found': 'Kullanıcı bulunamadı',
        'auth/wrong-password': 'Hatalı şifre',
        'auth/invalid-credential': 'Email veya şifre hatalı',
      };
      set({
        error: errorMessages[error.code] || 'Giriş yapılırken bir hata oluştu',
        loading: false
      });
      throw error;
    }
  },

  // Email/Password ile kayıt
  signUpWithEmail: async (email, password) => {
    try {
      set({ error: null, loading: true });
      await createUserWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (error) {
      const errorMessages = {
        'auth/email-already-in-use': 'Bu email adresi zaten kullanımda',
        'auth/invalid-email': 'Geçersiz email adresi',
        'auth/operation-not-allowed': 'Bu işlem şu anda yapılamıyor',
        'auth/weak-password': 'Şifre en az 6 karakter olmalıdır',
      };
      set({
        error: errorMessages[error.code] || 'Kayıt olurken bir hata oluştu',
        loading: false
      });
      throw error;
    }
  },

  // Google ile giriş
  signInWithGoogle: async () => {
    try {
      set({ error: null, loading: true });
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      set({ loading: false });
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        set({
          error: 'Google ile giriş yapılırken bir hata oluştu',
          loading: false
        });
      } else {
        set({ loading: false });
      }
      throw error;
    }
  },

  // Çıkış yap
  signOut: async () => {
    try {
      await signOut(auth);
      set({ user: null, error: null });
    } catch (error) {
      set({ error: 'Çıkış yapılırken bir hata oluştu' });
      throw error;
    }
  },

  // Hata mesajını temizle
  clearError: () => set({ error: null }),
}));
