class Post {
  constructor(postId, author, content, comments, likesCount, isLiked, postCreatedAt) {
    this.postId = postId;
    this.author = author;
    this.content = content;
    this.likesCount = likesCount;
    this.postCreatedAt = postCreatedAt;
    this.comments = comments ? comments : [];
    this.isLiked = isLiked;
    this.commentsContainer = document.createElement("div");
  }

  /**
   * Adds a comment to the post.
   * @param {string} text - The text of the comment to be added.
   */
  async addComment(text) {
    try {
      const response = await fetch(`/posts/addComment/${this.postId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const result = await response.json();
        const newComment = { author: result.comment.author, text: result.comment.text };
        this.comments.push(newComment);
        this.displayComments(this.comments);
      } else {
        console.error('Failed to add a comment');
        alert('Failed to add a comment')
      }
    } catch (error) {
      console.error(error);
      alert('Network error during adding a comment')
    }
  }

  /**
  * Handles the like action for the post.
  */
  async like() {
    const response = await fetch(`/posts/like/${this.postId}`, {
      method: "POST",
      headers: {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    });
    if (response.ok) {
      getPosts();
    } else {
      console.error("Failed to change the like status");
      alert('Failed to change the like status');
    }
  }

  /**
  * Displays the post on the home page with author details, content, likes, and comments.
  */
  showOnHomePage() {
    // Create a new card element to represent the post.
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "mb-2");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardDiv.appendChild(cardBody);
    // Create a section to display the author's information.
    const authorDiv  = document.createElement("div");
    authorDiv.classList.add("d-flex", "flex-start", "align-items-center")
    // Create an image element for the author's profile picture.
    const authorImage = document.createElement("img");
    authorImage.classList.add("rounded-circle", "shadow-1-strong", "me-3")
    if (this.author.userImg) {
      authorImage.src = `users/getActualUserImage/${this.author._id}`;;
    } else {
      authorImage.src = '../images/userImageExample.png';
    }
    authorImage.setAttribute("height", "50");
    authorImage.setAttribute("width", "50");
    // Create element for the author's name and post date.
    const authorInfoDiv = document.createElement("div");
    const authorName = document.createElement("h6");
    authorName.classList.add("fw-bold", "text-primary", "mb-1");
    authorName.appendChild(document.createTextNode(this.author.firstName+" "+this.author.lastName));
    // Create element for the post date.
    const postDate = document.createElement("p");
    postDate.classList.add("text-muted", "small", "mb-0");
    postDate.appendChild(document.createTextNode("Shared - " + this.postCreatedAt));
    // Append author name and post date to the author information container
    authorInfoDiv.appendChild(authorName);
    authorInfoDiv.appendChild(postDate);
    // Append author image and information to the author container
    authorDiv.appendChild(authorImage);
    authorDiv.appendChild(authorInfoDiv);
    // Append the author container to the post body
    cardBody.appendChild(authorDiv);
    // Create a paragraph element for the post content
    const postContent = document.createElement("p");
    postContent.classList.add("my-4", "px-3");
    // Set the post content text
    postContent.appendChild(document.createTextNode(this.content));
    // Append the post content to the post body
    cardBody.appendChild(postContent);
    // Create a container for post actions (like button, likes count)
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("small", "d-flex", "justify-content-start");
    // Create a container for the like action
    const likeAction = document.createElement("div");
    likeAction.classList.add("d-flex", "flex-column", "me-3");
    // Create a button for liking the post
    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "likeButton");
    likeButton.classList.add("btn", "px-0");
    // Add 'liked' class if the post is already liked
    if (this.isLiked) {
      likeButton.classList.add("liked");
    }
    // Set the like button text and onclick action
    likeButton.innerHTML = '<i class="bi bi-hand-thumbs-up-fill h4"></i> Like';
    likeButton.onclick = () => this.like();
    // Append the like button to the like action container
    likeAction.appendChild(likeButton);
    // Display likes count if there are likes on the post
    if (this.likesCount > 0) {
      const likesCountElement = document.createElement("span");
      likesCountElement.appendChild(document.createTextNode(this.likesCount + " likes"));
      likesCountElement.style.fontSize = "18px";
      likesCountElement.style.fontWeight = "500";
      // Append the likes count to the like action container
      likeAction.appendChild(likesCountElement);
    }
    // Append the like action container to the post actions container
    actionsDiv.appendChild(likeAction);
    // Append post actions container and commentsContainer to the post body
    cardBody.appendChild(actionsDiv);
    cardBody.appendChild(this.commentsContainer);
    // Display comments for the post
    this.displayComments(this.comments);
    // Create a container for the card footer
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "py-3", "border-0");
    cardFooter.style.backgroundColor = "#f8f9fa";
    // Create a container for the comment section
    const commentSection = document.createElement("div");
    commentSection.classList.add("d-flex", "flex-start", "w-100");
    // Create an image element for the commenter's profile picture
    const commenterImage = document.createElement("img");
    commenterImage.classList.add("rounded-circle", "shadow-1-strong", "me-3");
    // Set the commenter's profile picture source based on the current user
    commenterImage.src = document.getElementById("userImgHomePage").src;
    commenterImage.alt = "avatar";
    commenterImage.width = "40";
    commenterImage.height = "40";
    // Create a container for the comment form
    const commentFormOutline = document.createElement("div");
    commentFormOutline.classList.add("form-outline", "w-100");
    // Create a textarea for entering a new comment
    const formTextArea = document.createElement("textarea");
    formTextArea.classList.add("form-control");
    formTextArea.setAttribute("id", "inputComment");
    formTextArea.setAttribute("rows", "3");
    formTextArea.setAttribute("placeholder", "Your comment");
    formTextArea.setAttribute("required", "true");
    // Append the textarea to the comment form container
    commentFormOutline.appendChild(formTextArea);
    // Create a container for comment actions
    const commentActions = document.createElement("div");
    commentActions.classList.add("float-end", "mt-2", "pt-1");
    // Create a button for adding a new comment
    const addCommentButton = document.createElement("button");
    addCommentButton.setAttribute("type", "button");
    addCommentButton.classList.add("btn", "btn-primary", "float-end", "mt-2", "pt-1");
    // Set the button text and onclick action
    addCommentButton.innerHTML = "Add comment";
    addCommentButton.onclick = () => {
      this.addComment(formTextArea.value);
      formTextArea.value = "";
    };
    // Append the add comment button to the comment actions container
    commentActions.appendChild(addCommentButton);
    // Append commenter's image and comment form to the comment section container
    commentSection.appendChild(commenterImage);
    commentSection.appendChild(commentFormOutline);
    // Append the comment section and comment actions to the card footer
    cardFooter.appendChild(commentSection);
    cardFooter.appendChild(commentActions);
    // Append the card footer to the card body
    cardDiv.appendChild(cardFooter);

    document.getElementById("postsContainer").appendChild(cardDiv);
  }

  /**
  * Displays the comments associated with the post.
  * @param {Array} comments - The array of comments to be displayed.
  */
  displayComments(comments) {
    this.commentsContainer.innerHTML = "";
    if (this.comments.length == 0) {
      return;
    }
    const commentsHeader = document.createElement("h6");
    const breakLine = document.createElement("hr");
    commentsHeader.appendChild(breakLine);
    commentsHeader.appendChild(document.createTextNode("Comments: "));
    this.commentsContainer.appendChild(commentsHeader);
    this.comments.forEach((comment) => {
      // Create a container for each comment, including the commenter's image and the comment text.
      const commentContainer = document.createElement("div");
      commentContainer.classList.add("d-flex","flex-row");
      // Create an image element for the commenter's profile picture.
      const commenterImage = document.createElement("img");
      commenterImage.classList.add("rounded-circle", "shadow-1-strong", "m-2");
      if (comment.author.userImg) {
        commenterImage.src = `users/getActualUserImage/${comment.author._id}`;
      } else {
        commenterImage.src = '../images/userImageExample.png';
      }
      commenterImage.alt = "avatar";
      commenterImage.width = "40";
      commenterImage.height = "40";
      // Create a div for displaying the comment details.
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("shadow", "mb-2", "px-4", "pb-1", "pt-2", "bg-body", "rounded-5", "w-75");
      commentDiv.innerHTML = `<h6 class="text-primary mb-0">${comment.author.firstName+" "+comment.author.lastName}</h6><p class="mb-1">${comment.text}</p>`;
      // Append the commenter's image and the comment details to the comment
      commentContainer.appendChild(commenterImage);
      commentContainer.appendChild(commentDiv);
      // Append the comment container to the overall comments container.
      this.commentsContainer.appendChild(commentContainer);
    });
  }
}




