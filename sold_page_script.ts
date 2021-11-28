type ProductInfo = {
  images: string[];
  category: string[];
  size: string;
  brand: string;
  itemCondition: string;
  name: string;
  description: string;
  shippingPayer: string;
  shippingMethod: string;
  shippingFromArea: string;
  shippingDuration: string;
  price: string;
};

function getImageUrl(): string[] {
  let imageUrls: string[] = [];
  const imageElements = document.querySelectorAll('.slick-list [sticker]');
  for (const element of imageElements) {
    const imageUrl = element.getAttribute('src')!;
    imageUrls.push(imageUrl);
  }
  return imageUrls;
}

async function getBase64(imageUrls: string[]) {
  const imageBase64s: string[] = [];
  for (const imageUrl of imageUrls) {
    const base64 = await fetch(imageUrl)
      .then((e) => e.blob())
      .then(async (blob) => {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        return reader.result;
      });
    imageBase64s.push(base64 as string);
  }
  return imageBase64s;
}

function getCategories() {
  const categoryIds: string[] = [];
  const targetElement = Array.from(
    document.querySelectorAll(
      'mer-breadcrumb-list [data-location="item:item_detail_table:link:go_search"]'
    )
  ).pop()! as HTMLLinkElement;
  const tCategoryIds = targetElement.href.match(/t._category_id=[0-9]*/g)!;
  for (const tCategoryId of tCategoryIds) {
    categoryIds.push(tCategoryId.match(/[0-9]+$/)![0]);
  }
  console.log(categoryIds);
  return categoryIds;
}

async function setProduct() {
  const product: ProductInfo = {
    images: await getBase64(getImageUrl())!,
    category: getCategories(),
    size: document.querySelector('[data-testid="商品のサイズ"]')?.textContent!,
    brand:
      document.querySelector('[data-testid="ブランド"]')?.textContent ?? '',
    itemCondition: document.querySelector('[data-testid="商品の状態"]')!
      .textContent!,
    name: document
      .querySelector('[data-testid="name"]')!
      .getAttribute('title-label')!,
    description: document.querySelector('[data-testid="description"]')!
      .textContent!,
    shippingPayer: document.querySelector('[data-testid="配送料の負担"]')!
      .textContent!,
    shippingMethod: document.querySelector('[data-testid="配送の方法"]')!
      .textContent!,
    shippingFromArea: document.querySelector('[data-testid="発送元の地域"]')!
      .textContent!,
    shippingDuration: document.querySelector('[data-testid="発送までの日数"]')!
      .textContent!,
    price: document
      .querySelector('[data-testid="price"]')!
      .getAttribute('value')!,
  };
  return product;
}

async function createRelistButton(element: Element) {
  return new Promise(async (resolve, reject) => {
    const divElement = document.createElement('div');
    divElement.className = 'relist-button';
    divElement.textContent = '再出品する！';

    const targetElement = element.parentElement;
    targetElement!.appendChild(divElement);

    resolve(_);
  });
}

async function clickEvent() {
  const relistButtonElement = document.querySelector('div.relist-button');
  relistButtonElement!.addEventListener('click', async () => {
    const productInfo = await setProduct();
    console.log(productInfo);
    console.log(getImageUrl());
    chrome.runtime.sendMessage('gejelkpidobampgonfcdkkfgckaphban', productInfo);
  });
}

chrome.runtime.onMessage.addListener((value) => {
  alert(value);
});

(function () {
  const interval = setInterval(async () => {
    console.log('繰り返し');
    const element = document.querySelector(
      '[data-testid="checkout-button-container"]'
    );
    if (element) {
      clearInterval(interval);
      await createRelistButton(element);
      await clickEvent();
    }
  }, 1000);
})();

function _(_: any) {
  throw new Error('Function not implemented.');
}
