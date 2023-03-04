import ChromeStorage from '../../Storage/chrome_storage';

const intervalTimes = 1000;

const imageUpload = async (images: string[]) => {
  const dataTransfer = new DataTransfer();
  const targetElement: HTMLInputElement | null = document.querySelector(
    '[data-testid="photo-upload"]'
  );
  if (!targetElement) {
    alert('画像アップロード要素が見つかりません');
    return;
  }
  for (const i of images) {
    const request = await fetch(i).then((e) => e.blob());

    const file = new File([request], Date.now() + '.' + 'jpeg');
    dataTransfer.items.add(file);
  }

  targetElement.files = dataTransfer.files;
  targetElement.dispatchEvent(new Event('change', { bubbles: true }));
};

function setBrand(brand: string) {
  const targetElement: HTMLElement | null = document.querySelector(
    '[data-testid="brand-autocomplete-input"]'
  );
  if (!targetElement) {
    alert('ブランド名入力要素が見つかりません');
    return;
  }
  targetElement.setAttribute('value', brand);
}

const setItemInfoToSelect = async (itemObjForSelect: {
  [key: string]: string;
}) => {
  const key = Object.keys(itemObjForSelect)[0];
  const value = itemObjForSelect[key];
  const targetElement: HTMLSelectElement | null = document.querySelector(
    `[name=${key}] select`
  );
  if (!targetElement) return;

  const selectOptions = Array.from(targetElement.options).map(
    (option) => option.text
  );
  targetElement.selectedIndex = selectOptions.findIndex(
    (option) => option === value
  );
  targetElement.dispatchEvent(new Event('change', { bubbles: true }));
};

const setItemName = async (itemText: { [key: string]: string }) => {
  const [key, value] = Object.entries(itemText)[0];
  const targetElement: HTMLInputElement | null = document.querySelector(
    `input[name=${key}]`
  );
  if (!targetElement) throw new Error('商品名入力要素が見つかりません');
  targetElement.value = value;
  targetElement.dispatchEvent(new Event('input', { bubbles: true }));
};

const setItemDescription = async (description: string) => {
  const targetElement: HTMLTextAreaElement | null = document.querySelector(
    'textarea[name="description"]'
  );
  if (!targetElement) throw new Error('説明文入力要素が見つかりません');
  targetElement.value = description;
  targetElement.dispatchEvent(new Event('input', { bubbles: true }));
};

const setPrice = async (price: string) => {
  const targetElement: HTMLInputElement | null = document.querySelector(
    'input[name="price"]'
  );
  if (!targetElement) throw new Error('価格入力要素が見つかりません');
  targetElement.value = price;
  targetElement.dispatchEvent(new Event('input', { bubbles: true }));
};

const setToAllItems = async (productInfo: ItemData) => {
  await imageUpload(productInfo.images);
  await debounceAndObserve();

  if (productInfo.size) {
    setItemInfoToSelect({ size: productInfo.size });
  }
  if (productInfo.brand) {
    setTimeout(() => {
      setBrand(productInfo.brand);
    }, intervalTimes);
  }

  await setItemName({ name: productInfo.name });
  await setItemDescription(productInfo.description);
  await setItemInfoToSelect({ itemCondition: productInfo.itemCondition });
  await setPrice(productInfo.price);
  await setItemInfoToSelect({ shippingPayer: productInfo.shippingPayer });
  await setItemInfoToSelect({ shippingFromArea: productInfo.shippingFromArea });
  await setItemInfoToSelect({ shippingDuration: productInfo.shippingDuration });
  return;
};

const wait = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const debounceAndObserve = () => {
  return new Promise((resolve) => {
    let timeout: number | undefined;
    const observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('Debounced');
        observer.disconnect();
        resolve('Done');
      }, 1000);
    });

    // 監視対象の要素を取得
    const target = document.querySelector('body')!;

    // 監視オプションを設定
    const config = { childList: true, subtree: true, attributes: true };

    // 監視開始
    observer.observe(target, config);
  });
};

const clickElementsByKeywords = async (keyWords: string[]): Promise<void> => {
  for (const keyWord of keyWords) {
    const elements = [...document.querySelectorAll<HTMLElement>('*')];

    const element = elements.find((element) => element.innerText === keyWord);
    console.log(element);
    const child = element?.firstChild as HTMLElement | null;

    if (!child) return;
    child.click();
    await wait(0.5);
  }
};

const setCategories = async (keyWords: string[]) => {
  keyWords.unshift('カテゴリーを選択する');

  await clickElementsByKeywords(keyWords);
};

const setShippingMethod = async (shippingMethod: string) => {
  console.log(shippingMethod);

  const keyWords = ['配送の方法を選択する', shippingMethod, '更新する'];

  await clickElementsByKeywords(keyWords);
};

const setup = async () => {
  const isLoading = await ChromeStorage.getIsLoading();
  if (!isLoading) return;
  await debounceAndObserve();
  const itemData = await ChromeStorage.getItemData();
  if (!itemData) return;

  await setToAllItems(itemData);
  await debounceAndObserve();

  await setShippingMethod(itemData.shippingMethod);
  console.log('配送方法入力完了');

  await setCategories(itemData.categories);
  console.log('カテゴリー名入力完了');

  // ChromeStorage.deleteItemData();
  await ChromeStorage.setIsLoading(false);
};

setup();
