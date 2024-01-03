import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEaMia97O0lszlJNRM0eaTyPYmvpPdvHI",
  authDomain: "spaceappnotificacao-13291.firebaseapp.com",
  projectId: "spaceappnotificacao-13291",
  storageBucket: "spaceappnotificacao-13291.appspot.com",
  messagingSenderId: "156750540979",
  appId: "1:156750540979:web:e11c7bd4891892ce1d00c6",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, storage, auth };
