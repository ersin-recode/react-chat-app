import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { dataModel } from "../constants";
import { createUser, firebase, getDocData } from "./fb";



export let ak = "asd";
const app = firebase.app;
const db = firebase.db;
const auth = firebase.auth;

const register = async (email, password, displayName, avatarUrl) => {
    try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
        console.log(newUser);
        const userData = {
            ...dataModel.userData,
            id: newUser.user.uid,
            email,
            displayName,
            avatarUrl,
        }
        console.log(newUser)
        await setDoc(doc(db, "users", newUser.user.uid), userData);

        toast.success('kayit oldun');
        userData.firebaseUser = newUser
        return userData //userData
    }
    catch (err) {
        toast.error(err);
        console.log(err, "err")
        return false;
    }
}



const login = async (email, password) => {
    console.log('login')
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        toast.success("giris yapildi")
        console.log(user)
        const data = await getDocData("users", user.user.uid);
        data.firebaseUser = user;
        console.log(data)
        return data;
    }
    catch (err) {
        console.log(err)
        toast.error(err.message);
    }
}
const logOut = async () => {
    console.log('qweqwe')
    try {
        await signOut(auth)
        toast.success("cikis yapildi")
    }
    catch (err) {
        toast.error(err.message);
    }

}



const updateCurrentProfile = async (data) => {
    try {
        const result = await updateProfile(auth.currentUser, data);
        console.log('guncellendi', result);
        return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }

}


async function onAuthStateChangedPrm() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user)
                const userDoc = await getDocData('users', user.uid)
                userDoc.firebaseUser = user;
                console.log(userDoc)
                resolve(userDoc)
                return userDoc;
            } else {
                resolve(null)
            }
        });
    })
}
async function checkUser() {
    const data = await onAuthStateChangedPrm();
    return data;
}



export const firebaseAuth = {
    login, logOut, register, updateCurrentProfile, checkUser
}
