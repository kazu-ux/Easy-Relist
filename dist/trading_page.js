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
(function () {
    let count = 0;
    const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        count += 1;
        //一秒ごとにログを表示する
        if (count % 10 === 0) {
            console.log('trading繰り返し');
        }
        const element = document.querySelector('[data-testid="transaction:information-for-seller"] mer-list');
        if (element) {
            count = 0;
            clearInterval(interval);
            yield createRelistButton(element);
            // await getItemUrl();
            yield clickEvent();
        }
        else if (count === 50) {
            count = 0;
            clearInterval(interval);
        }
    }), 100);
    function createRelistButton(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const divElement = document.createElement('div');
                divElement.className = 'relist-button';
                divElement.textContent = '再出品する！';
                element.appendChild(divElement);
                resolve();
            }));
        });
    }
    function getItemUrl() {
        const targetElement = document.querySelector('[data-testid="transaction:information-for-seller"] a');
        const targetUrl = targetElement.href;
        return targetUrl;
    }
    function clickEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const relistButtonElement = document.querySelector('div.relist-button');
            relistButtonElement.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                chrome.runtime.sendMessage('gejelkpidobampgonfcdkkfgckaphban', {
                    sender: 'tradingPage',
                    url: getItemUrl(),
                });
            }));
        });
    }
})();
