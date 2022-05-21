function article_to_html(article) {
}

async function load_topics() {
    // topics example
    let topics = [
        ["hello", "working"],
    ];

    //let res = await fetch("https://iq.opengenus.org/");
    //res = await res.text();
    return topics;
}

chrome.runtime.onInstalled.addListener( function () {
    // set settings
    chrome.storage.sync.set(
        {
            "theme" : "light",
            "refresh_time" : 1,
            "notif_verbosity" : 2,
            "load" : {
                "load_all" : true,
                "load_num" : 0
            }
        }
    );
    // last time opened
    chrome.storage.local.set({
        "last": Date.now()
    });

    // topics
    load_topics().then(topics => {
        chrome.storage.local.set( {
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
        "title" : "Open OpenGenus",
    });
});

// When alarm goes off Notify user to use IQNotify.
chrome.alarms.onAlarm.addListener( function (alarm) {
    chrome.storage.local.get(["last"], (settings) => {
        let day = parseInt((Date.now() - settings.last) / 86400000);
        let s = "";
        if (day > 1) {
            s = "'s";
        }
        chrome.notifications.create({
            "type": "basic",
            "title": "IQNotify reminder",
            "message": "It's been " + day + " day" + s + " seens you opened up IQNotify.",
            "iconUrl": "./static/icon32x32.png",
        });
    });
    console.log(alarm);
});

// Opening popup.html onclick of contextMenu
chrome.contextMenus.onClicked.addListener(
    (_a, _b) => {
        chrome.tabs.create({
            "active": true,
            "url": "popup.html"
        });
    }
);

// opening popup.html onclick of notification
chrome.notifications.onClicked.addListener( (_a, _b) => {
    chrome.tabs.create({
        "active": true,
        "url": "popup.html"
    });
});
