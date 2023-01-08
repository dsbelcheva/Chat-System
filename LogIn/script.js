import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const submit = document.getElementById("submitLogin");

submit.addEventListener("click", (event) => {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        if (userCredential) {
            var mail = email.split('@');
            window.localStorage.setItem("username", mail[0]);
            window.localStorage.setItem("currentChat", "General");
            window.localStorage.setItem("GeneralChatIsOpen", true);
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