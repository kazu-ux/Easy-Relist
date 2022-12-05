const setItemData = (itemData: ItemData) => {
  return chrome.storage.local.set({ itemData });
};

const getItemData = async (): Promise<ItemData | undefined> => {
  return (await chrome.storage.local.get('itemData')).itemData;
};

const deleteItemData = () => {
  return chrome.storage.local.remove('itemData');
};

const setIsLoading = (isLoading: boolean) => {
  return chrome.storage.local.set({ isLoading });
};

const getIsLoading = async (): Promise<boolean | undefined> => {
  return (await chrome.storage.local.get('isLoading')).isLoading;
};

const ChromeStorage = {
  setItemData,
  getItemData,
  deleteItemData,
  setIsLoading,
  getIsLoading,
};

export default ChromeStorage;
