type ProductInfo = {
  images: string[];
  name: string;
  price: number;
  shippingPayer: string;
  description: string;
  category: string[];
  itemCondition: string;
  shippingMethod: string;
  shippingFromArea: string;
  shippingDuration: string;
};

/* const element = document.querySelector('#dashboard > div > h2');
element.addEventListener('click', (e) => {
  chrome.runtime.sendMessage('gejelkpidobampgonfcdkkfgckaphban', item);
}) */

function getImageUrl(): string[] {
  let imageUrls: string[] = [];
  const imageElements = document.querySelectorAll('.slick-list [sticker]');
  for (const element of imageElements) {
    const imageUrl = element.getAttribute('src')!;
    imageUrls.push(imageUrl);
  }
  // await getBase64(imageUrls);
  return imageUrls;
}

async function getBase64(imageUrls: string[]) {
  const imageBase64s: string[] = [];
  for (const imageUrl of imageUrls) {
    const base64 = await fetch(imageUrls[0])
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
      '[data-location="item:item_detail_table:link:go_search"]'
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
    name: document
      .querySelector('[data-testid="name"]')!
      .shadowRoot!.querySelector('.heading.page')!.textContent!,
    price: Number(
      document.querySelector('[data-testid="price"]')!.getAttribute('value')
    ),
    shippingPayer: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[2]!.lastChild!.textContent!,
    description: document
      .querySelector('[data-testid="description"]')!
      .shadowRoot!.querySelector('slot')!
      .assignedNodes()[0].textContent!,
    category: getCategories(),
    itemCondition: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[1].lastChild!.textContent!,
    shippingMethod: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[3].lastChild!.textContent!,
    shippingFromArea: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[4].lastChild!.textContent!,
    shippingDuration: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[5].lastChild!.textContent!,
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
