function formatOnlyDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Dodanie 1, bo miesiące w JS są indeksowane od zera
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getActualUserInfo() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    const apiUrl = userId
      ? `/users/getActualUserInfo/${userId}`
      : "/users/getActualUserInfo";

    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const userInfo = await response.json();
      document.getElementById("userNameAndSurname").innerHTML =
        userInfo.firstName + " " + userInfo.lastName;
      document.getElementById("userEmail").innerHTML =
        "<strong>Email: </strong>" + userInfo.email;
      const userFriends =
        userInfo.friends.length > 0 ? userInfo.friends.length : 0;
      document.getElementById("userNrOfFriends").innerHTML =
        "<strong>Friends: </strong>" + userFriends;
      document.getElementById("userJoinDate").innerHTML =
        "<strong>Joined: </strong>" +
        formatOnlyDate(new Date(userInfo.joinDate));
      const userPosts = userInfo.posts.length > 0 ? userInfo.posts.length : 0;
      document.getElementById("userNrOfPosts").innerHTML =
        "<strong>Posts: </strong>" + userPosts;
      userImagePath = `users/getActualUserImage/${userInfo._id}`;
      if (userInfo.userImage) {
        document.getElementById("userImg").src = userImagePath;
      }
      if (userInfo.description) {
        document.getElementById("userDescription").innerHTML =
          userInfo.description;
      }
      //hiding manageButtons for foreign user profile
      if (userId) {
        if (!userInfo.description) {
          document.getElementById("userDescription").innerHTML = "";
        }
        document.getElementById("editDescriptionButton").style =
          "display: none;";
        document.getElementById("generateCvButton").style = "display: none;";
        document.getElementById("addFriendOnProfileButton").style =
          "display: block;";

        document
          .getElementById("addFriendOnProfileButton")
          .addEventListener("click", () => {
            sendInvitation(userId);
            displayLockedRequestSentButton();
          });
        if (await verifyIfUserIsYourFriend(userId)) {
          displayLockedFriendButton();
        } else if (await verifyIfUserIsInvited(userId)) {
          displayLockedRequestSentButton();
        }
      }
    } else {
      console.error("Failed to get user request:", response.statusText);
      alert('Failed to download user actual data');
    }
  } catch (error) {
    console.error("Network error during loading user info:", error);
    alert('Network error during loading user info');
  }
}

function displayLockedFriendButton() {
  document
    .getElementById("addFriendOnProfileButton")
    .setAttribute("disabled", "true");
  document.getElementById("addFriendOnProfileButton").innerHTML = "Friend";
  document.getElementById("addFriendOnProfileButton").style =
    "background-color: grey";
}

function displayLockedRequestSentButton() {
  document
    .getElementById("addFriendOnProfileButton")
    .setAttribute("disabled", "true");
  document.getElementById("addFriendOnProfileButton").innerHTML =
    "Request sent";
  document.getElementById("addFriendOnProfileButton").style =
    "background-color: lightgrey";
}

async function saveDescription() {
  try {
    const newDescription = document.getElementById("newDescription").value;
    const response = await fetch("/users/updateUserDescription", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newDescription }),
    });
    if (response.ok) {
      document.getElementById("closeDescriptionModal").click();
      getActualUserInfo();
    } else {
      console.error("Failed to update user description:", response.statusText);
      alert('Failed to update user description');
    }
  } catch (error) {
    console.error("Network error during updating user description: ", error);
    alert('Network error during updating user description');
  }
}

function showLoadingModal() {
  const loadingModal = document.getElementById("loadingModal");
  loadingModal.classList.add("show");
  loadingModal.style.display = "block";
  window.location.href = "/ai/cv";
}
