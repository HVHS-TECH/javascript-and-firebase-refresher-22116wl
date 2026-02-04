import { fb_initialise, fb_authenticate, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete, getAuth } from './fb.mjs';

async function writeData() {
    await fb_write("Value", document.getElementById("fbWriteInput").value);
    

    auth = getAuth()
    if (auth == null) {
        await fb_write("User", "Anonymous");
    } else {
        console.log(auth);
    }
}

async function readData() {
    document.getElementById("welcomeMessage").innerHTML = await fb_read("Value");
}

window.fb_authenticate = fb_authenticate;
window.fb_logout = fb_logout;
window.fb_read = fb_read;
window.fb_write = fb_write;
window.fb_update = fb_update;
window.fb_readSorted = fb_readSorted;
window.fb_delete = fb_delete;

window.writeData = writeData;
window.readData = readData;