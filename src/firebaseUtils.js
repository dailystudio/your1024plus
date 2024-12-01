// src/firebaseUtils.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, doc, addDoc, collection } from 'firebase/firestore';
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