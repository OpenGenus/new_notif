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

// function get_topics(topics) {
//     let topics_head = "<div class='topic'>\n";
//     topics.forEach((topic) => {
//         let topic_heading = `<div class='topic-head'>
//                             <input type='checkbox'>
//                             <h3 class='topic-title'>\n${topic.title}
//                             </h3>
//                             <label class='plus-minus-btn'>
//                                 <input class='plus-minus-checkbox' type='checkbox'>
//                                 <span class='vertical'></span>
//                                 <span class='horizontal'></span>
//                             </label>
//                         </div>\n`;
//         let topic_info = `<p class='topic-desc topic-hide'>${topic.info}</p></div>\n`;
//         topics_head += topic_heading + topic_info;
//     });
//     return topics_head + "\n</div>";
//    }

// function get_subtopics(subtopics) {
//     let subtopics_head = "<div class='sub-topics'>\n";
//     let topics = get_topics(subtopics);
//     let subtopics_tail = "\n</div>";
//     return subtopics_head + topics + subtopics_tail;
// }

// function get_container(container) {
//     let container_head = "<div class='container'>\n";
//     let container_title = "<h1 class='container-title'>" + container.checklist_title + "</h1>";
//     let sub_topics = get_subtopics(container.sub_titles);
//     let container_tail = "\n</div>";
//     return container_head + container_title + sub_topics + container_tail;
// }

function get_topic(topic) {
    return `<div class='topic'>
               <div class="topic-head">
                  <input type="checkbox">
                  <h3 class="topic-title">
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
        // console.log(checklist_checkbox);
        // console.log(checklist_topic_descs);
        for (let i = 0; i < checklist_checkbox.length; i++) {
            // console.log(checklist_topic_descs[topic]);
            // console.log(checklist_topic_descs[i].classList.toggle("topic-hide"));
            checklist_checkbox[i].addEventListener('change', function () {
                console.log(this);
                console.log(checklist_topic_descs[i].classList.toggle("topic-hide"));
            });
        }
    });

