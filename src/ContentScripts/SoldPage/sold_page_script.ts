import ChromeStorage from '../../Storage/chrome_storage';

const getItemId = () => {
  const url = window.location.href;
  const itemId = url.split('/')[4];
  return itemId;
};

const searchElement = (keyWord: string) => {
  const bodyElement = document.querySelector('body')!.innerHTML;
  return bodyElement.includes(keyWord);
};

const getImageUrl = (): string[] => {
  const itemId = getItemId();
  const baseImageURL = 'https://static.mercdn.net/item/detail/orig/photos/';
  const numbers = [...Array(10)].map((_, index) => index + 1);

  const imageUrls = numbers.flatMap((number) => {
    const imageUrl = baseImageURL + itemId + '_' + number + '.jpg';
    if (!searchElement(imageUrl)) return [];
    return imageUrl;
  });
  return imageUrls;
};

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

async function setProduct() {
  const product: ItemData = {
    images: await getBase64FromImageUrls(getImageUrl()),
    categories: getCategories(),
    size:
      document.querySelector('[data-testid="商品のサイズ"]')?.textContent ?? '',
    brand:
      document.querySelector('[data-testid="ブランド"]')?.textContent ?? '',
    itemCondition:
      document.querySelector('[data-testid="商品の状態"]')?.textContent ?? '',
    name: document.title.replace(' - メルカリ', ''),
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

(async () => {
  // debounce関数の定義
  function debounce(func: () => void, wait: number) {
    let timeout: number | undefined;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  // MutationObserverのインスタンス作成
  const observer = new MutationObserver(
    debounce(async () => {
      // DOM変更が検出されたときの処理
      console.log('Debounced');
      const isLoading = await ChromeStorage.getIsLoading();
      if (!isLoading) return;
      console.log({ isLoading });

      const imageUrls = getImageUrl();
      if (!imageUrls.length) return alert('画像が空です');

      const itemData = await setProduct();

      await ChromeStorage.setItemData(itemData);
      console.log(await ChromeStorage.getItemData());
      window.location.href = 'https://jp.mercari.com/sell/create';
    }, 1000)
  );

  // 監視対象の要素を取得
  const target = document.querySelector('body')!;

  // 監視オプションを設定
  const config = { childList: true, subtree: true, attributes: true };

  // 監視開始
  observer.observe(target, config);
})();
