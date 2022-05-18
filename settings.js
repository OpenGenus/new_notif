const to_home_btn = document.getElementById("btn");
to_home_btn.addEventListener('click', ()=> {
    chrome.tabs.create({
        "active": true,
        "url": "popup.html"
    });
});
