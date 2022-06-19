// Declared codes, (code that only runs when called)
const minutes_day = 1440;
const topics = document.getElementById("tab-topics");
const to_settings_btn = document.getElementById("btn");
to_settings_btn.addEventListener('click', ()=> {
    chrome.tabs.create({
        "active": true,
        "url": "settings/settings.html"
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
    last: Date.now()
});

// Setting Alarm
// Destroy first if there is any.
chrome.alarms.clearAll();

// chrome.storage.local.get(["topics"], (cards) => {
//     cards = cards.topics;
//     for (let i in cards) {
//         append_topic(cards[i]);
//     }
// });


// Create checklist
const checklist_tab = document.getElementById("tab-checklist");
const url = chrome.runtime.getURL("./checklist.json");
fetch(url)
    .then((res) => res.json())
    .then((checklist) => {
        console.log(checklist);
    });
