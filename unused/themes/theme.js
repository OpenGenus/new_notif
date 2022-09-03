// THEME FUNCTIONS
function load_theme_from_json(theme) {
    theme.forEach(
        (change) => {
            let elementList = document.querySelectorAll(change.query);
            // add properties for elements
            elementList.forEach((element) => {
                // now properties to element
                change.properties.forEach((property) => {
                    element.style[property[0]] = property[1];
                });
            });
        }
    );
}

function load_theme(theme_name, page_name) {
    let theme_url = chrome.runtime.getURL("./themes/" + theme_name + "_" + page_name + ".json");
    fetch(theme_url)
        .then((res) => res.json())
        .then((theme) => load_theme_from_json(theme));
}
// ENDING
// THEME FUNCTIONS
