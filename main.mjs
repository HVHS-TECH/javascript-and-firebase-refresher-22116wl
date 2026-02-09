import { fb_authenticate, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete, getAuth, fb_valChanged } from './fb.mjs';


var messageSpace = document.getElementById("welcomeMessage");
messageSpace.innerHTML = "You've connected to the JavaScript!";

function changeHeading() {
    document.getElementById("welcomeMessage").innerHTML = document.getElementById("titleChangerInput").value;
}



async function postMessage() {
    const auth = getAuth()
    var UID = "";
    console.log(auth);

    if (auth["currentUser"] == null) {
        UID = "Anonymous"
    } else {
        UID = auth["currentUser"]["uid"]
    }


    const KEY = fb_push(`/Messages`);
    fb_write(`/Messages/${KEY.key}`, {
        uid:  UID,
        text: document.getElementById("fbWriteInput").value,
        timestamp: Date.now(),
    });
}

async function login() {
    const AUTH = await fb_authenticate();
    const UID = AUTH['user']['uid']

    if (await fb_read('/Users/' + UID) == null) {
        x
    }
}

async function updateMessages() {
    var messages = await fb_read("/Messages/");
    console.log(messages);
}

fb_valChanged("/Messages/", function() {
    updateMessages();
    console.log('changed')
});

updateMessages();

window.updateMessages = updateMessages;

window.postMessage = postMessage;
window.login = login;
window.fb_logout = fb_logout;
window.fb_read = fb_read;
window.fb_write = fb_write;
window.fb_update = fb_update;
window.fb_readSorted = fb_readSorted;
window.fb_delete = fb_delete
window.changeHeading = changeHeading;