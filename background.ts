chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://jp.mercari.com/transaction/')
  ) {
    console.log(tab);

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['dist/trading_page.js'],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['style.css'],
    });
  }
});

//productInfoを取得したら商品ページを閉じる
chrome.runtime.onMessage.addListener((url) => {
  //メルカリ出品ページを開く
  chrome.tabs.create(
    {
      active: true,
      url,
    },
    (tab) => {
      //メルカリ出品ページタブの情報を定期的に取得する
      const interval = setInterval(() => {
        //現在開いているタブの読み込み状態を取得する
        chrome.tabs.get(tab.id!, (tab) => {
          //読み込みが完了したら…
          if (tab.status === 'complete') {
            clearInterval(interval);
            //スクリプトファイルを注入する
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id! },
                files: ['dist/sold_page_script.js'],
              },
              () => {
                //メルカリ出品ページにproductInfoを送る
                // chrome.tabs.sendMessage(tab.id!, productInfo);
              }
            );
          }
        });
        console.log('新しいタブ繰り返し');
      }, 500);
    }
  );
});
