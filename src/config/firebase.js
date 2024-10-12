import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyB813rExqMCaDpot0Coa37-5IwDWVS-cQ8",
    authDomain: "gfk-app.firebaseapp.com",
    projectId: "gfk-app",
    storageBucket: "gfk-app.appspot.com",
    messagingSenderId: "243149054288",
    appId: "1:243149054288:web:658c1ea39be904e1920c55",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
