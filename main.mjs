import { fb_authenticate, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete, getAuth, fb_getAuthData, fb_push, fb_valChanged, valChanged, fb_db } from './fb.mjs';


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

    if (auth.currentUser == null) {
        UID = "Anonymous";
        UserName = "Anonymous";
    } else {
        UID = auth.currentUser.uid;
        UserName = auth.currentUser.displayName;
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


async function changeLog() {
    var auth = getAuth();

    if (auth.currentUser == null) {
        login();
    } else {
        logout();       
    }
}


const LOG_BUTTON = document.getElementById('logButton');

async function login() {
    LOG_BUTTON.disabled = true;

    const AUTH = await fb_authenticate();
    const UID = AUTH.user.uid;

    if (await fb_read('/Users/' + UID) == null) {
        fb_write('/Users/' + UID, AUTH.user.displayName)
    }

    document.getElementById('logStatus').innerHTML = "You are logged in as " + getAuth().currentUser.displayName;
    LOG_BUTTON.innerHTML = "Log Out";
    LOG_BUTTON.disabled = false;
}

async function logout() {
    LOG_BUTTON.disabled = true;

    await fb_logout();

    document.getElementById('logStatus').innerHTML = "You are not logged in";
    LOG_BUTTON.innerHTML = "Log In";
    LOG_BUTTON.disabled = false;
}


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

window.changeLog = changeLog;
window.postMessage = postMessage;

window.fb_read = fb_read;
window.fb_write = fb_write;
window.fb_update = fb_update;
window.fb_readSorted = fb_readSorted;
window.fb_delete = fb_delete;
window.changeHeading = changeHeading;


//initialise login status
var _authLALALA = getAuth();

setTimeout(function() {
    console.log(_authLALALA);
    console.log(_authLALALA.currentUser);
    if (_authLALALA.currentUser != null) {
        console.log('logged in');
        LOG_BUTTON.innerHTML = "Log Out";
        document.getElementById('logStatus').innerHTML = "You are logged in as " + _authLALALA.currentUser.displayName;
    } else {
        LOG_BUTTON.innerHTML = "Log In";
        document.getElementById('logStatus').innerHTML = "You are not logged in";
    }
    
    LOG_BUTTON.disabled = false;
}, 700);

