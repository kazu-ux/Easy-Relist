import ChromeStorage from '../../Storage/chrome_storage';

function getImageUrl(): string[] {
  const imageUrls: string[] = [];
  const imageElements = document.querySelectorAll('.slick-list [sticker]');
  for (const element of imageElements) {
    const imageUrl = element.getAttribute('src');
    if (!imageUrl) {
      alert('画像のURL取得に失敗しました');
      return [''];
    }
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
    if (!base64) {
      alert('画像のbase64取得にエラーが発生しました');
      return [''];
    }
    imageBase64s.push(base64.toString());
  }
  return imageBase64s;
}

function getCategories() {
  const categoryTitleElement = document
    .evaluate('//span[@slot="title"][contains(text(),"カテゴリー")]', document)
    .iterateNext();
  if (!categoryTitleElement) {
    alert('カテゴリータイトルが見つかりません');
    return [];
  }

  const categoryElement = <HTMLElement | null>categoryTitleElement.nextSibling;
  if (!categoryElement) {
    alert('カテゴリー要素が見つかりません');
    return [];
  }

  const categoryLinks = categoryElement.querySelectorAll('a');
  const categoryValues = Array.from(categoryLinks)
    .map((element) => {
      const categoryValueReg = element.href.match(/[0-9]{1,}$/g);
      if (!categoryValueReg) {
        alert('カテゴリーIDが正規表現で見つかりません');
        return '';
      }
      const categoryValue = categoryValueReg.toString();
      return categoryValue;
    })
    .filter(Boolean);

  return categoryValues;
}

const getPrice = () => {
  const priceElement = document.querySelector('[data-testid="price"]');
  const priceText = priceElement?.textContent;
  const price = Number(priceText?.replace(/[^0-9]/g, ''));
  return price;
};

async function setProduct() {
  const product: ItemData = {
    images: await getBase64(getImageUrl()),
    category: getCategories(),
    size:
      document.querySelector('[data-testid="商品のサイズ"]')?.textContent ?? '',
    brand:
      document.querySelector('[data-testid="ブランド"]')?.textContent ?? '',
    itemCondition:
      document.querySelector('[data-testid="商品の状態"]')?.textContent ?? '',
    name: document.title.replace(' - メルカリ', '') ?? '',
    description:
      document.querySelector('[data-testid="description"]')?.textContent ?? '',
    shippingPayer:
      document.querySelector('[data-testid="配送料の負担"]')?.textContent ?? '',
    shippingMethod:
      document.querySelector('[data-testid="配送の方法"]')?.textContent ?? '',
    shippingFromArea:
      document.querySelector('[data-testid="発送元の地域"]')?.textContent ?? '',
    shippingDuration:
      document.querySelector('[data-testid="発送までの日数"]')?.textContent ??
      '',
    price: getPrice().toString(),
  };
  return product;
}

(async function () {
  function waitForElementsToDisplay(selector: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        console.log('loop');

        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }
  await waitForElementsToDisplay('#item-info');

  const isLoading = await ChromeStorage.getIsLoading();
  if (!isLoading) return;
  const itemData = await setProduct();

  await ChromeStorage.setItemData(itemData);
  console.log(await ChromeStorage.getItemData());
  window.location.href = 'https://jp.mercari.com/sell/create';
})();
