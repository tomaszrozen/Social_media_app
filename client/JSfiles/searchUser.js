const searchInput = document.getElementById("partialSearchInput");
const suggestionsContainer = document.getElementById(
  "partialSearchSuggestions"
);
// Trigger partialSearch function on input and focus events
searchInput.addEventListener("input", () => {
  partialSearch();
});

searchInput.addEventListener("focus", () => {
  partialSearch();
});
// Clear suggestions on blur with a slight delay
searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    clearPartialSearchSuggestions();
  }, 200);
});

let partialSearchUsers = [];

// Prevent form submission and redirect to the first user profile
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    redirectToFirstUserProfile();
  });
// Perform partial search based on user input
async function partialSearch() {
  const query = searchInput.value;
  if (query.trim() !== "") {
    try {
      const response = await fetch(`/users/partialSearchUsers?query=${query}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        partialSearchUsers = await response.json();
        displayPartialSearchSuggestions(partialSearchUsers);
      } else {
        console.error("Failed to perform partial search:", response.statusText);
        alert('Failed to perform partial search');
      }
    } catch (error) {
      console.error("Network error during partial search:", error);
      alert('Network error during partial search');
    }
  } else {
    clearPartialSearchSuggestions();
  }
}
// Display search suggestions based on the fetched user data
function displayPartialSearchSuggestions(users) {
  suggestionsContainer.innerHTML = "";

  if (users.length > 0) {
    const list = document.createElement("ul");
    list.classList.add("list-group");

    users.slice(0, 10).forEach((user) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "searchedUser");
      listItem.textContent = `${user.firstName} ${user.lastName}`;

      listItem.addEventListener("click", () => {
        window.location.href = `/userProfile?userId=${user._id}`;
      });

      list.appendChild(listItem);
    });

    suggestionsContainer.appendChild(list);
  } else {
    clearPartialSearchSuggestions();
  }
}

function clearPartialSearchSuggestions() {
  suggestionsContainer.innerHTML = "";
}
function redirectToFirstUserProfile() {
  if (partialSearchUsers.length > 0) {
    const firstUser = partialSearchUsers[0];
    window.location.href = `/userProfile?userId=${firstUser._id}`;
  }
}
