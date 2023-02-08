import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, push, set, child, get, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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
const database = getDatabase(app);
const databaseRef = ref(database);
const auth = getAuth();
const buttonForNewPeople = document.getElementById("AddPeople");
const buttonToLeave = document.getElementById("LeaveChat");
const buttonForNewGroup = document.getElementById("groups-btn");
const buttonForInbox = document.getElementById("inbox-btn");
const buttonForRequests = document.getElementById("requests-btn");
const buttonForNotifications = document.getElementById("notifications-btn");
const exitAddingNewPeople = document.getElementById("exit-new-person");
const exitAddingNewGroup = document.getElementById("exit-new-group");
const exitInbox = document.getElementById("exit-groups-list");
const exitRequests = document.getElementById("exit-requests");
const exitNotifications = document.getElementById("exit-notifications");
const exitEditMessage = document.getElementById("exit-change-message");
const messageWindow = document.getElementById("messageBox");
const messageInput = document.getElementById("messageInput");
const messagesUL = document.getElementById("messages");
const addNewGroup = document.getElementById("submitNewGroup");
const addNewPerson = document.getElementById("submitNewPerson");
const searchGroup = document.getElementById("searchForGroup");
const groupsUL = document.getElementById("groups-ul");
const requestsUL = document.getElementById("reqests-ul");
const notificationsUL = document.getElementById("notificationLists-ul");