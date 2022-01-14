import { Item } from './types';

(async () => {
  const json: Item = (await chrome.storage.local.get('json')).json.data;
  const item = {
    name: json.name,
    description: json.description,
  };

  console.log(item);
})();
