"use strict";
const intervalTimes = 500;
const imageUpload = async (images) => {
    const dataTransfer = new DataTransfer();
    const targetElement = document.querySelector('[data-testid="photo-upload"]');
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
function setBrand(brand) {
    const targetElement = document.querySelector('[data-testid="brand-autocomplete-input"]');
    if (!targetElement) {
        alert('ブランド名入力要素が見つかりません');
        return;
    }
    targetElement.setAttribute('value', brand);
}
async function setAllCategory(soldCategories) {
    function getCategoryList(index) {
        return new Promise((resolve, reject) => {
            let categoryList = [];
            const interval = setInterval(() => {
                const targetElement = document.querySelector(`[name="category${index}"] select`);
                if (targetElement) {
                    clearInterval(interval);
                    const categoryOptions = targetElement.options;
                    for (const option of categoryOptions) {
                        categoryList.push(option.value);
                    }
                    resolve(categoryList);
                }
                else {
                    alert('カテゴリー選択要素が見つかりません');
                }
                console.log(`getCategory${index}List 繰り返し`);
            }, intervalTimes);
        });
    }
    function judgeWhatNumber(categoryList, categoryId) {
        const index = categoryList.findIndex((target) => target === categoryId);
        return index;
    }
    function setCategory(categoryListIndex, selectElementIndex) {
        const targetElement = document.querySelectorAll('select')[selectElementIndex];
        targetElement.selectedIndex = categoryListIndex;
        targetElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
    await Promise.all(soldCategories.map(async (categoryId, index) => {
        const categoryList = getCategoryList(index + 1);
        let categoryListIndex = judgeWhatNumber(await categoryList, categoryId);
        setCategory(categoryListIndex, index);
    }));
}
function setItemInfoToSelect(itemObjForSelect) {
    const key = Object.keys(itemObjForSelect)[0];
    const value = itemObjForSelect[key];
    const targetElement = document.querySelector(`[name=${key}] select`);
    if (!targetElement) {
        alert('セレクト要素が見つかりません');
        return;
    }
    return new Promise((resolve, reject) => {
        function getselectOptions() {
            let selectOptions = [];
            if (!targetElement) {
                return [''];
            }
            for (const options of targetElement.options) {
                selectOptions.push(options.text);
            }
            console.log(selectOptions);
            return selectOptions;
        }
        function judgeWhatNumber(selectOptions, selectOprion) {
            return selectOptions.findIndex((target) => target === selectOprion);
        }
        targetElement.selectedIndex = judgeWhatNumber(getselectOptions(), value);
        targetElement.dispatchEvent(new Event('change', { bubbles: true }));
        resolve();
    });
}
function setItemName(itemText) {
    const key = Object.keys(itemText)[0];
    const value = itemText[key];
    const targetElement = document.querySelector(`input[name=${key}]`);
    if (!targetElement) {
        alert('商品名入力要素が見つかりません');
        return;
    }
    targetElement.value = value;
    targetElement.dispatchEvent(new Event('input', { bubbles: true }));
}
function setItemDiscription(description) {
    const targetElement = document.querySelector('textarea[name="description"]');
    if (!targetElement) {
        alert('説明文入力要素が見つかりません');
        return;
    }
    targetElement.value = description;
    targetElement.dispatchEvent(new Event('input', { bubbles: true }));
}
function setPrice(price) {
    const targetElement = document.querySelector('input[name="price"]');
    if (!targetElement) {
        alert('価格入力要素が見つかりません');
        return;
    }
    targetElement.value = price;
    targetElement.dispatchEvent(new Event('input', { bubbles: true }));
}
async function setToAllItems(productInfo) {
    imageUpload(productInfo.images);
    await setAllCategory(productInfo.category);
    if (productInfo.size) {
        setItemInfoToSelect({ size: productInfo.size });
    }
    if (productInfo.brand) {
        setTimeout(() => {
            setBrand(productInfo.brand);
        }, intervalTimes);
    }
    setItemName({ name: productInfo.name });
    setItemDiscription(productInfo.description);
    setItemInfoToSelect({ itemCondition: productInfo.itemCondition });
    await setItemInfoToSelect({ shippingPayer: productInfo.shippingPayer });
    setItemInfoToSelect({ shippingMethod: productInfo.shippingMethod });
    setItemInfoToSelect({ shippingFromArea: productInfo.shippingFromArea });
    setItemInfoToSelect({ shippingDuration: productInfo.shippingDuration });
    setPrice(productInfo.price);
}
chrome.runtime.onMessage.addListener((productInfo) => {
    const interval = setInterval(async () => {
        const targetElement = document.querySelector('input[type="file"]');
        if (targetElement) {
            clearInterval(interval);
            setToAllItems(productInfo);
        }
        console.log('繰り返し');
    }, intervalTimes);
});
