const setItemId = (itemId: string) => {
  return chrome.storage.local.set({ itemId });
};

const getItemId = async (): Promise<string | undefined> => {
  return (await chrome.storage.local.get('itemId')).itemId;
};

const setItemData = (itemData: ItemData) => {
  return chrome.storage.local.set({ itemData });
};

const getItemData = async (): Promise<ItemData | undefined> => {
  return (await chrome.storage.local.get('itemData')).itemData;
};

const deleteItemData = () => {
  return chrome.storage.local.remove('itemData');
};

const getHeaders = async (): Promise<[] | undefined> => {
  return (await chrome.storage.local.get('headers')).headers;
};

const setIsLoading = (isLoading: boolean) => {
  return chrome.storage.local.set({ isLoading });
};

const getIsLoading = async (): Promise<boolean | undefined> => {
  return (await chrome.storage.local.get('isLoading')).isLoading;
};

const ChromeStorage = {
  setItemId,
  getItemId,
  setItemData,
  getItemData,
  deleteItemData,
  getHeaders,
  setIsLoading,
  getIsLoading,
};

export default ChromeStorage;
