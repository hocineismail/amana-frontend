// src.firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "firebase/app-check" 
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId:process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId:  process.env.MEASUREMENT_ID
  };
 
// Initialize Firebase and Firestore
export const app = initializeApp(firebaseConfig)
// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
// export const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6LfWTssgAAAAAHmto4knQq-rL_pbGOcUhRMGSYrH"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });

export const db = getFirestore(app)