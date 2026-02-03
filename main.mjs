import { fb_initialise, fb_authenticate, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete } from './fb.mjs';

fb_initialise();

async function writeData() {
    await fb_write("Value", document.getElementById("fbWriteInput").value);
}

async function readData() {
    await fb_read("Value")
    document.getElementById("")
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