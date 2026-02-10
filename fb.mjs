//**************************************************************/
// Written by Wilfred Leicester, Mostly in Term 2 2025 and copied, but modified slighty in some places.
//
// All variables & function begin with fb_  all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/


import { initializeApp }        from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, runTransaction, set, get, ref, update, query, orderByChild, push, onValue, limitToFirst, limitToLast, onChildChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var fb_db;

function fb_initialise() {
    const FB_CONFIG = {
        apiKey: "AIzaSyC3SEWaaB6Z8FY0k2wVAfKgJiulJ8tSyzw",
        authDomain: "wilfred-leicester-13comp.firebaseapp.com",
        databaseURL: "https://wilfred-leicester-13comp-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "wilfred-leicester-13comp",
        storageBucket: "wilfred-leicester-13comp.firebasestorage.app",
        messagingSenderId: "473035912381",
        appId: "1:473035912381:web:e3300f1c7987e4b8ad33d4",
        measurementId: "G-1T18Z6JET6"
    };

    fb_db = getDatabase(initializeApp(FB_CONFIG));
    console.info(fb_db);
}

fb_initialise();


async function fb_authenticate() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    
    // The following makes Google ask the user to select the account
    return new Promise((resolve) => {
        (async() => {

            PROVIDER.setCustomParameters({
                prompt: 'select_account'
            });

            try {
                const result = await signInWithPopup(AUTH, PROVIDER);
                
                if (result != null) {
                    console.log(result);
                    resolve(result);
                }
                
            } catch(error) {
                console.log('error!');
                console.log(error);
                resolve(null);
            };
        })();
    });
}

function fb_authChanged() {
    const AUTH = getAuth();

    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            console.log(AUTH.currentUser.displayName + ' logged in');
            sessionStorage.setItem('UID', AUTH.currentUser.uid);
        } else {
            console.log('log out');
            sessionStorage.removeItem('UID');
        }
    }, (error) => {
        console.log('error!');
        console.log(error);
    });
}

//fb_authChanged();

function fb_logout() {
    const AUTH = getAuth();

    return new Promise((resolve) => {
        signOut(AUTH).then(() => {
            resolve(true);
            console.log('successful logout');
        })
    
        .catch((error) => {
            resolve(null);
            console.log('error in loging out');
            console.log(error);
        });
    });
}

function fb_write(path, data) {
    const REF = ref(fb_db, path);

    return new Promise((resolve) => {
        set(REF, data).then(() => {
            console.log('written successfully!');
            resolve(true);
        }).catch((error) => {
            console.log('error');
            console.log(error);
            resolve(false);
        });
    });
}

function fb_push(path) {
    const REF = ref(fb_db, path);
    return push(REF);
}

function fb_delete(data) {
    const CONFIG = {
        apiKey: "AIzaSyBNDhyKyF4h86o_xE3AY_e51-vB6gAUX1g",
        authDomain: "comp-2025-joshua-k-h.firebaseapp.com",
        databaseURL: "https://comp-2025-joshua-k-h-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "comp-2025-joshua-k-h",
        storageBucket: "comp-2025-joshua-k-h.firebasestorage.app",
        messagingSenderId: "695585659485",
        appId: "1:695585659485:web:a965ad296454cd022f0bb4",
        measurementId: "G-BZX0JJYC05"
    };

    var db = getDatabase(initializeApp(CONFIG));
    
    set(ref(db, "/"), data).then(() => {
        console.log('written successfully!');
    }).catch((error) => {
        console.log('error');
        console.log(error);
    });
}

async function fb_read(path) {
    const REF = ref(fb_db, path);

    return new Promise((resolve) => {
        get(REF).then((snapshot) => {
            var fb_data = snapshot.val();
    
            if (fb_data != null) {
                resolve(fb_data);
            } else {
                console.log('no data found');
                resolve(null);
            }
    
        }).catch((error) => {
            console.log('error in reading database');
            resolve(null);
        });
    });


}

function fb_update(path, data) {
    console.log("UPDATED IT WORKS");
    const REF = ref(fb_db, path);

    runTransaction(REF, (currentValue) => {
        return (currentValue || 0) + data;
    });

    /*
    update(REF, data).then(() => {
        console.log('updated successfully')
    }).catch((error) => {
        console.log('error');
        console.log(error);
    });
    */
}


async function fb_readSorted(path, sortkey, number) {
    const dbReference = ref(fb_db, path) ;
    
    return new Promise((resolve) => {
        get(query(dbReference, orderByChild(sortkey), limitToLast(number))).then((snapshot) => {
            var fb_data = snapshot.val();
            
            if (fb_data != null) {
                //const LENGTH = Object.keys(snapshot.val()).length
                
                //put the values into array format
                var valueArray = [];
                snapshot.forEach((entry) => {
                    
                    const valObject = {
                      [entry.key]: entry.val()[sortkey]
                    };
                    
                    valueArray.unshift( valObject ); //unshift used to put values at start of array and move everythign else forward (reversing the array which is given backwards by firebase)
                });

                console.log('successful read');
                resolve(valueArray);
            } else {
                console.log('no data found');
                resolve(null);
            }
        }).catch((error) => {
            console.log('error!');
            console.log(error);
            resolve(null);
        });
    });
}

async function valChanged(path, callback) {
    const messageQuery = query(ref(fb_db, path), orderByChild(`timestamp`))
    
    onValue(messageQuery, (snapshot) => {
        const DATA = snapshot.val();
        const MESSAGES = Object.entries(DATA); 
        
        callback(MESSAGES);
    })
    
}

async function fb_valChanged(path, callback) {
    const dbReference = ref(fb_db, path);

    onChildChanged(dbReference, (snapshot) => {
        console.log(path);
        /*
        const newScore = snapshot.val();
        const playerKey = snapshot.key;
        */

        callback(snapshot.key);
    });
}

async function changeLog() {
	if (sessionStorage.getItem('UID') == null) {
        return new Promise((resolve) => {
            (async () => {
                const userData = await fb_authenticate();
                resolve (userData);
            })();
        });
	} else {
        return new Promise((resolve) => {
            (async () => {
                const logOut = await fb_logout();
                resolve (logOut);
            })();
        });
	}
}

function fb_getAuthData() {
    return getAuth();
}



export { fb_initialise, fb_authenticate, fb_authChanged, fb_logout, fb_write, fb_read, fb_update, fb_readSorted, fb_delete, fb_valChanged, changeLog, fb_getAuthData, getAuth, fb_push, valChanged };