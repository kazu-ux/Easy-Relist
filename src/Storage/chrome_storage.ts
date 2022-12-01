const setItemData = (itemData: ItemData) => {
  return chrome.storage.local.set({ itemData });
};

const getItemData = async (): Promise<ItemData | undefined> => {
  return (await chrome.storage.local.get('itemData')).itemData;
};

const deleteItemData = () => {
  return chrome.storage.local.remove('itemData');
};

const ChromeStorage = {
  setItemData,
  getItemData,
  deleteItemData,
};

export default ChromeStorage;
