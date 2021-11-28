"use strict";
let count = 0;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    if (changeInfo.status === 'complete' &&
        ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('https://jp.mercari.com/item/'))) {
        count += 1;
        if (count === 4) {
            count = 0;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['dist/sold_page_script.js'],
            });
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ['style.css'],
            });
        }
    }
});
chrome.runtime.onMessage.addListener((productInfo) => {
    //メルカリ出品ページを開く
    chrome.tabs.create({
        active: true,
        url: 'https://jp.mercari.com/sell/create',
    }, (tab) => {
        //メルカリ出品ページタブの情報を定期的に取得する
        const interval = setInterval(() => {
            //現在開いているタブの読み込み状態を取得する
            chrome.tabs.get(tab.id, (tab) => {
                //読み込みが完了したら…
                if (tab.status === 'complete') {
                    clearInterval(interval);
                    //スクリプトファイルを注入する
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['dist/create_page_script.js'],
                    }, () => {
                        //メルカリ出品ページにproductInfoを送る
                        chrome.tabs.sendMessage(tab.id, productInfo);
                    });
                }
            });
            console.log('新しいタブ繰り返し');
        }, 500);
    });
    console.log(productInfo);
});
