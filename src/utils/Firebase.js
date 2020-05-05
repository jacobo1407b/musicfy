import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD9K_FcM1nft8TV5mJlEWPBubjXJAiQJdA",
  authDomain: "musicfy-ba272.firebaseapp.com",
  databaseURL: "https://musicfy-ba272.firebaseio.com",
  projectId: "musicfy-ba272",
  storageBucket: "musicfy-ba272.appspot.com",
  messagingSenderId: "145319570269",
  appId: "1:145319570269:web:8b886089587e67fcd316b4"
};
export default firebase.initializeApp(firebaseConfig);
