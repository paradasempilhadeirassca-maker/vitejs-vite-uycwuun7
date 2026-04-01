// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Configuração do Firebase (cole exatamente os valores que você copiou)
const firebaseConfig = {
  apiKey: "AIzaSyDhMjtG9q6uaxBwopSs871TXMMW5c03_Zo",
  authDomain: "empilhadeira-sca.firebaseapp.com",
  projectId: "empilhadeira-sca",
  storageBucket: "empilhadeira-sca.appspot.com", // corrigido
  messagingSenderId: "290067796753",
  appId: "1:290067796753:web:d2991f0ea2b1f78d6932b0"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore para usar no App.tsx
export const db = getFirestore(app);
