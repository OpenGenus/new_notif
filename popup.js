// Declared codes, (code that only runs when called)

const hours_day = 24;
const millis_hour = 3600000;
const minutes_hour = 60;
const millis_minute = 60000;
const settings_src = "./static/gear.png";
const topic_src = "./static/back.png";
const topics = document.getElementById("tab-topics");
const settings = document.getElementById("tab-settings");
const change_btn = document.getElementById("btn");
const btn_img = document.getElementById("btn-img");
let hidden = "tab";
//
change_btn.addEventListener("click", () => {
    if (hidden === "settings") {
        hidden = "topics";
        // button
        btn_img.alt = "Settings";
        btn_img.src = settings_src;
        // tabs
        settings.classList = ["tab", " hidden"];
        topics.classList = ["tab"];
    } else {
        hidden = "settings";
        // button
        btn_img.alt = "Topics";
        btn_img.src = topic_src;
        // tabs
        settings.classList = ["tab"];
        topics.classList = ["tab", " hidden"];
    }
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
        console.log();
    }
});
chrome.storage.sync.get(["settings"], (settings) => {
    let time = settings.settings.refresh_time * minutes_hour * hours_day;
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
