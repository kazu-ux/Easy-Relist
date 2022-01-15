import { sleep } from './sleep';

//取引ページに再出品ボタンを設置する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://jp.mercari.com/transaction/')
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['trading_page.js'],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['css/style.css'],
    });
  }
  /// 開発用
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://fril.jp/item/new')
  ) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['rakuma_sell_page.js'],
    });
  }
  ///
});

chrome.webRequest.onSendHeaders.addListener(
  async (details) => {
    const method = details.method;
    const initiator = details.initiator!;

    const tabId = details.tabId;
    console.log(details);
    if (tabId === -1) {
      return;
    }
    const currentTabUrl = (await chrome.tabs.get(tabId)).url!;

    if (
      !(method === 'GET') ||
      !(initiator === 'https://jp.mercari.com') ||
      !currentTabUrl.includes('transaction')
    ) {
      return;
    }

    const requestUrl = details.url;
    const requestHeaders = details.requestHeaders!;
    const requestHeader = Object.fromEntries(
      requestHeaders.map((header) => [header.name, header.value!])
    );

    // sleep処理 (ms)
    await sleep(2000);

    const json = await (
      await fetch(requestUrl, {
        headers: requestHeader,
      })
    ).json();
    await chrome.storage.local.set({ json });
    const result = await chrome.storage.local.get(null);

    console.log(result);
  },
  {
    urls: ['https://api.mercari.jp/items/get?id=*'],
  },
  ['requestHeaders', 'extraHeaders']
);

chrome.runtime.onMessage.addListener(
  (message: { url: string; type: string }, sender, sendResponse) => {
    chrome.tabs.create(
      { active: true, pinned: false, url: message.url },
      async (tab) => {
        const tabId = tab.id!;

        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
        if (message.type === 'rakuma') {
          chrome.scripting.executeScript({
            target: { tabId },
            files: ['rakuma_sell_page.js'],
          });
        }

        // chrome.tabs.remove(tabId);
      }
    );
  }
);
