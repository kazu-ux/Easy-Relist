"use strict";
let activeTabIndex;
let newTabId;
let openerTabId;
//取引ページに再出品ボタンを設置する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    if (changeInfo.status === 'complete' &&
        ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('https://jp.mercari.com/transaction/'))) {
        console.log(tab);
        activeTabIndex = tab.index;
        openerTabId = tabId;
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
//出品ページタブを閉じた際に、開いたタブをアクティブにする
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (tabId === newTabId) {
        chrome.tabs.update(openerTabId, { active: true });
        console.log({ tabId, removeInfo });
    }
});
chrome.runtime.onMessage.addListener((obj) => {
    switch (obj.sender) {
        case 'tradingPage':
            //メルカリ商品ページを開く
            chrome.tabs.create({
                active: true,
                index: activeTabIndex + 1,
                url: obj.url,
            }, (tab) => {
                const tabId = tab.id;
                if (!tabId) {
                    console.log('tabIdが取得できませんでした');
                    return;
                }
                newTabId = tabId;
                //メルカリ商品ページタブの情報を定期的に取得する
                const interval = setInterval(() => {
                    //現在開いているタブの読み込み状態を取得する
                    chrome.tabs.get(tabId, (tab) => {
                        //読み込みが完了したら…
                        if (tab.status === 'complete') {
                            clearInterval(interval);
                            //スクリプトファイルとCSSを注入する
                            chrome.scripting.insertCSS({
                                target: { tabId: tabId },
                                files: ['css/all_hidden.css'],
                            });
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
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
            //メルカリ出品ページタブの情報を定期的に取得する
            const interval = setInterval(() => {
                //現在開いているタブの読み込み状態を取得する
                chrome.tabs.get(newTabId, (tab) => {
                    const tabId = tab.id;
                    if (!tabId) {
                        console.log('tabIdが取得できませんでした');
                        return;
                    }
                    //読み込みが完了したら…
                    if (tab.status === 'complete') {
                        clearInterval(interval);
                        //スクリプトファイルを注入する
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['dist/create_page_script.js'],
                        }, () => {
                            //メルカリ出品ページにproductInfoを送る
                            chrome.tabs.sendMessage(tabId, obj.productInfo);
                        });
                    }
                });
                console.log('create繰り返し');
            }, 1000);
            break;
        default:
            break;
    }
});
