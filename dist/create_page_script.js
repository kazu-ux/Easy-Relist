"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const intervalTimes = 500;
const imageUpload = (images) => __awaiter(void 0, void 0, void 0, function* () {
    const dataTransfer = new DataTransfer();
    const targetElement = document.querySelector('[data-testid="photo-upload"]');
    if (!targetElement) {
        alert('画像アップロード要素が見つかりません');
        return;
    }
    for (const i of images) {
        const request = yield fetch(i).then((e) => e.blob());
        const file = new File([request], Date.now() + '.' + 'jpeg');
        dataTransfer.items.add(file);
    }
    targetElement.files = dataTransfer.files;
    targetElement.dispatchEvent(new Event('change', { bubbles: true }));
});
function setBrand(brand) {
    const targetElement = document.querySelector('[data-testid="brand-autocomplete-input"]');
    if (!targetElement) {
        alert('ブランド名入力要素が見つかりません');
        return;
    }
    targetElement.setAttribute('value', brand);
}
function setAllCategory(soldCategories) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield Promise.all(soldCategories.map((categoryId, index) => __awaiter(this, void 0, void 0, function* () {
            const categoryList = getCategoryList(index + 1);
            let categoryListIndex = judgeWhatNumber(yield categoryList, categoryId);
            setCategory(categoryListIndex, index);
        })));
    });
}
function setItemInfoToSelect(itemObjForSelect) {
    const key = Object.keys(itemObjForSelect)[0];
    const value = itemObjForSelect[key];
    const targetElement = document.querySelector(`[name=${key}] select`);
    if (!targetElement) {
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
function setToAllItems(productInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        imageUpload(productInfo.images);
        yield setAllCategory(productInfo.category);
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
        yield setItemInfoToSelect({ shippingPayer: productInfo.shippingPayer });
        setItemInfoToSelect({ shippingMethod: productInfo.shippingMethod });
        setItemInfoToSelect({ shippingFromArea: productInfo.shippingFromArea });
        setItemInfoToSelect({ shippingDuration: productInfo.shippingDuration });
        setPrice(productInfo.price);
    });
}
chrome.runtime.onMessage.addListener((productInfo) => {
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const targetElement = document.querySelector('input[type="file"]');
        if (targetElement) {
            clearInterval(interval);
            setToAllItems(productInfo);
        }
        console.log('繰り返し');
    }), intervalTimes);
});
