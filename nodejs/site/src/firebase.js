import firebase from 'firebase/app';
import 'firebase/firestore';

if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  });

export const db = firebase.firestore();
console.log(process.env, process.env.USE_EMULATOR);

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost' && process.env.REACT_APP_USE_EMULATOR) {
  db.useEmulator('localhost', 8080);
}
