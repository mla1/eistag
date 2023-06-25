import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, child, get} from "firebase/database";
import { firebaseConfig } from './config.js';


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function doSignIn() {
    signInWithPopup(auth, provider)
        .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        });

}

export async function getLocations(year='') {

    const db = getDatabase(app);
    const locationRef = ref(db, '/location');
    if (!year) {
        var d = new Date();
        year = d.getFullYear().toString();
    }

    var snapshot =  await get(child(locationRef, year));
    
    if (snapshot.exists()) {
        return snapshot.val();
    }
    
    throw new Error(`Data for year "${year}" not found`);
}