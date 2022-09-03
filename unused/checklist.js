// Create checklist
const checklist_tab = document.getElementById("tab-checklist");
const url = chrome.runtime.getURL("./checklist.json");

function get_topic(topic) {
    return `<div class='topic'>
               <div class="topic-head">
                  <input id='${topic.title.replace(/\s+/gm,'').toLowerCase()}' type="checkbox">
                  <h3 class="topic-title">
                     ${topic.title}
                     <label class="plus-minus-btn">
                        <input class="plus-minus-checkbox" type="checkbox">
                        <span class="vertical"></span>
                        <span class="horizontal"></span>
                     </label>
                  </h3>
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
            console.log(checklist_tab.innerHTML);
        });
    });
