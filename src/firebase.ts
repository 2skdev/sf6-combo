// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBeByZXL-8XEsZFWnsgVKRYbbjd4IL-nyo',
  authDomain: 'sf6-combo.firebaseapp.com',
  projectId: 'sf6-combo',
  storageBucket: 'sf6-combo.firebasestorage.app',
  messagingSenderId: '511726368894',
  appId: '1:511726368894:web:241ed0ffd9ad57cb85002f',
  measurementId: 'G-M3R32SYD7V',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)

export { analytics, auth, db }
