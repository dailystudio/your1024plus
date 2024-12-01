import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import Main from './components/Main.vue';
import Top10 from './components/Top10.vue';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from './firebaseConfig.js';

// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/app' },
    { path: '/app', component: Main },
    { path: '/top10', component: Top10 },
  ],
});

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

createApp(App).use(router).mount('#app');
