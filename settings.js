const radio_light_theme = document.getElementById("radio-light-theme");
const radio_dark_theme = document.getElementById("radio-dark-theme");
const time = document.getElementById("time");
const radio_minimal = document.getElementById("radio-minimal");
const radio_medium = document.getElementById("radio-medium");
const radio_full = document.getElementById("radio-full");
const load_all = document.getElementById("load-all");
const load_by_num = document.getElementById("load-by-num");

// SETTINGS
// setting steps
// 1. event occured
// 2. detect and store the change to sync storage
// 3. let background.js make the real time effects.
// theme light/dark
radio_dark_theme.addEventListener('click', () => {
    chrome.storage.sync.set({
        "theme": "dark"
    });
});
radio_light_theme.addEventListener('click', () => {
    chrome.storage.sync.set({
        "theme": "light"
    });
});

// refresh and remind (days)
time.addEventListener('change', function () {
    chrome.storage.sync.set({
        "refresh_time": this.value
    });
});

// Notification verbosity level
radio_minimal.addEventListener('click', () => {
    chrome.storage.sync.set({
        "notif_verbosity" : 0
    });
});
radio_medium.addEventListener('click', () => {
    chrome.storage.sync.set({
        "notif_verbosity": 1
    });
});
radio_full.addEventListener('click', () => {
    chrome.storage.sync.set({
        "notif_verbosity": 2
    });
});

// Load all / load _ No. of recent articles
// require function keyword to use "this".
load_all.addEventListener('click', function () {
    // temp code
    if (this.checked) {
        chrome.storage.sync.set({
            "load" : {
                "load_all" : true,
                "load_num" : 0
            }
        });
    } else {
        chrome.storage.sync.set({
            "load": {
                "load_all": false,
                "load_num" : load_by_num.value
            }
        });
    }
});

load_by_num.addEventListener('change', function () {
    chrome.storage.sync.set({
        "load": {
            "load_all": false,
            "load_num": 25
        }
    });
});
