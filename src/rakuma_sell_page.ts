import { sleep } from './sleep';
import { Item, ItemCondition } from './types';

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

  const setName = (name: string) => {
    const targetElement: HTMLInputElement | null =
      document.querySelector('#name');
    if (!targetElement) {
      alert('商品名を入力する要素が見つかりません');
      return;
    }
    targetElement.value = name;
    targetElement.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const setDiscription = (description: string) => {
    const targetElement: HTMLTextAreaElement | null =
      document.querySelector('#detail');
    if (!targetElement) {
      alert('説明文を入力する要素が見つかりません');
      return;
    }
    targetElement.value = description;
    targetElement.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const setCondition = (itemCondition: ItemCondition) => {
    const targetElement: HTMLSelectElement | null =
      document.querySelector('#status');

    if (!targetElement) {
      return;
    }
    const options = Array.from(targetElement.options);
    const optionIndex = options.flatMap((option, index) => {
      if (option.textContent === itemCondition.name) {
        return [index];
      } else {
        return [];
      }
    })[0];
    console.log(optionIndex);
    if (optionIndex === undefined) {
      return;
    }

    targetElement.selectedIndex = optionIndex;
    targetElement.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // imageUpload(item.photos);
  setName(item.name);
  setDiscription(item.description);
  setCondition(item.item_condition);

  console.log(item);
})();
