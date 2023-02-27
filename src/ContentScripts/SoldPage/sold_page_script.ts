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

// 画像のURLからbase64形式の文字列を取得する関数
const getBase64FromImageUrls = async (
  imageUrls: string[]
): Promise<string[]> => {
  // blobオブジェクトからbase64形式の文字列を取得する関数
  const blobToBase64 = async (blob: Blob): Promise<string | null> =>
    new Promise((resolve, reject) => {
      // FileReaderオブジェクトを作成する
      const reader = new FileReader();
      // 読み込みが完了したら結果を返す
      reader.onload = () => resolve(reader.result as string);
      // エラーが発生したらエラーを返す
      reader.onerror = () => reject(reader.error);
      // base64形式で読み込む
      reader.readAsDataURL(blob);
    });
  // 結果を格納する配列
  const imageBase64s: string[] = [];
  // URLごとに処理する
  for (const imageUrl of imageUrls) {
    // URLからblobオブジェクトを取得する
    const blob = await fetch(imageUrl).then((response) => response.blob());
    // blobオブジェクトからbase64形式の文字列を取得する
    const base64 = await blobToBase64(blob);
    // エラーがあればアラートを出す
    if (!base64) {
      alert('画像のbase64取得にエラーが発生しました');
      return [''];
    }
    // 結果に追加する
    imageBase64s.push(base64.toString());
  }
  // 結果を返す
  return imageBase64s;
};

function getCategories(): string[] {
  const categoryElements = document.querySelectorAll(
    '[data-testid="item-detail-category"] a'
  );
  const categoryNames = Array.from(categoryElements).map(
    (categoryElement) => categoryElement.textContent ?? ''
  );
  return categoryNames;
}

const getPrice = () => {
  const priceElement = document.querySelector('[data-testid="price"]');
  const priceText = priceElement?.textContent;
  const price = Number(priceText?.replace(/[^0-9]/g, ''));
  return price;
};

// サイトのタイトルを取得する関数
function getSiteTitle(): Promise<string> {
  // Promiseオブジェクトを返す
  return new Promise((resolve, reject) => {
    // タイトルが空でないかチェックする関数
    function checkTitle() {
      // タイトルを取得する
      const title = document.title;
      // タイトルが空でなければ、resolveで値を返す
      if (title.length > 0) {
        resolve(title);
      } else {
        // タイトルが空なら、0.5秒後に再度チェックする
        setTimeout(checkTitle, 500);
      }
    }
    // 最初のチェックを実行する
    checkTitle();
  });
}

async function setProduct() {
  const product: ItemData = {
    images: await getBase64FromImageUrls(getImageUrl()),
    category: getCategories(),
    size:
      document.querySelector('[data-testid="商品のサイズ"]')?.textContent ?? '',
    brand:
      document.querySelector('[data-testid="ブランド"]')?.textContent ?? '',
    itemCondition:
      document.querySelector('[data-testid="商品の状態"]')?.textContent ?? '',
    name: (await getSiteTitle()).replace(' - メルカリ', ''),
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
