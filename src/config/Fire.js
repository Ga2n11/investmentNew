import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBhcDj0bhcebVDsJX-QJhk01CZSehDHZRw",
    authDomain: "xpense-b57a7.firebaseapp.com",
    projectId: "xpense-b57a7",
    storageBucket: "xpense-b57a7.appspot.com",
    messagingSenderId: "672417523445",
    appId: "1:672417523445:web:fbc1549ee6cc01ddb447bc"
};

const fire = firebase.initializeApp(config);
export default fire;