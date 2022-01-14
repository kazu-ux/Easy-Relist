"use strict";
(function () {
    let count = 0;
    const interval = setInterval(async () => {
        count += 1;
        //一秒ごとにログを表示する
        if (count % 10 === 0) {
            console.log('trading繰り返し');
        }
        const element = document.querySelector('[data-testid="transaction:information-for-seller"] mer-list');
        const relistButtonElement = document.querySelector('div.relist-button');
        if (relistButtonElement) {
            count = 0;
            clearInterval(interval);
            return;
        }
        if (element) {
            count = 0;
            clearInterval(interval);
            await createRelistButton(element);
            await createSellByRakumaButton(element);
        }
        else if (count === 50) {
            console.log('ターゲット要素が見つかりませんでした');
            count = 0;
            clearInterval(interval);
        }
    }, 100);
    const createRelistButton = async (element) => {
        const divElement = document.createElement('div');
        divElement.className = 'relist-button';
        divElement.textContent = '再出品する!';
        divElement.onclick = () => {
            chrome.runtime.sendMessage({
                url: 'https://jp.mercari.com/sell/create',
                type: 'mercari',
            });
        };
        element.appendChild(divElement);
        return;
    };
    const createSellByRakumaButton = async (element) => {
        const divElement = document.createElement('div');
        divElement.className = 'rakuma-sell';
        divElement.textContent = 'ラクマで売る!';
        divElement.onclick = () => {
            chrome.runtime.sendMessage({
                url: 'https://fril.jp/item/new',
                type: 'rakuma',
            });
        };
        element.appendChild(divElement);
        return;
    };
})();
