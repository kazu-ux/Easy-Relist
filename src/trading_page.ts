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
      await clickEvent();
    } else if (count === 50) {
      alert('ターゲット要素が見つかりませんでした');
      count = 0;
      clearInterval(interval);
    }
  }, 100);

  async function createRelistButton(element: Element): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const divElement = document.createElement('div');
      divElement.className = 'relist-button';
      divElement.textContent = '再出品する！';

      element.appendChild(divElement);

      resolve();
    });
  }
  function getItemUrl() {
    const targetElement: HTMLLinkElement | null = document.querySelector(
      '[data-testid="transaction:information-for-seller"] a'
    );
    if (!targetElement) {
      alert('商品ページのURL要素が見つかりませんでした');
      return;
    }
    const targetUrl = targetElement.href;
    return targetUrl;
  }

  async function clickEvent() {
    const relistButtonElement = document.querySelector('div.relist-button');
    relistButtonElement!.addEventListener('click', async () => {
      chrome.runtime.sendMessage({
        sender: 'tradingPage',
        url: getItemUrl(),
      });
    });
  }
})();
