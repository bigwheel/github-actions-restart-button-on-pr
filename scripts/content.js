// TODO: https://stackoverflow.com/questions/19191679/chrome-extension-inject-js-before-page-load
console.log("load content script");
const observer = new MutationObserver(() => {
  const ghaDetailsLink = "div.merge-status-list > div > div > a";
  const links = document.querySelectorAll(ghaDetailsLink);
  console.log(links);
  links.forEach((link) => {
    console.log(link);
  });

  console.log("Added div element");
});
observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});
