/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/sleep.ts":
/*!**********************!*\
  !*** ./src/sleep.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sleep": () => (/* binding */ sleep)
/* harmony export */ });
const sleep = (time) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, time);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sleep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sleep */ "./src/sleep.ts");

//取引ページに再出品ボタンを設置する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' &&
        tab.url?.includes('https://jp.mercari.com/transaction/')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['trading_page.js'],
        });
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['css/style.css'],
        });
    }
    /// 開発用
    if (changeInfo.status === 'complete' &&
        tab.url?.includes('https://fril.jp/item/new')) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['rakuma_sell_page.js'],
        });
    }
    ///
});
chrome.webRequest.onSendHeaders.addListener(async (details) => {
    const method = details.method;
    const initiator = details.initiator;
    const tabId = details.tabId;
    console.log(details);
    if (tabId === -1) {
        return;
    }
    const currentTabUrl = (await chrome.tabs.get(tabId)).url;
    if (!(method === 'GET') ||
        !(initiator === 'https://jp.mercari.com') ||
        !currentTabUrl.includes('transaction')) {
        return;
    }
    const requestUrl = details.url;
    const requestHeaders = details.requestHeaders;
    const requestHeader = Object.fromEntries(requestHeaders.map((header) => [header.name, header.value]));
    // sleep処理 (ms)
    await (0,_sleep__WEBPACK_IMPORTED_MODULE_0__.sleep)(2000);
    const json = await (await fetch(requestUrl, {
        headers: requestHeader,
    })).json();
    await chrome.storage.local.set({ json });
    const result = await chrome.storage.local.get(null);
    console.log(result);
}, {
    urls: ['https://api.mercari.jp/items/get?id=*'],
}, ['requestHeaders', 'extraHeaders']);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.tabs.create({ active: true, pinned: false, url: message.url }, async (tab) => {
        const tabId = tab.id;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
        if (message.type === 'rakuma') {
            chrome.scripting.executeScript({
                target: { tabId },
                files: ['rakuma_sell_page.js'],
            });
        }
        // chrome.tabs.remove(tabId);
    });
});

})();

/******/ })()
;