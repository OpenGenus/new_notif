// Declared codes, (code that only runs when called)
let checked_checklist = JSON.parse(localStorage.getItem('checklist')) || [];
//
const minutes_day = 1440;
const topics = document.getElementById("tab-topics");
const to_settings_btn = document.getElementById("btn");
to_settings_btn.addEventListener('click', () => {
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
    topics.innerHTML = topics.innerHTML +
        card;
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

function get_topic(topic) {
    return `<div class='topic'>
               <div class="topic-head">
                  <h3 class="topic-title">
                  <input id='${topic.title.replace(/\s+/gm,'').toLowerCase()}' type="checkbox">
                     ${topic.title}
                  </h3>
                  <label class="plus-minus-btn">
                     <input class="plus-minus-checkbox" type="checkbox">
                     <span class="vertical"></span>
                     <span class="horizontal"></span>
                  </label>
               </div>
               <p class="topic-desc topic-hide">
                   ${topic.info}
               </p>
           </div>
`;
}

function get_subtopics(subtopics) {
    let topics = "";
    subtopics.forEach((topic) => {
        topics += "\n" + get_topic(topic);
    });
    return `<div class='sub-topics'> ${topics} </div>`;
}

function get_container(container) {
    let title = `<h1 class='container-title'>${container.checklist_title}</h1>`;
    let subtopics = get_subtopics(container.sub_titles);
    return `<div class='container'>
               ${title}
               ${subtopics}
            </div>`;
}

fetch(url)
    .then((res) => res.json())
    .then((checklist) => {
        checklist.forEach((container) => {
            checklist_tab.innerHTML += get_container(container);
        });
    })
    .then(() => {
        let checklist_checkbox = document.getElementsByClassName("plus-minus-checkbox");
        let checklist_topic_descs = document.getElementsByClassName("topic-desc");
        let checklist_topic_title = document.getElementsByClassName("topic-title");
        let checklist_topic_head = document.getElementsByClassName("topic-head");
        let topic_checkbox = document.querySelectorAll(".topic-title input");
        for (let i = 0; i < 100; i++) {
            // EL to animate .topic-info
            checklist_topic_head[i].addEventListener('click', function() {
                checklist_topic_descs[i].classList.toggle("topic-hide");
                checklist_checkbox[i].checked = !(checklist_checkbox[i].checked);
            });
            checklist_checkbox[i].addEventListener('change', function() {
                checklist_topic_descs[i].classList.toggle("topic-hide");
            });
            // EL to add (if done or not) to storage sync.
            topic_checkbox[i].addEventListener('change', function() {
                if (this.checked) {
                    checked_checklist.push(this.id);
                } else {
                    checked_checklist.pop(this.id);
                }
                let stringified = JSON.stringify(checked_checklist);
                localStorage.setItem('checklist', stringified);
                // also storing for someone with sync enabled.
                chrome.storage.sync.set({
                    "checklist": stringified
                });
            });
        }
        // check the boxes
        checked_checklist.forEach((checkbox) => {
            document.getElementById(checkbox).checked = true;
        });
    });

// Loading theme after all above pre-loading
chrome.storage.sync.get(["theme"], (settings) => {
    load_theme(settings.theme, "popup");
});

// theme should be loaded on change of theme.
chrome.storage.onChanged.addListener(
    (changes, areaname) => {
        if (changes.theme != null) {
            load_theme(changes.theme.newValue, "popup");
        }
    }
);
