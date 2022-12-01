const setItemData = (itemData: ItemData) => {
  return chrome.storage.local.set({ itemData });
};

const getItemData = async () => {
  return (await chrome.storage.local.get('itemData')).itemData as ItemData;
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
