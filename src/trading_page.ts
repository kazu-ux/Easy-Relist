(function () {
  let count = 0;
  const interval = setInterval(async () => {
    count += 1;
    //一秒ごとにログを表示する
    if (count % 10 === 0) {
      console.log('trading繰り返し');
    }

    const element = document.querySelector(
      '[data-testid="transaction:information-for-seller"] mer-list'
    );

    const relistButtonElement = document.querySelector('div.relist-button');
    if (relistButtonElement) {
      count = 0;
      clearInterval(interval);
      return;
    }
    if (element) {
      count = 0;
      clearInterval(interval);
      await createRelistButton(element);
      await createSellByRakumaButton(element);
      await clickEvent();
    } else if (count === 50) {
      console.log('ターゲット要素が見つかりませんでした');
      count = 0;
      clearInterval(interval);
    }
  }, 100);

  const createRelistButton = async (element: Element): Promise<void> => {
    const divElement = document.createElement('div');
    divElement.className = 'relist-button';
    divElement.textContent = '再出品する!';

    element.appendChild(divElement);
    return;
  };

  const createSellByRakumaButton = async (element: Element) => {
    const divElement = document.createElement('div');
    divElement.className = 'rakuma-sell';
    divElement.textContent = 'ラクマで売る!';
    element.appendChild(divElement);
    return;
  };

  const getItemUrl = () => {
    const targetElement: HTMLLinkElement | null = document.querySelector(
      '[data-testid="transaction:information-for-seller"] a'
    );
    if (!targetElement) {
      alert('商品ページのURL要素が見つかりませんでした');
      return;
    }
    const targetUrl = targetElement.href;
    return targetUrl;
  };

  const clickEvent = () => {
    const relistButtonElement = document.querySelector('div.relist-button');
    relistButtonElement!.addEventListener('click', async () => {
      chrome.runtime.sendMessage({
        sender: 'tradingPage',
        url: getItemUrl(),
      });
    });
  };
})();
