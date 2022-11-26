import contentScript from './content_script';
import css from './css/style.css?inline';
import { ChromeStorage } from './database/storage';

//取引ページに再出品ボタンを設置する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('https://jp.mercari.com/transaction/')) {
    console.log(tab);

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      // files: ['trading_page.js'],
      func: contentScript,
    });
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      // files: [''],
      css: css,
    });
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  const tab = await chrome.tabs.create({
    url: 'https://jp.mercari.com/sell/create',
  });
  const createTabId = tab.id;
  if (!createTabId) return;

  const results = await chrome.scripting.executeScript({
    target: { tabId: createTabId },
    func: () => {
      const getSaveButtonElement = () => document.querySelector('[data-testid=save-draft]');

      const postFetch = async () => {
        const requestHeader: RequestHeader = (await chrome.storage.local.get('requestHeader')).requestHeader;
        const responseBody: ResponseBody = (await chrome.storage.local.get('itemData')).itemData;
        const draftItem: DraftItem = (await chrome.storage.local.get('draftItem')).draftItem;

        const requestBody: RequestBody = {
          // id: draftItem.id,
          shipping_duration: responseBody.data.shipping_duration.id,
          shipping_payer: responseBody.data.shipping_payer.id,
          shipping_method: responseBody.data.shipping_method.id,
          shipping_from_area: responseBody.data.shipping_from_area.id,
          // draft_category_id: responseBody.data.item_category.id,
          // category_id: responseBody.data.item_category.id,
          exhibit_token: draftItem.exhibit_token,
          // photo_1: responseBody.data.photos[0],
          // uploaded_by_photo_service: false,
          // sales_fee: responseBody.data.price / 10,
          // name: responseBody.data.name,
          // price: responseBody.data.price,
          // description: responseBody.data.description,
          // item_condition: responseBody.data.item_condition.id,
        };

        const formData = new FormData();
        // formData.append('id', String(draftItem.id));
        formData.append('shipping_duration', String(responseBody.data.shipping_duration.id));
        formData.append('shipping_payer', String(responseBody.data.shipping_payer.id));
        formData.append('shipping_method', String(responseBody.data.shipping_method.id));
        formData.append('shipping_from_area', String(responseBody.data.shipping_from_area.id));
        formData.append('draft_category_id', String(responseBody.data.item_category.id));
        formData.append('category_id', String(responseBody.data.item_category.id));
        formData.append('exhibit_token', draftItem.exhibit_token);
        // formData.append('uploaded_by_photo_service', 'false');
        // formData.append('sales_fee', String(responseBody.data.price / 10));
        formData.append('name', responseBody.data.name);
        formData.append('price', String(responseBody.data.price));
        formData.append('description', responseBody.data.description);
        formData.append('item_condition', String(responseBody.data.item_condition.id));

        for (const value of formData.entries()) {
          console.log(value);
        }

        // requestHeader['Content-Type'] = 'application/json';

        /* delete requestHeader.DPoP;
        delete requestHeader.Authorization; */
        delete requestHeader['X-Platform'];

        const request = new Request('https://api.mercari.jp/draft_items/save', {
          // headers: requestHeader,
          method: 'POST',
          body: formData,
          // body: JSON.stringify(requestBody),
        });

        fetch(request).then((response) => {
          console.log({ response });
        });
      };

      const interval = setInterval(async () => {
        const saveButtonElement = getSaveButtonElement();
        if (!saveButtonElement) return;
        clearInterval(interval);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        postFetch();

        console.log(saveButtonElement);
      }, 1000);
    },
  });

  console.log(results);
});

let count = 0;
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    count += 1;
    // if (count > 2) return;
    if (details.initiator !== 'https://jp.mercari.com') return;
    console.log(count);

    const requestHeaders = details.requestHeaders?.map((header) => {
      const name = header.name;
      const value = header.value;
      return { [name]: value };
    });
    const requestHeader: RequestHeader = {
      Accept: '',
      Authorization: '',
      DPoP: '',
      'User-Agent': '',
      'X-Platform': '',
    };
    requestHeaders?.forEach((header) => {
      const key = Object.keys(header)[0];
      if (key.includes('sec')) return;
      if (key.includes('Sec')) return;

      Object.assign(requestHeader, header);
    });

    if (!requestHeader.DPoP) return;

    if (details.url.includes('https://api.mercari.jp/items/get?id=')) {
      fetch(details.url, {
        headers: requestHeader,
      }).then(async (response) => {
        const responseBody: ResponseBody = await response.json();
        ChromeStorage.setItemData(responseBody);
      });
    } else if (details.url.includes('https://api.mercari.jp/draft_items/gets')) {
      fetch(details.url, { headers: requestHeader }).then(async (response) => {
        const responseBody: DraftItems = await response.json();
        ChromeStorage.setDraftItem(responseBody.data[0]);
      });
    } else if (details.url.includes('https://api.mercari.jp/draft_items/save')) {
      ChromeStorage.setRequestHeader(requestHeader);
    }
  },
  {
    urls: [
      'https://api.mercari.jp/items/get?id=*',
      'https://api.mercari.jp/draft_items/gets',
      'https://api.mercari.jp/draft_items/save',
      // 'https://jp.mercari.com/transaction/*',
    ],
  },
  ['requestHeaders']
);
