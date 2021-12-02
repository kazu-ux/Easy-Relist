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
        if (!imageUrl) {
            alert('画像のURL取得に失敗しました');
            return [''];
        }
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
            if (!base64) {
                alert('画像のbase64取得にエラーが発生しました');
                return [''];
            }
            imageBase64s.push(base64.toString());
        }
        return imageBase64s;
    });
}
function getCategories() {
    const categoryIds = [];
    //pop() メソッドは、配列から最後の要素を取り除き、その要素を返します。
    //このメソッドは配列の長さを変化させます。
    const targetElements = document.querySelectorAll('mer-breadcrumb-list [data-location="item:item_detail_table:link:go_search"]');
    const categoryIdElement = Array.from(targetElements).pop();
    if (!categoryIdElement) {
        alert('カテゴリー要素の取得に失敗しました');
        return [];
    }
    const tCategoryIds = categoryIdElement.href.match(/t._category_id=[0-9]*/g);
    if (!tCategoryIds) {
        alert('カテゴリーID取得の正規表現にエラーが発生しました');
        return [''];
    }
    for (const tCategoryId of tCategoryIds) {
        const formattedCategoryId = tCategoryId.match(/[0-9]+$/);
        if (!formattedCategoryId) {
            alert('カテゴリーIDの整形にエラーが発生しました');
            return [''];
        }
        categoryIds.push(formattedCategoryId[0]);
    }
    console.log(categoryIds);
    return categoryIds;
}
function setProduct() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return __awaiter(this, void 0, void 0, function* () {
        const product = {
            images: yield getBase64(getImageUrl()),
            category: getCategories(),
            size: (_b = (_a = document.querySelector('[data-testid="商品のサイズ"]')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '',
            brand: (_d = (_c = document.querySelector('[data-testid="ブランド"]')) === null || _c === void 0 ? void 0 : _c.textContent) !== null && _d !== void 0 ? _d : '',
            itemCondition: (_f = (_e = document.querySelector('[data-testid="商品の状態"]')) === null || _e === void 0 ? void 0 : _e.textContent) !== null && _f !== void 0 ? _f : '',
            name: (_h = (_g = document
                .querySelector('[data-testid="name"]')) === null || _g === void 0 ? void 0 : _g.getAttribute('title-label')) !== null && _h !== void 0 ? _h : '',
            description: (_k = (_j = document.querySelector('[data-testid="description"]')) === null || _j === void 0 ? void 0 : _j.textContent) !== null && _k !== void 0 ? _k : '',
            shippingPayer: (_m = (_l = document.querySelector('[data-testid="配送料の負担"]')) === null || _l === void 0 ? void 0 : _l.textContent) !== null && _m !== void 0 ? _m : '',
            shippingMethod: (_p = (_o = document.querySelector('[data-testid="配送の方法"]')) === null || _o === void 0 ? void 0 : _o.textContent) !== null && _p !== void 0 ? _p : '',
            shippingFromArea: (_r = (_q = document.querySelector('[data-testid="発送元の地域"]')) === null || _q === void 0 ? void 0 : _q.textContent) !== null && _r !== void 0 ? _r : '',
            shippingDuration: (_t = (_s = document.querySelector('[data-testid="発送までの日数"]')) === null || _s === void 0 ? void 0 : _s.textContent) !== null && _t !== void 0 ? _t : '',
            price: (_v = (_u = document.querySelector('[data-testid="price"]')) === null || _u === void 0 ? void 0 : _u.getAttribute('value')) !== null && _v !== void 0 ? _v : '',
        };
        return product;
    });
}
(function () {
    let count = 0;
    const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        count += 1;
        //一秒ごとにログを表示する
        if (count % 10 === 0) {
            console.log('sold繰り返し');
        }
        /*     const element = document.querySelector(
          '[data-testid="checkout-button-container"]'
        ); */
        const element = document.querySelector('[data-testid="view-transaction-button"]');
        if (element) {
            count = 0;
            clearInterval(interval);
            const productInfo = yield setProduct();
            window.location.href = 'https://jp.mercari.com/sell/create';
            console.log(productInfo);
            chrome.runtime.sendMessage({
                sender: 'soldPage',
                productInfo,
            });
        }
        else if (count === 50) {
            count = 0;
            clearInterval(interval);
        }
    }), 100);
})();
