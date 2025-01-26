// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase, onValue, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_M_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function writePost(
    userId: string,
    title: string,
    content: string,
    imgUrl: string, // List of image URLs (array of strings)
    lat: number, // Latitude of the post location
    lng: number  // Longitude of the post location
) {
    const db = getDatabase(app); // Initialize the database associated with the app
    const timeCreated = new Date();
    const reference = ref(db, `UsersPosts/${timeCreated}`); // Path to store post under `posts/userId`
    set(reference, {
        title: title,
        content: content,
        imgUrl: imgUrl,
        location: {
            lat: lat,
            lng: lng,
        },
        createdAt: timeCreated,  
        userId: userId  
    }).then(() => {
        console.log("Post successfully written to the database!");
    }).catch((error) => {
        console.error("Error writing post to the database:", error);
    });
}

function readPost(callback: ((arg0: any) => void) | undefined){
    const db = getDatabase(app); // Initialize the database associated with the app
    const reference = ref(db, `UsersPosts`); // Path to store post under `posts/userId`
    onValue(reference, (s) => {
        const data = s.val();
        callback(data)
    })
}

export { auth, writePost, readPost};