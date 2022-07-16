// Declared codes, (code that only runs when called)
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

// ENDING of declared codes.

// Since this runs everytime user opens the popup
// So, noting the time.
chrome.storage.local.set({
    last: Date.now()
});

// Setting Alarm
// Destroy first if there is any.
chrome.alarms.clearAll();

// CHECKLIST requires lots of ELs
// and localStorage

function to_array(set) {
    let array = [];
    set.forEach((elem) => {
        array.push(elem);
    });
    return array;
}

function to_set(arr) {
    let set = new Set();
    arr.forEach((elem) => {
        set.add(elem);
    });
    return set;
}

let checklist_checkbox = document.getElementsByClassName("plus-minus-checkbox");
let checklist_topic_descs = document.getElementsByClassName("topic-desc");
let checklist_topic_title = document.getElementsByClassName("topic-title");
let checklist_topic_head = document.getElementsByClassName("topic-head");
let topic_checkbox = document.querySelectorAll(".topic-head input");
for (let i = 0; i < 100; i++) {
    // EL to animate .topic-info
    checklist_topic_title[i].addEventListener('click', function() {
        checklist_topic_descs[i].classList.toggle("topic-hide");
        checklist_checkbox[i].checked = !(checklist_checkbox[i].checked);
    });
    checklist_checkbox[i].addEventListener('change', function() {
        checklist_topic_descs[i].classList.toggle('topic-hide');
    });
}

chrome.storage.sync.get(["checklist"])
    .then((cl) => {
        let checked_checklist = (cl.checklist === undefined) ?
            new Set() :
            to_set(JSON.parse(cl.checklist));

        for (let i = 0; i < 100; i++) {
            // EL to add (if done or not) to storage sync.
            topic_checkbox[i].addEventListener('change', function() {
                if (this.checked) {
                    checked_checklist.add(this.id);
                    this.parentElement.getElementsByClassName("topic-title")[0].style['text-decoration'] = 'line-through';
                } else {
                    checked_checklist.delete(this.id);
                    this.parentElement.getElementsByClassName("topic-title")[0].style['text-decoration'] = 'none';
                }
                // A strike-through
                //
                let stringified = JSON.stringify(to_array(checked_checklist));
                localStorage.setItem('checklist', stringified);
                // also storing for someone with sync enabled.
                chrome.storage.sync.set({
                    "checklist": stringified
                });
            });
        }

        // check the boxes
        checked_checklist.forEach((checkbox_id) => {
            let checkbox = document.getElementById(checkbox_id);
            checkbox.checked = true;
            checkbox.parentElement.getElementsByClassName("topic-title")[0].style['text-decoration'] = 'line-through';
        });

    });


// Loading theme after all above pre-loading
chrome.storage.sync.get(["theme"], (settings) => {
    load_theme(settings.theme, "popup");
});

// theme should be loaded on change of theme.
chrome.storage.onChanged.addListener(
    (changes, _areaname) => {
        if (changes.theme != null) {
            load_theme(changes.theme.newValue, "popup");
        }
    }
);