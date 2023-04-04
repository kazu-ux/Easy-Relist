import ChromeStorage from '../Storage/chrome_storage';

(async () => {
  const relistButtonName = 'relist_button';

  const relistButton = () => {
    const handleClick = async () => {
      const currentURL = window.location.href;
      const itemId = currentURL.split('/')[4];
      console.log(itemId);

      const itemPageURL = 'https://jp.mercari.com/item/' + itemId;

      await ChromeStorage.setIsLoading(true);
      window.open(itemPageURL, '_blank');
    };

    const button = document.createElement('button');
    button.innerText = 'Relist';
    button.classList.add(relistButtonName);
    button.onclick = handleClick;
    return button;
  };

  // debounce関数の定義
  const debounce = (func: () => void, wait: number) => {
    let timeout: number | undefined;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

  // MutationObserverのインスタンス作成
  const observer = new MutationObserver(
    debounce(async () => {
      // DOM変更が検出されたときの処理
      const url = window.location.href;
      if (!url.includes('https://jp.mercari.com/transaction/')) {
        document.querySelector(`.${relistButtonName}`)?.remove();
        return;
      }
      if (document.querySelector(`.${relistButtonName}`)) return;
      document.querySelector('body')?.before(relistButton());
      console.log(url);
    }, 1000)
  );

  // 監視対象の要素を取得
  const target = document.querySelector('body')!;

  // 監視オプションを設定
  const config = { childList: true, subtree: true, attributes: true };

  // 監視開始
  observer.observe(target, config);
})();
