type ProductInfo = {
  images: string[];
  title: string;
  price: number;
  shipping: string;
  text: string;
  category: string;
  condition: string;
  shippingMethod: string;
  region: string;
  days: string;
};

/* const element = document.querySelector('#dashboard > div > h2');
element.addEventListener('click', (e) => {
  chrome.runtime.sendMessage('gejelkpidobampgonfcdkkfgckaphban', item);
}) */

function setProduct() {
  const product: ProductInfo = {
    images: [],
    title: document
      .querySelector('[data-testid="name"]')!
      .shadowRoot!.querySelector('.heading.page')!.textContent!,
    price: Number(
      document.querySelector('[data-testid="price"]')!.getAttribute('value')
    ),
    shipping: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[2]!.lastChild!.textContent!,
    text: document
      .querySelector('[data-testid="description"]')!
      .shadowRoot!.querySelector('slot')!
      .assignedNodes()[0].textContent!,
    category: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[0]!.lastChild!.textContent!,
    condition: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[1].lastChild!.textContent!,
    shippingMethod: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[3].lastChild!.textContent!,
    region: document.querySelector('[title-label="商品の情報"]')!
      .nextElementSibling!.children[4].lastChild!.textContent!,
    days: document.querySelector('[title-label="商品の情報"]')!
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
  relistButtonElement!.addEventListener('click', () => {
    console.log('test');
    console.log(setProduct());
  });
}

chrome.runtime.onMessage.addListener((value) => {
  alert(value);
});

async function main() {
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
}

main();
function _(_: any) {
  throw new Error('Function not implemented.');
}
