import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const config = {
    apiKey:import.meta.env.VITE_apiKey,    
    authDomain:import.meta.env.VITE_authDomain,
    projectId:import.meta.env.VITE_projectId,
    storageBucket:import.meta.env.VITE_storageBucket,
    messagingSenderId:import.meta.env.VITE_messagingSenderId, 
    appId:import.meta.env.VITE_appId 
};
firebase.initializeApp(config)

const db = firebase.firestore()
const firebaseAuth = firebase.auth()
const usersRef = db.collection('users')
const chatsRef = db.collection('chats')
const messagesRef = db.collection('messages')

export {chatsRef, messagesRef, firebaseAuth, usersRef}