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
/* const element = document.querySelector('#dashboard > div > h2');
element.addEventListener('click', (e) => {
  chrome.runtime.sendMessage('gejelkpidobampgonfcdkkfgckaphban', item);
}) */
function getImageUrl() {
    let imageUrls = [];
    const imageElements = document.querySelectorAll('.slick-list [sticker]');
    for (const element of imageElements) {
        const imageUrl = element.getAttribute('src');
        imageUrls.push(imageUrl);
    }
    // await getBase64(imageUrls);
    return imageUrls;
}
function getBase64(imageUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageBase64s = [];
        for (const imageUrl of imageUrls) {
            const base64 = yield fetch(imageUrls[0])
                .then((e) => e.blob())
                .then((blob) => __awaiter(this, void 0, void 0, function* () {
                const reader = new FileReader();
                yield new Promise((resolve, reject) => {
                    reader.onload = resolve;
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                return reader.result;
            }));
            imageBase64s.push(base64);
        }
        return imageBase64s;
    });
}
function getCategories() {
    const categoryIds = [];
    const targetElement = Array.from(document.querySelectorAll('[data-location="item:item_detail_table:link:go_search"]')).pop();
    const tCategoryIds = targetElement.href.match(/t._category_id=[0-9]*/g);
    for (const tCategoryId of tCategoryIds) {
        categoryIds.push(tCategoryId.match(/[0-9]+$/)[0]);
    }
    console.log(categoryIds);
    return categoryIds;
}
function setProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        const product = {
            images: yield getBase64(getImageUrl()),
            name: document
                .querySelector('[data-testid="name"]')
                .shadowRoot.querySelector('.heading.page').textContent,
            price: document
                .querySelector('[data-testid="price"]')
                .getAttribute('value'),
            shippingPayer: document.querySelector('[title-label="商品の情報"]')
                .nextElementSibling.children[2].lastChild.textContent,
            description: document
                .querySelector('[data-testid="description"]')
                .shadowRoot.querySelector('slot')
                .assignedNodes()[0].textContent,
            category: getCategories(),
            itemCondition: document.querySelector('[title-label="商品の情報"]')
                .nextElementSibling.children[1].lastChild.textContent,
            shippingMethod: document.querySelector('[title-label="商品の情報"]')
                .nextElementSibling.children[3].lastChild.textContent,
            shippingFromArea: document.querySelector('[title-label="商品の情報"]')
                .nextElementSibling.children[4].lastChild.textContent,
            shippingDuration: document.querySelector('[title-label="商品の情報"]')
                .nextElementSibling.children[5].lastChild.textContent,
        };
        return product;
    });
}
function createRelistButton(element) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const divElement = document.createElement('div');
            divElement.className = 'relist-button';
            divElement.textContent = '再出品する！';
            const targetElement = element.parentElement;
            targetElement.appendChild(divElement);
            resolve(_);
        }));
    });
}
function clickEvent() {
    return __awaiter(this, void 0, void 0, function* () {
        const relistButtonElement = document.querySelector('div.relist-button');
        relistButtonElement.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const productInfo = yield setProduct();
            console.log(productInfo);
            console.log(getImageUrl());
            chrome.runtime.sendMessage('gejelkpidobampgonfcdkkfgckaphban', productInfo);
        }));
    });
}
chrome.runtime.onMessage.addListener((value) => {
    alert(value);
});
(function () {
    const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        console.log('繰り返し');
        const element = document.querySelector('[data-testid="checkout-button-container"]');
        if (element) {
            clearInterval(interval);
            yield createRelistButton(element);
            yield clickEvent();
        }
    }), 1000);
})();
function _(_) {
    throw new Error('Function not implemented.');
}
