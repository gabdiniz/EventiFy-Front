import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpEROxxH5piLNwBxFXimtKvnam8FzJ0aA",
  authDomain: "event-saas.firebaseapp.com",
  projectId: "event-saas",
  storageBucket: "event-saas.appspot.com",
  messagingSenderId: "595602766701",
  appId: "1:595602766701:web:2e7e202348be7741fdf864"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);