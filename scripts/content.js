// TODO: https://stackoverflow.com/questions/19191679/chrome-extension-inject-js-before-page-load
console.log("load content script");
const observer = new MutationObserver(() => {
  const ghaDetailsLink = "div.merge-status-list > div > div > a";
  const links = document.querySelectorAll(ghaDetailsLink);
  links.forEach((link) => {
    console.log(link.parentNode.childNodes);
    const button = document.createElement("span");
    button.textContent = "Restart";
    link.parentNode.insertBefore(button, link);
    observer.disconnect();
  });

  console.log("Added div element");
});
observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});
