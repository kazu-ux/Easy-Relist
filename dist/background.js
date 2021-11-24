"use strict";
let count = 0;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    if (changeInfo.status === 'complete' &&
        ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('https://jp.mercari.com/item/'))) {
        count += 1;
        // clearTimeout(timer);
        if (count === 4) {
            count = 0;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['dist/sold_page_script.js'],
            });
            console.log(tab);
        }
    }
});
