chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.tabs.create({
        url: 'app/index.html'
    });
});