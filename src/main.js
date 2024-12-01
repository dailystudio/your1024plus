import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Anonymous Authentication
signInAnonymously(auth)
  .then(() => {
    console.log('User signed in anonymously');
    onAuthStateChanged(auth, (user) => { if (user) console.log('User UID:', user.uid); });
  })
  .catch((error) => { console.error('Error signing in anonymously:', error); });

createApp(App).mount('#app')
