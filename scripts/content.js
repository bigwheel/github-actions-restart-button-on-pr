// TODO: https://stackoverflow.com/questions/19191679/chrome-extension-inject-js-before-page-load

function createRestartButton() {
  const button = document.createElement("button");
  button.textContent = "Restart";
  button.className = "btn btn-sm";

  return button;
}

function alreadyInserted(parentNode, insertingNode) {
  // Don't use forEach to early return
  for (i = 0; i < parentNode.childNodes.length; i++)
    if (parentNode.childNodes[i].isEqualNode(insertingNode)) return true;
  return false;
}

let safetyCounter = 0;

const observer = new MutationObserver(() => {
  const detailsLinkSelector = "div.merge-status-list > div > div > a";
  const detailsLinks = document.querySelectorAll(detailsLinkSelector);

  detailsLinks.forEach((detailsLink) => {
    const button = createRestartButton();
    if (!alreadyInserted(detailsLink.parentNode, button)) {
      if (100 < ++safetyCounter) {
        console.log("abort");
        observer.disconnect();
      }

      detailsLink.parentNode.insertBefore(button, detailsLink);
    }
  });
});

observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});
