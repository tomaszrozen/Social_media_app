async function getFriendRequests() {
  try {
    const response = await fetch("/users/friend-requests", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const { friendRequests } = await response.json();
      const friendRequestsList = document.getElementById("friendRequestsList");
      friendRequestsList.innerHTML = "";

      friendRequests.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center",
          "mt-1",
          "shadow",
          "rounded"
        );

        const friendInfo = document.createElement("div");
        const linkFriend = document.createElement("a");
        linkFriend.classList.add("friendLink");
        linkFriend.href = `/userProfile?userId=${user._id}`;
        linkFriend.appendChild(document.createTextNode( user.firstName + " " + user.lastName));
        friendInfo.appendChild(linkFriend);
        
        const buttons = document.createElement("div");
        const acceptButton = document.createElement("button");
        acceptButton.classList.add("btn", "btn-success", "btn-sm", "mx-1", "fw-bold");
        acceptButton.textContent = "✓";
        acceptButton.addEventListener("click", () =>
          handleAcceptRequest(user._id)
        );

        const rejectButton = document.createElement("button");
        rejectButton.classList.add("btn", "btn-danger", "btn-sm", "fw-bold");
        rejectButton.textContent = "X";
        rejectButton.addEventListener("click", () =>
          handleRejectRequest(user._id)
        );

        buttons.appendChild(acceptButton);
        buttons.appendChild(rejectButton);

        listItem.appendChild(friendInfo);
        listItem.appendChild(buttons);
        friendRequestsList.appendChild(listItem);
      });
    } else {
      console.error("Failed to get friend requests:", response.statusText);
      alert('Failed to get friend requests');
    }
  } catch (error) {
    console.error("Network error during friend requests retrieval:", error);
    alert('Network error during getting friend requests');
  }
}

async function getRecommendedFriends() {
  try {
    const response = await fetch("/users/recommended-friends", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const { recommendedFriends } = await response.json();
      const recommendedFriendsList = document.getElementById(
        "recommendedFriendsList"
      );
      recommendedFriendsList.innerHTML = "";

      recommendedFriends.slice(0, 5).forEach((user) => {
        const listItem = document.createElement("li");
        listItem.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center",
          "mt-1",
          "shadow",
          "rounded"
        );
        const friendInfo = document.createElement("div");
        const linkFriend = document.createElement("a");
        linkFriend.classList.add("friendLink");
        linkFriend.href = `/userProfile?userId=${user._id}`;
        linkFriend.appendChild(document.createTextNode( user.firstName + " " + user.lastName));
        friendInfo.appendChild(linkFriend);

        const sendInvitationButton = document.createElement("button");
        sendInvitationButton.classList.add("btn", "btn-success", "btn-sm", "ms-2");
        sendInvitationButton.textContent = "Invite";
        sendInvitationButton.addEventListener("click", () =>
        {
          sendInvitation(user._id);
          getRecommendedFriends();
        }
          
        );

        listItem.appendChild(friendInfo);
        listItem.appendChild(sendInvitationButton);

        recommendedFriendsList.appendChild(listItem);
      });
    } else {
      console.error("Failed to get recommended friends:", response.statusText);
      alert('Failed to get recommended friends');
    }
  } catch (error) {
    console.error("Network error during recommended friends retrieval:", error);
    alert('Network error during recommended friends retrieval');
  }
}
async function sendInvitation(userId) {
  try {
    const response = await fetch(`/users/sendFriendRequest/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      if (window.location.pathname === '/home') {
        getRecommendedFriends();
      }
    } else {
      console.error("Failed to send invitation:", response.statusText);
      alert('Failed to send invitation')
    }
  } catch (error) {
    console.error("Network error during sending invitation:", error);
    alert('Network error during sending invitation')
  }
}

async function verifyIfUserIsYourFriend(userId) {
  try {
    const response = await fetch(`/users/verifyIfUserIsYourFriend/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const isFriend = await response.json()
      return isFriend.result;
    } else {
      console.error("Failed to verify if user is your friend:", response.statusText);
      alert('Failed to verify if user is your friend');
    }
  } catch (error) {
    console.error("Network error during sending invitation:", error);
    alert('Network error during sending invitation');
  }
}

async function verifyIfUserIsInvited(userId) {
  try {
    const response = await fetch(`/users/verifyIfUserIsInvited/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const isInvited = await response.json()
      return isInvited.result;
    } else {
      console.error("Failed to verify if user is your friend:", response.statusText);
      alert('Failed to verify if user is your friend');
    }
  } catch (error) {
    console.error("Network error during sending invitation:", error);
    alert('Network error during sending invitation');
  }
}

async function handleAcceptRequest(userId) {
  try {
    const response = await fetch(`/users/acceptFriendRequest/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      getFriendRequests();
    } else {
      console.error("Failed to accept friend request:", response.statusText);
      alert('Failed to accept friend request');
    }
  } catch (error) {
    console.error("Network error during accepting friend request:", error);
    alert('Network error during accepting friend request');
  }
}

async function handleRejectRequest(userId) {
  try {
    const response = await fetch(`/users/rejectFriendRequest/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      getFriendRequests();
    } else {
      console.error("Failed to reject friend request:", response.statusText);
      alert('Failed to reject friend request');
    }
  } catch (error) {
    console.error("Network error during rejecting friend request:", error);
    alert('Network error during rejecting friend request');
  }
}
