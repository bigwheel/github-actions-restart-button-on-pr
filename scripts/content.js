// TODO: https://stackoverflow.com/questions/19191679/chrome-extension-inject-js-before-page-load

function createRestartButton() {
  const button = document.createElement("span");
  button.textContent = "Restart";
  button.className = "btn btn-sm";

  return button;
}

function alreadyInserted(parentNode, insertingNode) {
  parentNode.childNodes.forEach((node) => {
    if (node.isEqualNode(insertingNode)) return true;
  });
  return false;
}

i = 0;

const observer = new MutationObserver(() => {
  const detailsLinkSelector = "div.merge-status-list > div > div > a";
  const detailsLinks = document.querySelectorAll(detailsLinkSelector);
  detailsLinks.forEach((link) => {
    console.log(link.parentNode.childNodes);
    const button = createRestartButton();
    if (!alreadyInserted(link.parentNode, button)) {
      link.parentNode.insertBefore(button, link);
      i = i + 1;
      if (100 < i) {
        console.log("abort");
        observer.disconnect();
      }
    }
  });

  console.log("Added div element");
});
observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});
