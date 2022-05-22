// Declared codes, (code that only runs when called)

const minutes_day = 1440;
const topics = document.getElementById("tab-topics");
const to_settings_btn = document.getElementById("btn");
to_settings_btn.addEventListener('click', ()=> {
    chrome.tabs.create({
        "active": true,
        "url": "settings.html"
    });
});

// function to write topics on popup.html
function append_topic(topic) {
    let card = "";
    for (let a in topic) {
        card = card + "<br>" + topic[a];
    }
    topics.innerHTML = topics.innerHTML
        + card;
}

// ENDING of declared codes.

// Since this runs everytime user opens the popup
// So, noting the time.
chrome.storage.local.set({
    "last": Date.now()
});

// Setting Alarm
// Destroy first if there is any.
chrome.alarms.clearAll((done) => {
    if (!done) {
        console.log("Clearing Alarm: \n" + chrome.runtime.lastError.message);
    }
});

chrome.storage.sync.get(["refresh_time"], (settings) => {
    let time = settings.refresh_time * minutes_day;
    console.log(time);
    chrome.alarms.create({
        "periodInMinutes": time
    });
});


// chrome.action.setBadgeText({text: "1"});
// chrome.notifications.getPermissionLevel(level => {console.log(level);});

chrome.storage.local.get(["topics"], (cards) => {
    cards = cards.topics;
    for (let i in cards) {
        append_topic(cards[i]);
    }
});


