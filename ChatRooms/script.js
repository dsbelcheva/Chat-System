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
const dbRef = ref(database);
const messageInput = document.getElementById("messageInput");
const messagesUL = document.getElementById("messages");
const buttonForNewGroup = document.getElementById("groups-btn");
const addNewGroup = document.getElementById("submitNewGroup");
const exitNewGroup = document.getElementById("exit-new-group");
const buttonForNewPeople = document.getElementById("AddPeople");
const addNewPeople = document.getElementById("submitNewPerson");
const exitNewPeople = document.getElementById("exit-new-person");
const buttonForInbox = document.getElementById("inbox-btn");
const groupsUL = document.getElementById("groups-ul");
const exitInbox = document.getElementById("exit-groups-list");
const exitEditingMessage = document.getElementById("exit-change-message");
const buttonToLeave = document.getElementById("LeaveChat");
const buttonForRequests = document.getElementById("requests-btn");
const exitRequests = document.getElementById("exit-requests");
const buttonForNotifications = document.getElementById("notifications-btn");
const exitNotifications = document.getElementById("exit-notifications");
const requestsUL = document.getElementById("requests-ul");
const notificationsUL = document.getElementById("notificationLists-ul");
const submitEditedMessage = document.getElementById("submit-edit-message");

//const messageWindow = document.getElementById("messageBox");

var firstLogIn = true;

if (firstLogIn) {
    updateChat();
    firstLogIn = false;
}

get(child(dbRef, "users/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
        if (!snapshot.exists()) {
            const createdRef = ref(database, "users/" + window.localStorage.getItem("username"));
            const newRef = push(createdRef);
            set(newRef, {
                groupName: "General",
            });
        }
    })
    .catch((error) => {
        console.error(error);
    });

