const Post = require("../models/post");
const User = require("../models/userModel");

// Add a new post for the logged-in user
exports.addPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;
    // Create a new post
    const newPost = new Post({
      author: userId,
      content: content,
    });

    // Save the post to the database
    await newPost.save();
    // Update the user's posts field in the database 
    await User.updateOne({ _id: userId }, { $push: { posts: newPost._id } });

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get posts for the logged-in user and their friends
exports.getPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "posts",
      },
    });

    const userPosts = await Post.find({ author: userId }); // Get posts created by the user

    const friendPosts = user.friends.map((friend) => friend.posts).flat(); // Get posts from friends

    const allPosts = [...userPosts, ...friendPosts];

    await Post.populate(allPosts, {
      path: "author",
      select: "firstName lastName userImg",
    });

    allPosts.forEach((post) => {
      post.liked = post.likes.includes(userId);
    });

    const postsWithComments = await Promise.all(
      allPosts.map(async (post) => {
        const postWithComments = await Post.populate(post, {
          path: "comments.author",
          model: "User",
          select: "firstName lastName userImg",
        });
        return postWithComments;
      })
    );

    const sortedPosts = postsWithComments
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((post) => ({
        ...post.toObject(),
        liked: post.likes.includes(userId),
      }));

    res.json({ posts: sortedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a specified post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const user = req.user;

    // Get the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add a new comment
    const newComment = {
      author: user,
      text: text,
    };
    post.comments.push(newComment);
    await post.save();
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Handle like/unlike functionality for a specified post
exports.likes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = req.user;
    // Get the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user has already liked the post
    const alreadyLiked = post.likes.includes(user._id);

    if (alreadyLiked) {
      // Remove the like if already liked
      post.likes.pull(user._id);
      await post.save();
      res.json({ message: "Like removed successfully", liked: false });
    } else {
      // Add a like if not liked yet
      post.likes.push(user._id);
      await post.save();
      res.json({ message: "Like added successfully", liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
