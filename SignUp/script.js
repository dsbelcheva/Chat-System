 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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
const submit = document.getElementById("submitSignUp");

submit.addEventListener("click", (event) => {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;
    if (confirm_password !== password) {
        alert("Your passwords don't match! Please, try again!");
        clearFields();
    }
    else {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            if (userCredential) {
                var mail = email.split('@');
                window.localStorage.setItem("username", mail[0]);
                window.localStorage.setItem("currentChat", "General");
                window.localStorage.setItem("GeneralChatIsOpen", true);
            }
        })
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

function clearFields() {
    document.getElementById("email").value = null;
    document.getElementById("password").value = null;
    document.getElementById("confirm_password").value = null;
};