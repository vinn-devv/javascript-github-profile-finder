const searchForm = document.querySelector("#search-form");
const usernameInput = document.querySelector("#username");
const message = document.querySelector("#message");
const profile = document.querySelector("#profile");
const searchButton = document.querySelector("#search-form button");
let currentPage = 1;
let currentUsername = "";

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

async function getGithubRepositories(username, limit, page) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}&page=${page}`,
  );

  if (!response.ok) {
    throw new Error("Could not load repositories.");
  }

  const repositories = await response.json();

  return repositories;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function showEmptyState() {
  profile.innerHTML = `
    <div class="empty-state">
      <p>Search for a GitHub username to see their profile.</p>
    </div>
  `;
}

function renderRepositories(repositories) {
  return repositories
    .map(
      (repository) => `
        <article class="repository">
          <h4>${repository.name}</h4>

          <p>
            ${repository.description || "No description available."}
          </p>

          <p class="repository-language">
            Language: ${repository.language || "Not specified"}
          </p>

          <p class="repository-stars">
            Stars: ${repository.stargazers_count}
          </p>

          <p class="repository-forks">
            Forks: ${repository.forks_count}
          </p>

          <div class="repository-topics">
            ${
              repository.topics.length === 0
                ? `<span class="no-topics">No topics</span>`
                : repository.topics
                    .map((topic) => `<span class="topic">${topic}</span>`)
                    .join("")
            }
          </div>

          <a
            href="${repository.html_url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repository
          </a>
        </article>
      `,
    )
    .join("");
}

function renderProfile(user, repositories) {
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

      <h3>Latest Repositories</h3>

      <div class="repositories">
        ${
          repositories.length === 0
            ? `<p class="no-repositories">No public repositories available.</p>`
            : renderRepositories(repositories)
        }
      </div>

      <button type="button" id="load-more">
        Load More
      </button>
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

  currentUsername = username;
  currentPage = 1;

  message.textContent = `Searching for ${username}...`;
  searchButton.disabled = true;

  try {
    const user = await getGithubUser(username);

    const repositories = await getGithubRepositories(username, 5, 1);

    usernameInput.value = "";
    message.textContent = "";

    renderProfile(user, repositories);
    const loadMoreButton = document.querySelector("#load-more");

    loadMoreButton.addEventListener("click", async function () {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading...";

      try {
        const nextPage = currentPage + 1;

        const repositories = await getGithubRepositories(
          currentUsername,
          5,
          nextPage,
        );

        const repositoriesContainer = document.querySelector(".repositories");

        repositoriesContainer.insertAdjacentHTML(
          "beforeend",
          renderRepositories(repositories),
        );

        currentPage = nextPage;
      } catch (error) {
        console.error("Error loading more repositories:", error);
        message.textContent = error.message;
      } finally {
        loadMoreButton.disabled = false;
        loadMoreButton.textContent = "Load More";
      }
    });
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    message.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
});

showEmptyState();
