type Data = { name: string; value: string };

chrome.action.onClicked.addListener(async () => {
  const headers = new Headers();
  const data: Data[] = (await chrome.storage.local.get('headers')).headers;
  data.forEach(({ name, value }) => {
    headers.append(name, value);
  });
  for (const [key, value] of headers) {
    console.log(`${key} = ${value}`);
  }

  /*   fetch(
    ' https://api.mercari.jp/items/get?id=m65099380065&include_item_attributes=true',
    { headers }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error)); */
});

chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
  // console.log(tabId, changeinfo, tab);
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (!(details.method === 'GET')) return;
    const headers = details.requestHeaders ?? [];
    chrome.storage.local.set({ headers: headers });
    console.log(headers);
  },
  {
    urls: ['https://api.mercari.jp/items/get?id=*'],
  },
  ['requestHeaders', 'extraHeaders']
);
