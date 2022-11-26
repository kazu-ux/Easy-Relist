const setItemId = (itemId: string) => {
  chrome.storage.local.set({ itemId });
};

const setItemData = (itemData: ResponseBody) => {
  chrome.storage.local.set({ itemData });
};
const getItemData = async () => {
  const itemData = (await chrome.storage.local.get('itemData'))
    .itemData as ResponseBody;
  return itemData;
};

const setDraftItem = (draftItem: DraftItem) => {
  chrome.storage.local.set({ draftItem });
};

const getDraftItem = async () => {
  return (await chrome.storage.local.get('draftItem')).draftItem as DraftItem;
};

const setRequestHeader = (requestHeader: RequestHeader) => {
  chrome.storage.local.set({ requestHeader });
};

const getRequestHeader = async () => {
  return (await chrome.storage.local.get('requestHeader'))
    .requestHeader as RequestHeader;
};

export const ChromeStorage = {
  setItemId,
  setItemData,
  getItemData,
  setDraftItem,
  getDraftItem,
  setRequestHeader,
  getRequestHeader,
};
