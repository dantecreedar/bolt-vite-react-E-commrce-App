import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data()?.isAdmin || false);
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      isAdmin: email === 'admin@gmail.com'
    });
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Function to create admin user (call this once to set up the admin)
export const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'davimirra23';
    
    // Check if admin already exists
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: adminEmail,
      isAdmin: true
    });
    console.log('Admin user created successfully');
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
};