const dataTransfer = new DataTransfer();

const imageUpload = async (images: string[]) => {
  const targetElement: HTMLInputElement = document.querySelector(
    '[data-testid="photo-upload"]'
  )!;
  for (const i of images) {
    const request = await fetch(i).then((e) => e.blob());

    const file = new File([request], Date.now() + '.' + 'jpeg');
    dataTransfer.items.add(file);
  }

  targetElement.files! = dataTransfer.files!;
  targetElement.dispatchEvent(new Event('change', { bubbles: true }));
};

function setBrand(brand: string) {
  const targetElement: HTMLElement = document.querySelector(
    '[data-testid="brand-autocomplete-input"]'
  )!;
  targetElement.setAttribute('value', brand);
}

async function setAllCategory(soldCategories: string[]) {
  function getCategoryList(index: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let categoryList: string[] = [];
      const interval = setInterval(() => {
        const targetElement: HTMLSelectElement = document.querySelector(
          `[name="category${index}"] select`
        )!;
        if (targetElement) {
          clearInterval(interval);

          const categoryOptions = targetElement.options;
          for (const option of categoryOptions) {
            categoryList.push(option.value);
          }

          resolve(categoryList);
        }
        console.log(`getCategory${index}List 繰り返し`);
      }, 1000);
    });
  }

  function judgeWhatNumber(categoryList: string[], categoryId: string) {
    const index = categoryList.findIndex((target) => target === categoryId);
    return index;
  }

  function setCategory(categoryListIndex: number, selectElementIndex: number) {
    const targetElement = document.querySelectorAll('select')[
      selectElementIndex
    ] as HTMLSelectElement;
    targetElement.selectedIndex = categoryListIndex;
    targetElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  await Promise.all(
    soldCategories.map(async (categoryId, index) => {
      const categoryList = getCategoryList(index + 1);
      let categoryListIndex = judgeWhatNumber(await categoryList, categoryId);
      setCategory(categoryListIndex, index);
    })
  );
}

function setAboutShipping(aboutShippingObj: { [key: string]: string }) {
  const key = Object.keys(aboutShippingObj)[0];
  const value = aboutShippingObj[key];
  const targetElement: HTMLSelectElement | null = document.querySelector(
    `[name=${key}] select`
  );
  if (!targetElement) {
    return;
  }
  function getAboutShippingList(): string[] {
    let aboutShippingList = [];
    if (!targetElement) {
      return [''];
    }

    const aboutShippingOptions = targetElement.options;
    for (const options of aboutShippingOptions) {
      aboutShippingList.push(options.text);
    }
    console.log(aboutShippingList);
    return aboutShippingList;
  }

  function judgeWhatNumber(aboutShippingList: string[], aboutShipping: string) {
    return aboutShippingList.findIndex((target) => target === aboutShipping);
  }

  targetElement.selectedIndex = judgeWhatNumber(getAboutShippingList(), value);
  targetElement.dispatchEvent(new Event('change', { bubbles: true }));
}

function setItemName(itemText: { [key: string]: string }) {
  const key = Object.keys(itemText)[0];
  const value = itemText[key];
  const targetElement: HTMLInputElement = document.querySelector(
    `input[name=${key}]`
  )!;
  targetElement.value = value;
  targetElement.dispatchEvent(new Event('input', { bubbles: true }));
}

function setItemDiscription(description: string) {
  const targetElement: HTMLTextAreaElement = document.querySelector(
    'textarea[name="description"]'
  )!;
  targetElement.value = description;
  targetElement.dispatchEvent(new Event('input', { bubbles: true }));
}

function setPrice(price: string) {
  const targetElement: HTMLInputElement = document.querySelector(
    'input[name="price"]'
  )!;
  targetElement.value = price;
  targetElement.dispatchEvent(new Event('input', { bubbles: true }));
}

async function setToAllItems(productInfo: ProductInfo) {
  imageUpload(productInfo.images);
  await setAllCategory(productInfo.category);
  if (productInfo.size) {
    setAboutShipping({ size: productInfo.size });
  }
  if (productInfo.brand) {
    setTimeout(() => {
      setBrand(productInfo.brand);
    }, 1000);
  }

  setItemName({ name: productInfo.name });
  setItemDiscription(productInfo.description);
  setAboutShipping({ itemCondition: productInfo.itemCondition });

  setAboutShipping({ shippingPayer: productInfo.shippingPayer });
  setAboutShipping({ shippingMethod: productInfo.shippingMethod });
  setAboutShipping({ shippingFromArea: productInfo.shippingFromArea });
  setAboutShipping({ shippingDuration: productInfo.shippingDuration });
  setPrice(productInfo.price);
}

chrome.runtime.onMessage.addListener((productInfo) => {
  const interval = setInterval(async () => {
    const targetElement = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (targetElement) {
      clearInterval(interval);
      setToAllItems(productInfo);
      console.log(targetElement);
    }
    console.log('繰り返し');
  }, 1000);
});
