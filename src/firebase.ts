import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBznWAtfO2ehTJACKVTzJV3VjTRHez4xMA",
  authDomain: "operations-d53e4.firebaseapp.com",
  databaseURL: "https://operations-d53e4-default-rtdb.firebaseio.com",
  projectId: "operations-d53e4",
  storageBucket: "operations-d53e4.appspot.com",
  messagingSenderId: "573261282857",
  appId: "1:573261282857:web:920bcd69855799641ee638",
  measurementId: "G-PVWSGHZPFX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);