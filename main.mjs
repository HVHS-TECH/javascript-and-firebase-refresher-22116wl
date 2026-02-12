import { fb_authenticate, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete, getAuth, fb_push, fb_valChanged, valChanged, fb_db } from './fb.mjs';
import { query, ref, orderByChild } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


var messageSpace = document.getElementById("welcomeMessage");
messageSpace.innerHTML = "You've connected to the JavaScript!";

function changeHeading() {
    document.getElementById("welcomeMessage").innerHTML = document.getElementById("titleChangerInput").value;
}



async function postMessage() {
    if (getAuth().currentUser == null) {
        alert('log in to send messages!');
        return;
    }

    console.log('psot')
    const auth = getAuth()
    var UID = "";
    var UserName = "";

    if (auth["currentUser"] == null) {
        UID = "Anonymous";
        UserName = "Anonymous";
    } else {
        UID = auth["currentUser"]["uid"];
        UserName = auth["currentUser"]["displayName"];
    }


    const KEY = fb_push(`/Messages`);
    fb_write(`/Messages/${KEY.key}`, {
        uid:  UID,
        userName: UserName,
        text: document.getElementById("fbWriteInput").value,
        timestamp: Date.now(),
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key == 'Enter' && document.getElementById("fbWriteInput").value != "") {
        postMessage();
        document.getElementById("fbWriteInput").value = "";
    }

});


async function login() {
    const AUTH = await fb_authenticate();
    const UID = AUTH['user']['uid']

    console.log(AUTH);

    if (await fb_read('/Users/' + UID) == null) {
        fb_write('/Users/' + UID, AUTH['user']['displayName'])
    }

    console.log(AUTH);

    if (AUTH != null) {
        document.getElementById('logOutButton').disabled = false;
        document.getElementById('logInButton').disabled = true;
    }
}

async function logout() {
    fb_logout();

    document.getElementById('logOutButton').disabled = true;
    document.getElementById('logInButton').disabled = false;
}

logout();

async function updateMessages(messages) {
    messageSpace = document.getElementById('messageSpace')
    messageSpace.innerHTML = "";

    for (var i = 0; i < messages.length; i++ ) {
        var message = messages[i][1];

        var newMessage = document.createElement('p');
        newMessage.innerHTML = message.userName + ": " + message.text

        messageSpace.appendChild(newMessage);
    }

    messageSpace.scrollTop = messageSpace.scrollHeight;
}

valChanged('/Messages', updateMessages);

window.postMessage = postMessage;
window.login = login;
window.logout = logout;
window.fb_read = fb_read;
window.fb_write = fb_write;
window.fb_update = fb_update;
window.fb_readSorted = fb_readSorted;
window.fb_delete = fb_delete
window.changeHeading = changeHeading;