// TODO: https://stackoverflow.com/questions/19191679/chrome-extension-inject-js-before-page-load

let global_token = "";

chrome.storage.sync.get(["github_token"]).then((result) => {
  if (result.github_token != null) global_token = result.github_token;
});

function createPushRestartButton(targetUrl) {
  return () => {
    if (global_token != "") {
      fetch(targetUrl, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${global_token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    } else {
      alert(
        "Firstly set GitHub Personal Access Token by clicking extension icon."
      );
    }
  };
}

function createRestartButton(workflowRunUrl) {
  const button = document.createElement("button");
  button.textContent = "Restart";
  button.className = "btn btn-sm";

  // https://github.com/org_name/repo_name/actions/runs/1824374999/job/58560149807?pr=4012
  const urlRegex = new RegExp(
    "^https://github\\.com/(?<org>[^/]+)/(?<repo>[^/]+)/actions/runs/(?<run_id>\\d+)/job/(?<job_id>\\d+).*$"
  );
  const matchResult = workflowRunUrl.match(urlRegex);
  const org = matchResult.groups["org"];
  const repo = matchResult.groups["repo"];
  const run_id = matchResult.groups["run_id"];
  const targetUrl = `https://api.github.com/repos/${org}/${repo}/actions/runs/${run_id}/rerun`;

  button.addEventListener("click", createPushRestartButton(targetUrl));

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
