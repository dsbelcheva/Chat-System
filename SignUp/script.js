import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDAUPbNdIA7cqFP8oDgACIdAxeGNvFPuJ4",
    authDomain: "chat-system-46f67.firebaseapp.com",
    databaseURL: "https://chat-system-46f67-default-rtdb.firebaseio.com",
    projectId: "chat-system-46f67",
    storageBucket: "chat-system-46f67.appspot.com",
    messagingSenderId: "970782635917",
    appId: "1:970782635917:web:0425b2a94f2bf01975efc4",
    measurementId: "G-8XV2HB67SN"
};

const app = initializeApp(firebaseConfig);
const submit = document.getElementById("submitSignUp");

function clearFields() {
    document.getElementById("email").value = null;
    document.getElementById("password").value = null;
    document.getElementById("confirm_password").value = null;
};

submit.addEventListener("click", (event) => {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;
    const auth = getAuth();
    if (confirm_password !== password) {
        alert("Your passwords don't match! Please, try again!");
        clearFields();
    }
    else {
        createUserWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    alert('This email is already used.');
                } else {
                    alert(errorMessage);
                }
            });
        clearFields();
    }
});