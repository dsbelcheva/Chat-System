import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
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

var dataRef= ref(database,"groups/"+window.localStorage.getItem("currentChat"));

if ((database, "users/" + window.localStorage.getItem("username"))) {
    get(child(databaseRef, "users/" + window.localStorage.getItem("username")))
      .then((snapshot1) => {
        if (!snapshot1.exists()) {
          const newRef = ref(database,"users/" + window.localStorage.getItem("username"));
          const createdRef = push(newRef);
          set(createdRef, {
            groupName: "General",
          });
          get(child(databaseRef, "groups-users/" + "General"))
            .then((snapshot2) => {
              if (snapshot2.exists()) {
                get(
                  child(
                    databaseRef,
                    "groups-users/" +
                    "General/" +
                    window.localStorage.getItem("username")
                  )
                )
                  .then((snapshot3) => {
                    if (!snapshot3.exists()) {
                      const newRef = ref(database, "groups-users/" + "General");
                      const createdRef = push(newRef);
                      set(createdRef, {
                        username: window.localStorage.getItem("username"),
                      });
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if ((database, "notifications/" + window.localStorage.getItem("username"))) {
    get(child(databaseRef, "notifications/" + window.localStorage.getItem("username")))
      .then((snapshot) => {
        if (snapshot.exists()) {
          buttonForNotifications.classList.add("red");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if ((database, "requests/" + window.localStorage.getItem("username"))) {
    get(child(databaseRef, "requests/" + window.localStorage.getItem("username")))
      .then((snapshot) => {
        if (snapshot.exists()) {
          buttonForRequests.classList.add("red");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
 

  messageInput.addEventListener("change", (event) => {
    dataRef = ref(database, "groups/" + window.localStorage.getItem("currentChat"));
    console.log(window.localStorage.getItem("currentChat"));
    const messageNewRef = push(dataRef);
    var currentDate = Date.now();
    set(messageNewRef, {
      username: window.localStorage.getItem("username"),
      date: currentDate,
      text: event.target.value,
      likes: 0,
    });
    const listItem = document.createElement("li");
    listItem.classList.add("message");
    const externalHTML = `
        <button id="updateMessage" class="updateMessage"><i class="fa fa-pencil"></i></button>
        <button id="deleteMessage" class="deleteMessage"><i class="fa fa-trash"></i></button>
        <p class="username">${window.localStorage.getItem("username")}</p>
        <p class="date-time">${new Date(currentDate).toLocaleString()}</p>
        <p class="text">${event.target.value}</p>
        <button class="likes"><i class="fa fa-heart"></i> 0</button>
        `;
    listItem.innerHTML = externalHTML;
    messagesUL.appendChild(listItem);
    sendNotifications(window.localStorage.getItem("currentChat"));
    event.target.value ="";
  });

  messagesUL.addEventListener("click", event => {
    event.preventDefault();
    const operation = event.target.parentNode.value; // gives us update or delete
    console.log(operation);
    if (operation !== "likes") {
        if (operation === "delete") {
          const Date1 = event.target.parentNode.parentNode.childNodes[7].innerText; // date
          const Text1 = event.target.parentNode.parentNode.childNodes[9].innerText; // text
          deleteMessage(Date1, Text1);
         }
        else {
        }
    }
    else{
    }
  });
  
  exitEditMessage.addEventListener("click",(event)=>{
    event.preventDefault();
    window.localStorage.removeItem("messageToUpdate");
    window.localStorage.removeItem("messageToUpdateDate");
    document.getElementById("edit-message-section").classList.add("hidden");
  });

  buttonForInbox.addEventListener("click", (event) => {
    event.preventDefault();
    groupsUL.innerHTML = null;
    get(child(databaseRef, "users/" + window.localStorage.getItem("username")))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (var [key, value] of Object.entries(snapshot.val())) {
            const groupName = value;
            const listItem = document.createElement("li");
            listItem.setAttribute("id", groupName.groupName);
            const externalHTML = `
              <p class="chatName">${groupName.groupName}</p>
            `;
            listItem.innerHTML = externalHTML;
            groupsUL.appendChild(listItem);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    document.getElementById("groups-wrapper").classList.remove("hidden");
  });

  groupsUL.addEventListener("click", (event) => {
    window.localStorage.setItem("currentChat", event.target.innerText);
    document.getElementById("chatName").innerText =window.localStorage.getItem("currentChat");
    messagesUL.innerHTML = null;
    updateAllMessages();
    document.getElementById("listWrapper").classList.add("hidden");
    groupsUL.innerHTML = null;
  });

  buttonToLeave.addEventListener("click", (event) => {
    event.preventDefault();
    get(child(databaseRef, "users/" + window.localStorage.getItem("username")))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (var [key, value] of Object.entries(snapshot.val())) {
            for (var [innerKey, innerValue] of Object.entries(value)) {
              if (innerValue == window.localStorage.getItem("currentChat")) {
                remove(
                  child(
                    databaseRef,
                    "users/" + window.localStorage.getItem("username") + "/" + key
                  )
                );
              }
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  exitInbox.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("groups-wrapper").classList.add("hidden");
    groupsUL.innerHTML = null;
  });

buttonForNewGroup.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddnewGroup").classList.remove("hidden");
  });
  
  exitAddingNewGroup.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddnewGroup").classList.add("hidden");
  });

  addNewGroup.addEventListener("click", (event) => {
    event.preventDefault();
    var name = document.getElementById("newGroupName").value;
    const newRef = ref(database, "groups/" + name);
    const createdRef = push(newRef);
    set(createdRef, {
      username: "System",
      date: Date.now(),
      text: "New group was created!",
      likes: 0,
    });
    get(child(databaseRef, "users/" + window.localStorage.getItem("username")))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const newRef = ref(
            database,
            "users/" + window.localStorage.getItem("username")
          );
          const createdRef = push(newRef);
          set(createdRef, {
            groupName: name,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    addTheUserToChatsUserList(name);
    document.getElementById("newGroup").value = null;
  });

  searchGroup.addEventListener("click", (event) => {
    event.preventDefault();
    var name = document.getElementById("searchGroup").value;
    joinTheGroup(name);
    addTheUserToChatsUserList(name);
    document.getElementById("searchGroup").value = null;
  });

  buttonForNewPeople.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddNewPerson").classList.remove("hidden");
  });

  exitAddingNewPeople.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddNewPerson").classList.add("hidden");
  });

  addNewPerson.addEventListener("click", (event) => {
    event.preventDefault();
    var name = document.getElementById("newPerson").value;
    var chat = window.localStorage.getItem("currentChat");
    const personRequestsRef = ref(database, "requests/" + name);
    const newRequestRef = push(personRequestsRef);
    set(newRequestRef, {
      chatToJoin: chat,
    });
    document.getElementById("newPerson").value = null;
  });