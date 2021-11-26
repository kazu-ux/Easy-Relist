let count = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://jp.mercari.com/item/')
  ) {
    count += 1;
    // clearTimeout(timer);
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
