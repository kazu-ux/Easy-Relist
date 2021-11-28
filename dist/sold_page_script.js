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
function getImageUrl() {
    let imageUrls = [];
    const imageElements = document.querySelectorAll('.slick-list [sticker]');
    for (const element of imageElements) {
        const imageUrl = element.getAttribute('src');
        imageUrls.push(imageUrl);
    }
    return imageUrls;
}
function getBase64(imageUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageBase64s = [];
        for (const imageUrl of imageUrls) {
            const base64 = yield fetch(imageUrl)
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
    const targetElement = Array.from(document.querySelectorAll('mer-breadcrumb-list [data-location="item:item_detail_table:link:go_search"]')).pop();
    const tCategoryIds = targetElement.href.match(/t._category_id=[0-9]*/g);
    for (const tCategoryId of tCategoryIds) {
        categoryIds.push(tCategoryId.match(/[0-9]+$/)[0]);
    }
    console.log(categoryIds);
    return categoryIds;
}
function setProduct() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const product = {
            images: yield getBase64(getImageUrl()),
            category: getCategories(),
            size: (_a = document.querySelector('[data-testid="商品のサイズ"]')) === null || _a === void 0 ? void 0 : _a.textContent,
            brand: (_c = (_b = document.querySelector('[data-testid="ブランド"]')) === null || _b === void 0 ? void 0 : _b.textContent) !== null && _c !== void 0 ? _c : '',
            itemCondition: document.querySelector('[data-testid="商品の状態"]')
                .textContent,
            name: document
                .querySelector('[data-testid="name"]')
                .getAttribute('title-label'),
            description: document.querySelector('[data-testid="description"]')
                .textContent,
            shippingPayer: document.querySelector('[data-testid="配送料の負担"]')
                .textContent,
            shippingMethod: document.querySelector('[data-testid="配送の方法"]')
                .textContent,
            shippingFromArea: document.querySelector('[data-testid="発送元の地域"]')
                .textContent,
            shippingDuration: document.querySelector('[data-testid="発送までの日数"]')
                .textContent,
            price: document
                .querySelector('[data-testid="price"]')
                .getAttribute('value'),
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
