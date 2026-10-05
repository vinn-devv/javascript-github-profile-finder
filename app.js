const searchForm = document.querySelector("#search-form");
const usernameInput = document.querySelector("#username");
const message = document.querySelector("#message");
const profile = document.querySelector("#profile");

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();

  if (username === "") {
    message.textContent = "Please enter a GitHub username.";
    return;
  }

  message.textContent = `Searching for ${username}...`;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "GitHub user not found."
          : "Something went wrong. Please try again.",
      );
    }

    const user = await response.json();

    profile.innerHTML = `
    <img src="${user.avatar_url}" alt="user avatar">
    <h2>${user.name || user.login}</h2>
    <p>${user.login}</p>
    <p>${user.bio || "No bio available."} </p> 
    <p>${user.location || "No location available."}</p>
    <p>${user.public_repos}</p>
    <p> Followers: ${user.followers}</p>
    <p> Following: ${user.following}</p>
    <a href="${user.html_url}" target="_blank" rel="noopener noreferrer"> View GitHub Profile </a>
    
    `;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
  }
});
