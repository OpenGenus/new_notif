const theme_checkbox = document.getElementById("theme_checkbox");
const time_option = document.getElementById("time");
const radio_minimal = document.getElementById("radio-0");
const radio_medium = document.getElementById("radio-1");
const radio_full = document.getElementById("radio-2");
// const load_all = document.getElementById("load-all");
// const load_by_num = document.getElementById("load-by-num");


// The page should show the current settings when loaded....
chrome.storage.sync.get(["theme", "load", "notif_verbosity", "refresh_time"], (settings) => {
    // const notif = settings.notif_verbosity;
    const re_time = settings.refresh_time;

    theme_checkbox.checked = (settings.theme === "dark");
    load_theme(settings.theme, "settings");

    //
    // let load = settings.load;
    // if (load.load_all) {
    //     load_all.checked = true;
    // } else {
    //     load_all.checked = false;
    //     load_by_num.value = load.load_num;
    // }

    // notification verbosity
    // document.getElementById("radio-" + notif).checked = true;
    var s = "s";
    if (re_time <= 1) {
        s = "";
    }
    time_option.value = re_time + " day" + s;
});

// SETTINGS
// setting steps
// 1. event occured
// 2. detect and store the change to sync storage

// theme light/dark
theme_checkbox.addEventListener('change', function() {
    var theme = "";
    if (this.checked) {
        theme = "dark";
    } else {
        theme = "light";
    }
    chrome.storage.sync.set({
        "theme": theme
    });
});

// refresh and remind (days)
time.addEventListener('change', function() {
    var selected_time = parseInt(this.value[0]);
    console.log(selected_time);
    if (selected_time < 10 && selected_time > 0) {
        chrome.storage.sync.set({
            "refresh_time": selected_time
        });
    }
});

// Notification verbosity level
// radio_minimal.addEventListener('click', () => {
//     chrome.storage.sync.set({
//         "notif_verbosity" : 0
//     });
// });
// radio_medium.addEventListener('click', () => {
//     chrome.storage.sync.set({
//         "notif_verbosity": 1
//     });
// });
// radio_full.addEventListener('click', () => {
//     chrome.storage.sync.set({
//         "notif_verbosity": 2
//     });
// });

// Load all / load _ No. of recent articles
// require function keyword to use "this".
// load_all.addEventListener('click', function () {
//     // temp code
//     if (this.checked) {
//         chrome.storage.sync.set({
//             "load" : {
//                 "load_all" : true,
//                 "load_num" : 0
//             }
//         });
//     } else {
//         chrome.storage.sync.set({
//             "load": {
//                 "load_all": false,
//                 "load_num": parseInt(load_by_num.value)
//             }
//         });
//     }
// });

// load_by_num.addEventListener('change', function () {
//     if (!load_all.checked) {
//         chrome.storage.sync.set({
//             "load": {
//                 "load_all": false,
//                 "load_num": parseInt(load_by_num.value)
//             }
//         });
//     }
// });

// theme should be loaded on change of theme.
chrome.storage.onChanged.addListener(
    (changes, _areaname) => {
        if (changes.theme.newValue != undefined) {
            load_theme(changes.theme.newValue, "settings");
            theme_checkbox.checked = (changes.theme.newValue === "dark");
        }
    }
);