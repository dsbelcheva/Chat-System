import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
 
const firebaseConfig = {
    apiKey: "AIzaSyDWY6cQalBem41S-QnDOuNTPC7aLIGDHwU",
    authDomain: "chat-system-36d51.firebaseapp.com",
    projectId: "chat-system-36d51",
    storageBucket: "chat-system-36d51.appspot.com",
    messagingSenderId: "616629066529",
    appId: "1:616629066529:web:c1c0b5091b30976ac4fc60",
    measurementId: "G-0RQ2LQG04T"
  };

const app = initializeApp(firebaseConfig);
const submit = document.getElementById("submitLogin");

submit.addEventListener("click", (event) => {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        if (userCredential) {
            window.location.replace("/ChatRooms/index.html");
        }
    })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password!');
            }
            else {
                alert(errorMessage);
            }
            document.getElementById("email").value = null;
            document.getElementById("password").value = null;
        });
});