chrome.storage.sync.get(["github_token"]).then((result) => {
  const before = result.github_token == null ? "" : result.github_token;
  const input = window.prompt(
    "Put GitHub Personal Access Token with permission `Read and Write access to actions`",
    before
  );
  const new_value = input == null || input == "" ? null : input;
  chrome.storage.sync.set({ github_token: new_value }).then(() => {
    window.alert("Please reload GitHub page tab !");
  });
});
