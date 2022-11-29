let href = location.href;

console.log(href);

const observer = new MutationObserver(() => {
  if (href === location.href) return;
  console.log(location.href);

  const isSearchPage = location.href.includes('/tags/');
  if (!isSearchPage) {
    // chrome.runtime.sendMessage(WorksStyle.visible);
  }
  href = location.href;
});

observer.observe(document, { childList: true, subtree: true });
