const setRelistButton = () => {
  const createRelistButton = () => {
    const divElement = document.createElement('div');
    divElement.className = 'relist-button';
    divElement.textContent = '再出品する！';
    divElement.onclick = (event: MouseEvent) => {
      chrome.runtime.sendMessage('センドメッセージ');
      console.log(event);
    };
    return divElement;
  };

  const getTargetElement = () =>
    document.querySelector(
      '[data-testid="transaction:information-for-seller"] mer-list'
    );

  const interval = setInterval(() => {
    const targetElement = getTargetElement();

    if (targetElement) {
      clearInterval(interval);
      console.log(targetElement);

      if (!targetElement) return;
      targetElement.append(createRelistButton());
    }
  }, 1000);
};

export default setRelistButton;
