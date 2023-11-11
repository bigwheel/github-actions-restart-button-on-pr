// TODO: https://stackoverflow.com/questions/19191679/chrome-extension-inject-js-before-page-load

function pushRestartButton() {
  console.log("pushed");
}

function createRestartButton(workflowRunUrl) {
  const button = document.createElement("button");
  button.textContent = "Restart";
  button.className = "btn btn-sm";

  // https://github.com/org_name/repo_name/actions/runs/1824374999/job/58560149807?pr=4012
  const urlRegex = new RegExp("^https://github\\.com/(?<org>[^/]+)/(?<repo>[^/]+)/actions/runs/(?<workflow_id>\\d+)/job/(?<job_id>\\d+).*$");
  console.log(workflowRunUrl.match(urlRegex));

  button.addEventListener("click", pushRestartButton);

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
    const button = createRestartButton(detailsLink.href);
    if (!alreadyInserted(detailsLink.parentNode, button)) {
      if (1000 < ++safetyCounter) {
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
