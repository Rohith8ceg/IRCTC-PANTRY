import firebase from "firebase";

const app = firebase.initializeApp({
    apiKey: 'AIzaSyARzkk0EZgUpPeWOd2UygZaSOoIVRQPKcQ',
    authDomain: 'irctc-pantry-54c7f.firebaseapp.com',
    projectId: 'irctc-pantry-54c7f'
})
  
const db = app.firestore()

export default db

// var firebaseConfig = {
//     apiKey: "AIzaSyARzkk0EZgUpPeWOd2UygZaSOoIVRQPKcQ",
//     authDomain: "irctc-pantry-54c7f.firebaseapp.com",
//     // databaseURL: "https://irctc-pantry-54c7f-default-rtdb.firebaseio.com",
//     projectId: "irctc-pantry-54c7f",
//     // storageBucket: "irctc-pantry-54c7f.appspot.com",
//     // messagingSenderId: "575799523613",
//     // appId: "1:575799523613:web:dfeb8bd1a94021f5df09f4",
//     // measurementId: "G-19TZLLNMLD"
// };
// // Initialize Firebase
// const Firebase = firebase.initializeApp(firebaseConfig);
// export const db = Firebase.getFirestore();
// export default Firebase;