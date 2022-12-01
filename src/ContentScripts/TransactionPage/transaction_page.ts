import './css/style.css';

const TransactionPage = () => {
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
    } else if (count === 50) {
      console.log('ターゲット要素が見つかりませんでした');
      count = 0;
      clearInterval(interval);
    }
  }, 100);

  async function createRelistButton(element: Element) {
    const onClick = () => {
      window.open(getItemUrl());
    };

    const divElement = document.createElement('div');
    divElement.className = 'relist-button';
    divElement.textContent = '再出品する！';
    divElement.onclick = onClick;

    element.appendChild(divElement);

    return divElement;
  }
  function getItemUrl() {
    const targetElement: HTMLLinkElement | null = document.querySelector(
      '[data-testid="transaction:information-for-seller"] a'
    );
    if (!targetElement) {
      alert('商品ページのURL要素が見つかりませんでした');
      return '';
    }
    const targetUrl = targetElement.href;
    return targetUrl;
  }
};

export default TransactionPage;
