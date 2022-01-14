let closedTabId: number;

//取引ページに再出品ボタンを設置する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://jp.mercari.com/transaction/')
  ) {
    // console.log(tab);

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['trading_page.js'],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['css/style.css'],
    });
  }
});

//出品ページタブを閉じた際に、開いたタブをアクティブにする
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  closedTabId = tabId;
});

let itemId: string;
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

    // sleep処理
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    const json = await (
      await fetch(requestUrl, {
        headers: requestHeader,
      })
    ).json();
    console.log(json);
  },
  {
    urls: ['https://api.mercari.jp/items/get?id=*'],
  },
  ['requestHeaders', 'extraHeaders']
);

chrome.runtime.onMessage.addListener((message: { url: string }) => {
  chrome.tabs.create(
    { active: false, pinned: true, url: message.url },
    async (tab) => {
      const tabId = tab.id!;
      const itemId = message.url.split('/')[4];

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      chrome.tabs.remove(tabId);
    }
  );
});
