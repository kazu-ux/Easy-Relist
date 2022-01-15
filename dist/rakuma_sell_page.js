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
/*!*********************************!*\
  !*** ./src/rakuma_sell_page.ts ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sleep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sleep */ "./src/sleep.ts");

(async () => {
    const json = (await chrome.storage.local.get('json')).json.data;
    const item = {
        photos: json.photos,
        name: json.name,
        description: json.description,
        item_category: json.item_category,
        item_condition: json.item_condition,
        shipping_player: json.shipping_payer,
        shipping_method: json.shipping_method,
        shipping_duration: json.shipping_duration,
        shipping_from_area: json.shipping_from_area,
        price: json.price,
    };
    const imageUpload = async (photos) => {
        const inputElements = document.querySelectorAll('[type="file"]');
        if (!inputElements) {
            alert('画像アップロード要素が見つかりません');
            return;
        }
        for await (const photo of photos) {
            const dataTransfer = new DataTransfer();
            const index = photos.indexOf(photo);
            const inputElement = inputElements[index];
            await (0,_sleep__WEBPACK_IMPORTED_MODULE_0__.sleep)(2000);
            const request = await fetch(photo).then((e) => e.blob());
            const file = new File([request], Date.now() + '.' + 'jpeg');
            dataTransfer.items.add(file);
            inputElement.files = dataTransfer.files;
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(photo, inputElement);
        }
    };
    imageUpload(item.photos);
    console.log(item);
})();

})();

/******/ })()
;