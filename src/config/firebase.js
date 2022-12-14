import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCns0-0hTULwze3NzlzA4RZmohWSJvJPr0",
  authDomain: "stockmanager-c53f5.firebaseapp.com",
  projectId: "stockmanager-c53f5",
  storageBucket: "stockmanager-c53f5.appspot.com",
  messagingSenderId: "707642773597",
  appId: "1:707642773597:web:2006ef1cabcbb562fafdb4",
  measurementId: "G-946MZLW94N"
};

const fireDb = firebase.initializeApp(firebaseConfig);
export default fireDb.database().ref();
