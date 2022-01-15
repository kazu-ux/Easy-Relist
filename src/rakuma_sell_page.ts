import { sleep } from './sleep';
import { Item } from './types';

(async () => {
  const json: Item = (await chrome.storage.local.get('json')).json.data;
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

  const imageUpload = async (photos: string[]) => {
    const inputElements: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('[type="file"]');
    if (!inputElements) {
      alert('画像アップロード要素が見つかりません');
      return;
    }
    for await (const photo of photos) {
      const dataTransfer = new DataTransfer();
      const index = photos.indexOf(photo);
      const inputElement = inputElements[index];
      await sleep(2000);

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
