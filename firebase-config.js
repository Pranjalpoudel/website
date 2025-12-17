// Firebase Configuration
// REPLACE the placeholders with your actual values from the Firebase Console

const firebaseConfig = {
    apiKey: "AIzaSyDQ56boL_H08lvYEwJFkhzRyFOuP8x2CVs",
    authDomain: "website-fd610.firebaseapp.com",
    projectId: "website-fd610",
    storageBucket: "website-fd610.firebasestorage.app",
    messagingSenderId: "760043160452",
    appId: "1:760043160452:web:b0a65d191755b729e393d1",
    measurementId: "G-SJZN7GYQK4"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, getDocs, deleteDoc, doc }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot, query, orderBy, getDocs, deleteDoc, doc };
