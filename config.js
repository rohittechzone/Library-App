import firebase from "firebase"
require("@firebase/firestore")
var firebaseConfig = {
    apiKey: "AIzaSyAl5S7Z2vKf9remlyka9-fYRBl2-qB_7c8",
    authDomain: "library-app-75bb8.firebaseapp.com",
    projectId: "library-app-75bb8",
    storageBucket: "library-app-75bb8.appspot.com",
    messagingSenderId: "126761940690",
    appId: "1:126761940690:web:86dc26aab74e0004149f0b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();  