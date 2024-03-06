async function getPosts() {
  // Fetch posts from the server
  const response = await fetch("/posts/getPosts", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const result = await response.json();

    displayPosts(result.posts);
  } else {
    console.error("Failed to fetch posts");
    alert('Failed to load posts');
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const isLiked = post.liked ? true: false;
    const postObject = new Post(
      post._id,
      post.author,
      post.content,
      post.comments,
      post.likes.length,
      isLiked,
      formatDate(post.createdAt)
    );
    postObject.showOnHomePage();
  });
}

function formatDate(date) {
  const createdAtDate = new Date(date);

  const year = createdAtDate.getFullYear();
  const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
  const day = String(createdAtDate.getDate()).padStart(2, "0");
  const hours = String(createdAtDate.getHours()).padStart(2, "0");
  const minutes = String(createdAtDate.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

async function addPost() {
  const content = document.getElementById("inputContent").value;
  try {
    const response = await fetch("/posts/addPost", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      getPosts();
    } else {
      console.error("Failed to add a post");
      alert('Failed to add a post');
    }
  } catch (error) {
    console.error(error);
    alert('Network error during adding a post');
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getPosts();
  getRecommendedFriends();
  getFriendRequests();
  getUserProfileName();
});
async function getUserProfileName() {
  try {
    const response = await fetch("/users/getActualUserInfo", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const userInfo = await response.json();
      document.getElementById("userProfileName").innerHTML =
        userInfo.firstName + " " + userInfo.lastName;
      if (userInfo.userImage) {
        document.getElementById(
          "userImgHomePage"
        ).src = `users/getActualUserImage/${userInfo._id}`;
      }
    } else {
      console.error("Failed to get user request:", response.statusText);
      alert('Failed to get user profile name');
    }
  } catch (error) {
    console.error("Network error during loading user info:", error);
    alert('Network error during getting user profile name');
  }
} 
