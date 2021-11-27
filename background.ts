let count = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://jp.mercari.com/item/')
  ) {
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
      console.log(tab);
    }
  }
});

chrome.runtime.onMessage.addListener((productInfo) => {
  //メルカリ出品ページを開く
  chrome.tabs.create(
    {
      active: true,
      url: 'https://jp.mercari.com/sell/create',
    },
    (tab) => {
      //定期的に新しく開いたタブの情報を取得する
      const interval = setInterval(() => {
        //現在開いているタブの読み込み状態を取得する
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          //読み込みが完了したら…
          if (tabs[0].status === 'complete') {
            clearInterval(interval);
            //スクリプトファイルを注入する
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id! },
                files: ['dist/create_page_script.js'],
              },
              () => {
                chrome.tabs.sendMessage(tab.id!, productInfo);
              }
            );
          }
        });
        console.log('新しいタブ繰り返し');
      }, 1000);
    }
  );

  console.log(productInfo);
});
