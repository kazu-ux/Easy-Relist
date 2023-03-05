import ChromeStorage from '../../Storage/chrome_storage';
import './css/style.css';

const TransactionPage = () => {
  let count = 0;

  const checkForElement = async () => {
    const element = document.querySelector(
      '[data-testid="transaction:information-for-seller"] mer-list'
    );
    const relistButtonElement = document.querySelector('div.relist-button');

    count++;

    // 10秒ごとにログを出力する
    if (count % 10 === 0) {
      console.log('trading繰り返し');
    }

    if (relistButtonElement) {
      clearInterval(interval);
      console.log('再出品ボタンが見つかりました。インターバルを停止します。');
      return;
    }

    if (element) {
      clearInterval(interval);
      console.log('ターゲット要素が見つかりました。再出品ボタンを作成します。');
      createRelistButton(element);
      return;
    }

    if (count === 50) {
      clearInterval(interval);
      console.log('ターゲット要素が50回の試行で見つかりませんでした。');
      return;
    }
  };

  const interval = setInterval(checkForElement, 100);

  const createRelistButton = (element: Element) => {
    const onClick = async () => {
      const itemUrl = getItemUrl();
      await ChromeStorage.setIsLoading(true);
      window.open(itemUrl);
    };

    const divElement = document.createElement('div');
    divElement.className = 'relist-button';
    divElement.textContent = '再出品する！';
    divElement.addEventListener('click', onClick);

    element.appendChild(divElement);

    return divElement;
  };
  const getItemUrl = (): string => {
    const targetElement = document.querySelector<HTMLLinkElement>(
      '[data-testid="transaction:information-for-seller"] a'
    );

    if (!targetElement) {
      throw new Error('商品ページのURL要素が見つかりませんでした');
    }

    return targetElement.href;
  };
};

export default TransactionPage;
