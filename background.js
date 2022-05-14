function article_to_html(article) {
}

async function load_topics() {
    // topics example
    let topics = [
        ["hello", "working"],
    ];

    //let res = await fetch("https://iq.opengenus.org/");
    console.log("working...");
    //res = await res.text();
    return topics;
}

chrome.runtime.onInstalled.addListener( function () {
    // set settings
    chrome.storage.sync.set(
        {
            "settings": {
                "theme" : "light",
                "refresh_time" : 1,
            }
        }
    );
    chrome.storage.local.set({
        "last": Date.now()
    });
    console.log("Setting default settings");

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
            "iconUrl": "./icon32x32.png",
        });
    });
    console.log(alarm);
});

// Extra
chrome.runtime.onStartup.addListener( function () {
    // when browser starts up
});
// Extra
chrome.runtime.onSuspend.addListener( () => {
    chrome.action.setBadgeText({"text": ""});
});


// Extra
chrome.notifications.onClicked.addListener( () => {});