messageInput.addEventListener("change", (event) => {
    const dataRef = ref(database, "groups/" + window.localStorage.getItem("currentChat"));
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
        <button id="updateMessage" class="updateMessage" value="update"><i class="fa fa-pencil"></i></button>
        <button id="deleteMessage" class="deleteMessage" value="delete"><i class="fa fa-trash"></i></button>
        <p class="username">${window.localStorage.getItem("username")}</p>
        <p class="date-time">${new Date(currentDate).toLocaleString()}</p>
        <p class="text">${event.target.value}</p>
        <button id="likes" value="likes"><i class="fa fa-heart"></i> 0</button>
        <button id="dislikes" value="dislikes"><i class="fa fa-thumbs-down"></i></button>
        `;
    listItem.innerHTML = externalHTML;
    messagesUL.appendChild(listItem);
    event.target.value = "";
    sendNotifications(window.localStorage.getItem("currentChat"));
});

messagesUL.addEventListener("click", event => {
    event.preventDefault();
    const operation = event.target.parentNode.value;
    if (operation === "delete") {
        const date = event.target.parentNode.parentNode.childNodes[7].innerText;
        deleteThisMessage(date);
    }
    if (operation === "update") {
        document.getElementById("edit-message-section").classList.remove("hidden");
        const date = event.target.parentNode.parentNode.childNodes[7].innerText;
        submitEditedMessage.addEventListener("click", (event) => {
            const newText = document.getElementById("editMessageInput").value;
            editThisMessage(date, newText);
            messagesUL.innerHTML = null;
            updateChat();
            document.getElementById("editMessageInput").value = "";
        })
    }
    if (operation === "likes") {
        const date = event.target.parentNode.parentNode.childNodes[7].innerText;
        const like = event.target.parentNode.parentNode.childNodes[11].innerText;
        likeMessage(date,like);
        messagesUL.innerHTML = null;
        updateChat();
    }
    if (operation === "dislikes") {
        const date = event.target.parentNode.parentNode.childNodes[7].innerText;
        const like = event.target.parentNode.parentNode.childNodes[11].innerText;
        dislikeMessage(date,like);
        messagesUL.innerHTML = null;
        updateChat();
    }
});

function sendNotifications(groupName) {
    get(child(dbRef, "groups-users/" + groupName))
        .then((snapshot1) => {
            if (snapshot1.exists()) {
                Object.entries(snapshot1.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        get(child(dbRef, "notifications/" + innerValue))
                        if (innerValue !== window.localStorage.getItem("username")) {
                            const createdRef = ref(database, "notifications/" + innerValue);
                            const newRef = push(createdRef);
                            set(newRef, {
                                notification: groupName,
                            });
                        }
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function editThisMessage(date, newText) {
    get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
        .then((snapshot) => {
            Object.entries(snapshot.val()).forEach(([key, value]) => {
                Object.entries(value).forEach(([innerKey, innerValue]) => {
                    if (new Date(innerValue).toLocaleString() == date) {
                        const updates = {};
                        updates[`/groups/${window.localStorage.getItem("currentChat")}/${key}/text`] = newText;
                        update(dbRef, updates);
                        return;
                    }
                })
            })
        })
        .catch((error) => {
            console.error(error);
        });
}

exitEditingMessage.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("edit-message-section").classList.add("hidden");
})

function likeMessage(date,like){
    get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
        .then((snapshot) => {
            Object.entries(snapshot.val()).forEach(([key, value]) => {
                Object.entries(value).forEach(([innerKey, innerValue]) => {
                    if (new Date(innerValue).toLocaleString() == date) {
                        const updates = {};
                        updates[`/groups/${window.localStorage.getItem("currentChat")}/${key}/likes`] = Number(like)+1;
                        update(dbRef, updates);
                        return;
                    }
                })
            })
        })
        .catch((error) => {
            console.error(error);
        });
}

function dislikeMessage(date,like){
    get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
        .then((snapshot) => {
            Object.entries(snapshot.val()).forEach(([key, value]) => {
                Object.entries(value).forEach(([innerKey, innerValue]) => {
                    if (new Date(innerValue).toLocaleString() == date) {
                        const updates = {};
                        updates[`/groups/${window.localStorage.getItem("currentChat")}/${key}/likes`] = Number(like)-1;
                        update(dbRef, updates);
                        return;
                    }
                })
            })
        })
        .catch((error) => {
            console.error(error);
        });
}

function deleteThisMessage(date) {
    get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        if (new Date(innerValue).toLocaleString() == date) {
                            remove(child(dbRef, "groups/" + window.localStorage.getItem("currentChat") + "/" + key));
                            messagesUL.innerHTML = null;
                            updateChat();
                            return;
                        }
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

buttonForNewGroup.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddnewGroup").classList.remove("hidden");
});

addNewGroup.addEventListener("click", (event) => {
    event.preventDefault();
    var name = document.getElementById("newGroup").value;
    const createdRef = ref(database, "groups/" + name);
    const newRef = push(createdRef);
    set(newRef, {
        username: "System",
        date: Date.now(),
        text: `This group is ${name} !`,
        likes: 0,
    });
    get(child(dbRef, "users/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const createdRef = ref(database, "users/" + window.localStorage.getItem("username"));
                const newRef = push(createdRef);
                set(newRef, {
                    groupName: name,
                });
            }
        })
        .catch((error) => {
            console.error(error);
        });
    document.getElementById("newGroup").value = null;
    addToChatsUserList(name);
});

exitNewGroup.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddnewGroup").classList.add("hidden");
});

buttonForNewPeople.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddNewPerson").classList.remove("hidden");
})

addNewPeople.addEventListener("click", (event) => {
    event.preventDefault();
    var name = document.getElementById("newPerson").value;
    var chat = window.localStorage.getItem("currentChat");
    const createdPersonRequest = ref(database, "requests/" + name);
    const newRequestRef = push(createdPersonRequest);
    set(newRequestRef, {
        chatToJoin: chat,
    });
    document.getElementById("newPerson").value = null;
})

exitNewPeople.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("AddNewPerson").classList.add("hidden");
})

buttonToLeave.addEventListener("click", (event) => {
    event.preventDefault();
    get(child(dbRef, "users/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        if (innerValue == window.localStorage.getItem("currentChat")) {
                            remove(child(dbRef, "users/" + window.localStorage.getItem("username") + "/" + key));
                        }
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
})

buttonForInbox.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("groups-wrapper").classList.remove("hidden");
    get(child(dbRef, "users/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        const chatName = innerValue;
                        const listItem = document.createElement("li");
                        const externalHTML = `
                  <p class="chatName" >${chatName}</p>
                `;
                        listItem.innerHTML = externalHTML;
                        groupsUL.appendChild(listItem)
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
})

groupsUL.addEventListener("click", (event) => {
    window.localStorage.setItem("currentChat", event.target.innerText);
    messagesUL.innerHTML = null;
    updateChat();
    document.getElementById("groups-wrapper").classList.add("hidden");
    groupsUL.innerHTML = null;
})

exitInbox.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("groups-wrapper").classList.add("hidden");
    groupsUL.innerHTML = null;
})

get(child(dbRef, "requests/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
        if (snapshot.exists()) {
            buttonForRequests.classList.add("red");
        }
    })
    .catch((error) => {
        console.error(error);
    });


buttonForRequests.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("requests-section").classList.remove("hidden");
    updateRequests();
})

requestsUL.addEventListener("click", (event) => {
    event.preventDefault();
    var chatName = event.target.value;
    if (event.target.innerText.trim() == "Yes") {
        joinTheGroup(chatName);
        addToChatsUserList(chatName);
        removeChosenRequest(chatName);
    }
    else {
        removeChosenRequest(chatName);
    }
})

exitRequests.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("requests-section").classList.add("hidden");
})

function joinTheGroup(chatName) {
    get(child(dbRef, "groups/" + chatName))
        .then((snapshot1) => {
            if (snapshot1.exists()) {
                get(child(dbRef, "users/" + window.localStorage.getItem("username")))
                    .then((snapshot2) => {
                        if (snapshot2.exists()) {
                            const createdRef = ref(database, "users/" + window.localStorage.getItem("username"));
                            const newRef = push(createdRef);
                            set(newRef, {
                                groupName: chatName,
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

function removeChosenRequest(chatName) {
    get(child(dbRef, "requests/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        if (innerValue == chatName) {
                            remove(child(dbRef, "requests/" + window.localStorage.getItem("username") + "/" + key));
                        }
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function updateRequests() {
    requestsUL.innerHTML = null;
    get(child(dbRef, "requests/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    var chatName = "";
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        if (innerKey === "chatToJoin") {
                            chatName = innerValue;
                        }
                    })
                    const listItem = document.createElement("li");
                    const externalHTML = `
            <p id="groupNameFromRequest" class="chatName">${chatName}</p>
                <div>
                <button id="yesButton" value="${chatName}">Yes</button>
                <button id="noButton" value="${chatName}">No</button>
              </div>
            `;
                    listItem.innerHTML = externalHTML;
                    requestsUL.appendChild(listItem);
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

get(child(dbRef, "notifications/" + window.localStorage.getItem("username")))
    .then((snapshot) => {
        if (snapshot.exists()) {
            buttonForNotifications.classList.add("red");
        }
    })
    .catch((error) => {
        console.error(error);
    });

buttonForNotifications.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("notification-section").classList.remove("hidden");
    updateNotifications();
});

function updateNotifications() {
    notificationsUL.innerHTML = null;
    get(child(dbRef, "notifications/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        console.log(innerKey);
                        const listItem = document.createElement("li");
                        const externalHTML = `
              <p class="chatName">${innerValue}</p>
              `;
                        listItem.innerHTML = externalHTML;
                        notificationsUL.appendChild(listItem);
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

exitNotifications.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("notification-section").classList.add("hidden");
});

notificationsUL.addEventListener("click", (event) => {
    get(child(dbRef, "notifications/" + window.localStorage.getItem("username")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        if (innerValue == event.target.innerText.trim()) {
                            remove(child(dbRef, "notifications/" + window.localStorage.getItem("username") + "/" + key));
                        }
                    })
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
})

function addToChatsUserList(chatName) {
    const createdRef = ref(database, "groups-users/" + chatName);
    const newRef = push(createdRef);
    set(newRef, {
        username: window.localStorage.getItem("username"),
    });
}

function updateChat() {
    get(child(dbRef, "groups/" + window.localStorage.getItem("currentChat")))
        .then((snapshot) => {
            if (snapshot.exists()) {
                Object.entries(snapshot.val()).forEach(([key, value]) => {
                    var usern = "";
                    var text = "";
                    var date = "";
                    var likes = "";
                    Object.entries(value).forEach(([innerKey, innerValue]) => {
                        if (innerKey === "username") {
                            usern = innerValue;
                        }
                        if (innerKey === "text") {
                            text = innerValue;
                        }
                        if (innerKey === "date") {
                            date = innerValue;
                        }
                        if (innerKey === "likes") {
                            likes = innerValue;
                        }
                    })
                    const listItem = document.createElement("li");
                    listItem.classList.add("message");
                    if (usern === window.localStorage.getItem("username")) {
                        const externalHTML = `
                <button id="updateMessage" class="updateMessage" value="update"><i class="fa fa-pencil"></i></button>
                <button id="deleteMessage" class="deleteMessage" value="delete"><i class="fa fa-trash"></i></button>
                <p class="username">${usern}</p>
                <p class="date-time">${new Date(date).toLocaleString()}</p>
                <p class="text">${text}</p>
                <button id="likes" value="likes"><i class="fa fa-heart"></i> ${likes}</button>
                <button id="dislikes" value="dislikes"><i class="fa fa-thumbs-down"></i></button>
                `;
                        listItem.innerHTML = externalHTML;
                    } else {
                        const externalHTML = `
                <p class="username">${usern}</p>
                <p class="date-time">${new Date(date).toLocaleString()}</p>
                <p class="text">${text}</p>
                <button id="likes" value="likes"><i class="fa fa-heart"></i> ${likes}</button>
                <button id="dislikes" value="dislikes"><i class="fa fa-thumbs-down"></i></button>
                `;
                        listItem.innerHTML = externalHTML;
                    }
                    messagesUL.appendChild(listItem);
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
}


