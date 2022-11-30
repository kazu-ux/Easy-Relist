import TransactionPage from './TransactionPage/transaction_page';

let href = location.href;

TransactionPage();

const observer = new MutationObserver(() => {
  if (href === location.href) return;

  const isTransactionPage = location.href.includes(
    'https://jp.mercari.com/transaction/'
  );
  if (!isTransactionPage) return;
  TransactionPage();

  href = location.href;
});

observer.observe(document, { childList: true, subtree: true });
