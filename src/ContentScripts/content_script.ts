import TransactionPage from './TransactionPage/transaction_page';

const isTransactionPage = (url: string) => {
  return url.includes('https://jp.mercari.com/transaction/');
};

let href = location.href;
if (isTransactionPage(href)) {
  TransactionPage();
}

const observer = new MutationObserver(() => {
  if (href === location.href) return;

  if (!isTransactionPage(location.href)) return;
  TransactionPage();

  href = location.href;
});

observer.observe(document, { childList: true, subtree: true });
