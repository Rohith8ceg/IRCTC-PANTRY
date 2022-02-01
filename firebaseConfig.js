// import * as firebase from "firebase";
import firebase from "firebase" 
// import * as firebase from "firebase/app";
// import 'firebase/auth';
// import 'firebase/storage';
// import 'firebase/firestore';

const Firebase = firebase.initializeApp({
    apiKey: "AIzaSyARzkk0EZgUpPeWOd2UygZaSOoIVRQPKcQ",
    authDomain: "irctc-pantry-54c7f.firebaseapp.com",
    databaseURL: "https://irctc-pantry-54c7f-default-rtdb.firebaseio.com",
    projectId: "irctc-pantry-54c7f",
    storageBucket: "irctc-pantry-54c7f.appspot.com",
    messagingSenderId: "575799523613",
    appId: "1:575799523613:web:dfeb8bd1a94021f5df09f4",
    measurementId: "G-19TZLLNMLD"
})
  
const db = Firebase.firestore()

export default db