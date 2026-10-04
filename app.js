const searchForm = document.querySelector("#search-form");
const usernameInput = document.querySelector("#username");
const message = document.querySelector("#message");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();

  if (username === "") {
    message.textContent = "Please enter a GitHub username.";
    return;
  }

  message.textContent = `Searching for ${username}...`;
});
