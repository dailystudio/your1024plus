// src/firebaseUtils.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, doc, addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig'; 

// Define global variables for app, auth, and db
let app, auth, db;

// Initialize Firebase
export const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      resolve(); 
    } catch (error) {
      reject(error);
    }
  });
};

// Authentication
export const signInAnonymouslyFirebase = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error; 
  }
};

export const signOutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error; 
  }
};

export const storeSuccessfulAnswer = async (userId, nums, userExpression, answerTime) => {
    try {
        const db = getFirestore();
        const successfulAnswersCollection = collection(db, 'successfulAnswers');
  
        await addDoc(successfulAnswersCollection, {
            userId: userId,
            numbers: nums,
            userExpression: userExpression,
            answerTime: answerTime,
        });
        console.log('Answer data successfully stored in Firestore.');
    } catch (error) {
        console.error('Error storing answer data in Firestore:', error);
    }
  }

export const getTop10Times = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getFirestore();
      const successfulAnswersCollection = collection(db, 'successfulAnswers');
      const q = query(successfulAnswersCollection, orderBy('answerTime'), limit(10));
      
      const querySnapshot = await getDocs(q);
      const top10Times = [];
      querySnapshot.forEach((doc) => {
        top10Times.push({ time: doc.data().answerTime }); 
      });

      resolve(top10Times);
    } catch (error) {
      console.error('Error getting top 10 times:', error);
      reject(error);
    }
  });
};