function article_to_html(article) {}

async function load_topics() {
    // topics example
    let topics = [
        ["hello", "working"],
    ];

    //let res = await fetch("https://iq.opengenus.org/");
    //res = await res.text();
    return topics;
}

chrome.runtime.onInstalled.addListener(function() {
    // set settings
    chrome.storage.sync.set({
        "last": Date.now(),
        "theme": "light",
        "refresh_time": 1,
        "notif_verbosity": 2,
        "load": {
            "load_all": true,
            "load_num": 0
        }
    });

    chrome.storage.local.set({
        "session_start": 0
    });

    // loading checklist. if available
    chrome.storage.sync.get(['checklist'], (store) => {
        if(store.checklist === undefined){
            localStorage.setItem('checklist', '[]');
        } else {
            localStorage.setItem('checklist', JSON.stringify(store.checklist));
        }
    });

    // topics
    load_topics().then(topics => {
        chrome.storage.local.set({
            "topics": topics,
        });
    });

    // Initial alarm
    chrome.alarms.create("Initial Alarm", {
        "periodInMinutes": 1440
    });

    // contextMenu for easy access on extension
    chrome.contextMenus.create({
        "id": "open_iq",
        "contexts": ["all"],
        "title": "Open OpenGenus",
    });
});

// Notifying if time the chose time for notification has been exceeded
chrome.runtime.onStartup.addListener(
    function() {
        chrome.storage.local.set({
            "session_start": Date.now()
        });
        chrome.storage.sync.get(["last", "refresh_time"],
            (settings) => {
                let last = settings.last;
                let refresh_day = settings.refresh_time;
                // days passed since last opened.
                let days = parseInt((Date.now() - last) / 86400000);
                // clear Alarms if there are from previous session.
                chrome.alarms.clearAll();
                // Now new alarm that should be fired with some delay.
                if (days >= refresh_day) {
                    chrome.alarms.create("A delay Alarm", {
                        "delayInMinutes": 0 // default time for now.
                    });
                    console.log("created alarm!");
                }
            });
    }
);

// When alarm goes off Notify user to use IQNotify.
// with a delay.
chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("alarm went off!");
    chrome.storage.local.get(["session_start"], (settings) => {
        let session_ago = parseInt((settings.session_start - Date.now()) / 60000);
        if (session_ago <= 30) {
            console.log(session_ago);
        }
        if (alarm.name == "A delay Alarm") {
            if (session_ago >= 30) {
                chrome.storage.local.get(["last"], (settings) => {
                    last = settings.last;
                    let day = parseInt((Date.now() - last) / 86400000);
                    // days or day
                    let s = () => {
                        if (day > 1) {
                            return "s";
                        } else {
                            return "";
                        }
                    };
                    chrome.notifications.create({
                        "type": "basic",
                        "title": "IQNotify reminder",
                        "message": "It's been " + day + " day" + s() + " seens you opened up IQNotify.",
                        "iconUrl": "./static/icon32x32.png",
                    });
                });
            }
        } else if (alarm.name == "Initial Alarm") {
            chrome.notifications.create({
                "type": "basic",
                "title": "IQNotify reminder",
                "message": "You haven't opened the IQNotify, Click on this to open it now.",
                "iconUrl": "./static/icon32x32.png",
            });
        } else {
            console.log("Alarm Issue!");
            console.log(alarm);
            chrome.notifications.create({
                "type": "basic",
                "title": "test Notif",
                "message": alarm.name,
                "iconUrl": "./static/icon32x32.png"
            });
        }
    });
});

[chrome.contextMenus, chrome.notifications, chrome.action].forEach((wannabe_on_click_tab) => {
    wannabe_on_click_tab.onClicked.addListener(
        () => {
            chrome.tabs.create({
                "active": true,
                "url": "popup.html"
            });
        }
    );
});
