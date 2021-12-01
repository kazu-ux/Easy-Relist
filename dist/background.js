"use strict";
let activeTabIndex;
//取引ページに再出品ボタンを設置する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    if (changeInfo.status === 'complete' &&
        ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('https://jp.mercari.com/transaction/'))) {
        console.log(tab);
        activeTabIndex = tab.index;
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['dist/trading_page.js'],
        });
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['css/style.css'],
        });
    }
});
let newTabId = 0;
//productInfoを取得したら商品ページを閉じる
chrome.runtime.onMessage.addListener((obj) => {
    switch (obj.sender) {
        case 'tradingPage':
            //メルカリ商品ページを開く
            chrome.tabs.create({
                active: true,
                index: activeTabIndex + 1,
                url: obj.url,
            }, (tab) => {
                newTabId = tab.id;
                //メルカリ商品ページタブの情報を定期的に取得する
                const interval = setInterval(() => {
                    //現在開いているタブの読み込み状態を取得する
                    chrome.tabs.get(tab.id, (tab) => {
                        //読み込みが完了したら…
                        if (tab.status === 'complete') {
                            clearInterval(interval);
                            //スクリプトファイルを注入する
                            chrome.scripting.insertCSS({
                                target: { tabId: tab.id },
                                files: ['css/all_hidden.css'],
                            });
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ['dist/sold_page_script.js'],
                            });
                        }
                    });
                    console.log('sold繰り返し');
                }, 1000);
            });
            break;
        case 'soldPage':
            console.log(newTabId);
            if (newTabId !== 0) {
                //メルカリ出品ページタブの情報を定期的に取得する
                const interval = setInterval(() => {
                    //現在開いているタブの読み込み状態を取得する
                    chrome.tabs.get(newTabId, (tab) => {
                        // newTabId = 0;
                        //読み込みが完了したら…
                        if (tab.status === 'complete') {
                            clearInterval(interval);
                            //スクリプトファイルを注入する
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ['dist/create_page_script.js'],
                            }, () => {
                                //メルカリ出品ページにproductInfoを送る
                                chrome.tabs.sendMessage(tab.id, obj.productInfo);
                            });
                        }
                    });
                    console.log('create繰り返し');
                }, 1000);
            }
            break;
        default:
            break;
    }
});
