import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDypHW7a1JEko-5ZoHf8zp3Gb8EubQwQR4",
  authDomain: "webshop-dd27f.firebaseapp.com",
  projectId: "webshop-dd27f",
  storageBucket: "webshop-dd27f.appspot.com",
  messagingSenderId: "112045956101",
  appId: "1:112045956101:web:336a0120c9d897b89e106c"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };