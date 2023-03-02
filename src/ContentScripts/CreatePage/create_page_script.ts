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

const setCategory = (strings: string[]) => {
  strings.unshift('カテゴリーを選択する');

  let i = 0;
  const links = document.getElementsByTagName('a');

  const clickLink = () => {
    if (i < links.length) {
      const link = links[i];
      if (strings.includes(link.textContent ?? '')) {
        link.click();
        setTimeout(clickLink, 1000);
      } else {
        i++;
        setTimeout(clickLink, 1000);
      }
    }
  };

  clickLink();
};

function setItemInfoToSelect(itemObjForSelect: { [key: string]: string }) {
  const key = Object.keys(itemObjForSelect)[0];
  const value = itemObjForSelect[key];
  const targetElement: HTMLSelectElement | null = document.querySelector(
    `[name=${key}] select`
  );
  if (!targetElement) return;

  return new Promise<void>((resolve, reject) => {
    function getselectOptions(): string[] {
      const selectOptions = [];
      if (!targetElement) {
        return [''];
      }

      for (const options of targetElement.options) {
        selectOptions.push(options.text);
      }
      console.log(selectOptions);
      return selectOptions;
    }

    function judgeWhatNumber(selectOptions: string[], selectOprion: string) {
      return selectOptions.findIndex((target) => target === selectOprion);
    }

    targetElement.selectedIndex = judgeWhatNumber(getselectOptions(), value);
    targetElement.dispatchEvent(new Event('change', { bubbles: true }));
    resolve();
  });
}

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

async function setToAllItems(productInfo: ItemData) {
  await imageUpload(productInfo.images);
  // await setAllCategory(productInfo.category);
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
  // setItemInfoToSelect({ shippingMethod: productInfo.shippingMethod });
  await setItemInfoToSelect({ shippingFromArea: productInfo.shippingFromArea });
  await setItemInfoToSelect({ shippingDuration: productInfo.shippingDuration });
  return;
}

const waitForElement = (selector: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('timeout');

      reject(new Error('timeout'));
    }, 5000);
    if (document.querySelectorAll(selector)[0]) {
      return resolve(document.querySelectorAll(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelectorAll(selector)[0]) {
        resolve(document.querySelectorAll(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const setShippingMethod = async (shippingMethod: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 発送方法選択ページに遷移
  const shippingMethodsPageTransitionLink = (await waitForElement(
    'a[href="/sell/shipping_methods"]'
  )) as HTMLLinkElement[];

  if (!shippingMethodsPageTransitionLink) return;

  shippingMethodsPageTransitionLink[0].click();

  // 発送方法を選択
  await new Promise((resolve) => setTimeout(resolve, 500));

  const shippingMethods = (await waitForElement(
    'input[name="selectedShippingMethod"]'
  )) as HTMLInputElement[];

  shippingMethods.forEach(async (element) => {
    if (!(element.getAttribute('aria-label') === shippingMethod)) return;
    element.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 「更新する」ボタンをクリック
    const xpath = "//button[contains(text(), '更新する')]";
    const resultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
    const button = document.evaluate(xpath, document, null, resultType, null)
      .singleNodeValue as HTMLButtonElement | null;
    if (!button) return;
    button.click();
  });
};

const setup = async () => {
  console.log(await waitForElement('input[type="file"]'));
  const itemData = await ChromeStorage.getItemData();
  if (!itemData) return;

  await setToAllItems(itemData);
  setCategory;
  // setShippingMethod(itemData.shippingMethod);
  // ChromeStorage.deleteItemData();
  await ChromeStorage.setIsLoading(false);
};

setup();
