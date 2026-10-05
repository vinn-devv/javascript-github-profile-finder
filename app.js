const searchForm = document.querySelector("#search-form");
const usernameInput = document.querySelector("#username");
const message = document.querySelector("#message");
const profile = document.querySelector("#profile");
const searchButton = document.querySelector("#search-form button");

async function getGithubUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "GitHub user not found."
        : "Something went wrong. Please try again.",
    );
  }

  const user = await response.json();

  return user;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function renderProfile(user) {
  profile.innerHTML = `
    <div class="profile-card">
      <img src="${user.avatar_url}" alt="${user.login}'s avatar">

      <h2>${user.name || user.login}</h2>

      <p class="username">@${user.login}</p>

      <p class="bio">
        ${user.bio || "No bio available."}
      </p>

<div class="profile-info">
  <p>${user.location || "No location available."}</p>
  <p>Joined GitHub: ${formatDate(user.created_at)}</p>
</div>

<div class="stats">
  <div class="stat">
    <span>Repositories</span>
    <strong>${user.public_repos}</strong>
  </div>

  <div class="stat">
    <span>Followers</span>
    <strong>${user.followers}</strong>
  </div>

  <div class="stat">
    <span>Following</span>
    <strong>${user.following}</strong>
  </div>
</div>

      <a
        href="${user.html_url}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View GitHub Profile
      </a>
    </div>
  `;
}

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();

  if (username === "") {
    message.textContent = "Please enter a GitHub username.";
    return;
  }

  message.textContent = `Searching for ${username}...`;
  searchButton.disabled = true;
  profile.textContent = "";

  try {
    const user = await getGithubUser(username);

    usernameInput.value = "";
    message.textContent = "";

    renderProfile(user);
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    message.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
});
