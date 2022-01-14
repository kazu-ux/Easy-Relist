"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(async () => {
    const json = (await chrome.storage.local.get('json')).json.data;
    const item = {
        name: json.name,
        description: json.description,
    };
    console.log(item);
})();
