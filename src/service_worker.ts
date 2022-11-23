console.log('テスト');

type RequestHeader = {
  Accept: string;
  Authorization: string;
  DPoP: string;
  'User-Agent': string;
  'X-Platform': string;
};

type RequestBody = {
  shipping_duration: number;
  shipping_payer: number;
  shipping_method: number;
  shipping_from_area: number;
  draft_category_id: number;
  category_id: number;
  exhibit_token: string;
  photo_1: string;
  uploaded_by_photo_service: boolean;
  sales_fee: number;
  name: string;
  price: number;
  description: string;
  item_condition: number;
};

type ResponseBody = {
  result: string;
  data: {
    shipping_duration: { id: number };
    shipping_payer: { id: number };
    shipping_method: { id: number };
    shipping_from_area: { id: number };
    item_category: { id: number };
    checksum: string; //exhibit_token
    photos: [string];
    name: string;
    price: number;
    description: string;
    item_condition: { id: number };
  };
};

const postFetch = (
  requestHeader: RequestHeader,
  responseBody: ResponseBody
) => {
  const requestBody: RequestBody = {
    shipping_duration: responseBody.data.shipping_duration.id,
    shipping_payer: responseBody.data.shipping_payer.id,
    shipping_method: responseBody.data.shipping_method.id,
    shipping_from_area: responseBody.data.shipping_from_area.id,
    draft_category_id: responseBody.data.item_category.id,
    category_id: responseBody.data.item_category.id,
    exhibit_token: responseBody.data.checksum,
    photo_1: responseBody.data.photos[0],
    uploaded_by_photo_service: true,
    sales_fee: responseBody.data.price / 10,
    name: responseBody.data.name,
    price: responseBody.data.price,
    description: responseBody.data.description,
    item_condition: responseBody.data.item_condition.id,
  };
  console.log(requestBody);

  fetch('https://api.mercari.jp/draft_items/save', {
    headers: requestHeader,
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
};

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

    fetch(details.url, { headers: requestHeader }).then(async (response) => {
      const responseBody: ResponseBody = await response.json();
      console.log(responseBody.data.name);
      postFetch(requestHeader, responseBody);
    });
  },
  {
    urls: [
      'https://api.mercari.jp/items/get?id=*',
      // 'https://jp.mercari.com/transaction/*',
    ],
  },
  ['requestHeaders']
);
