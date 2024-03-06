const User = require("../models/userModel");
const path = require("path");

// Search for users based on partial matches in their first name or last name
exports.partialSearchUsers = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    // Remove leading and trailing spaces from the query
    query = query.trim();
    // Split the query into words
    const words = query.split(/\s+/);
    // Build a regular expression for each word
    const regexQueries = words.map((word) => new RegExp(word, "i"));

    const users = await User.find({
      $and: regexQueries.map((regexQuery) => ({
        $or: [
          { firstName: { $regex: regexQuery } },
          { lastName: { $regex: regexQuery } },
        ],
      })),
    });

    return res.json(users);
  } catch (error) {
    console.error("Error during partial search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get the current user's friend requests
exports.getFriendRequests = async (req, res) => {
  try {
    const user = req.user;
    await user.populate("friendRequests");
    return res.json({ friendRequests: user.friendRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get information about a user (either the logged-in user or the specified user)
exports.getActualUserInfo = async (req, res) => {
  try {
    let userId;
    // Check if the userId parameter is provided
    if (req.params.userId) {
      userId = req.params.userId;
    } else {
      // If not, use the identifier of the logged-in user
      userId = req.user._id;
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      userImage: user.userImg,
      joinDate: user.createdAt,
      posts: user.posts,
      friends: user.friends,
      description: user.userDescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyIfUserIsInvited = async (req, res) => {
  try {
    let actualUserId = req.user._id;
    let checkingUserId = req.params.userId;

    const actualUser = await User.findById(actualUserId);
    const isFriendRequestSent = actualUser.sentFriendRequests.find(
      (userId) => userId == checkingUserId
    );
    if (isFriendRequestSent) {
      return res.json({
        result: true,
      });
    } else {
      return res.json({
        result: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyIfUserIsYourFriend = async (req, res) => {
  try {
    let actualUserId = req.user._id;
    let checkingUserId = req.params.userId;

    const actualUser = await User.findById(actualUserId);
    const isYourFriend = actualUser.friends.find(
      (userId) => userId == checkingUserId
    );
    if (isYourFriend) {
      return res.json({
        result: true,
      });
    } else {
      return res.json({
        result: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserDescription = async (req, res) => {
  try {
    const userId = req.user._id;
    const description = req.body.description;
    await User.updateOne(
      { _id: userId },
      { $set: { userDescription: description } }
    );

    res.status(201).json({ message: "User description updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getActualUserImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const filePath = path.join(__dirname, "../uploads", user.userImg);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error occurred with user photo sending:", err);
        res.status(err.status).end();
      } else {
        console.log("User photo was sent successfully");
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommended friends for the logged-in user
exports.getRecommendedFriends = async (req, res) => {
  try {
    const user = req.user;
    // Get lists of current friends, sent friend requests, and received friend requests
    const currentFriends = user.friends.map((friend) => friend.toString());
    const sentFriendRequests = user.sentFriendRequests.map((request) =>
      request.toString()
    );
    const receivedFriendRequests = user.friendRequests.map((request) =>
      request.toString()
    );
    // Get lists of friends of friends for each current friend
    const friendsOfFriendsPromises = user.friends.map(async (friendId) => {
      const friend = await User.findById(friendId);
      const friendsOfFriend = friend.friends.filter(
        (fof) =>
          !currentFriends.includes(fof.toString()) &&
          !sentFriendRequests.includes(fof.toString()) &&
          !receivedFriendRequests.includes(fof.toString()) &&
          fof.toString() !== user._id.toString()
      );
      // Get full user objects based on their identifiers
      const friendsOfFriendDetails = await User.find(
        { _id: { $in: friendsOfFriend } },
        "_id firstName lastName"
      );
      return friendsOfFriendDetails;
    });
    // Wait for all asynchronous queries to finish
    const friendsOfFriendsArrays = await Promise.all(friendsOfFriendsPromises);
    // Merge arrays into one list and remove duplicates
    const recommendedFriends = friendsOfFriendsArrays
      .flat()
      .filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id.equals(user._id))
      );
    return res.json({ recommendedFriends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a friend request to the specified user
exports.sendFriendRequest = async (req, res) => {
  try {
    const user = req.user;
    const friendId = req.params.userId;
    // Check if the user exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the request has not been sent already
    if (user.sentFriendRequests.includes(friendId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    // Check if the user is not already a friend
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "User is already your friend" });
    }
    // Add the request to the sent requests list
    await User.updateOne(
      { _id: user._id },
      { $push: { sentFriendRequests: friendId } }
    );
    // Add the request to the friend's incoming requests list
    await User.updateOne(
      { _id: friendId },
      { $push: { friendRequests: user._id } }
    );
    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a friend request from the specified user
exports.acceptFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.userId;
    const user = req.user;
    // Check if the user exists
    const friendToAccept = await User.findById(friendId);
    if (!friendToAccept) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the request has been sent
    if (!user.friendRequests.includes(friendId.toString())) {
      return res.status(400).json({ message: "Friend request not found" });
    }
    await User.updateOne(
      { _id: friendId },
      {
        $push: { friends: user._id },
        $pull: { sentFriendRequests: user._id },
      }
    );
    await User.updateOne(
      { _id: user._id },
      {
        $push: { friends: friendId },
        $pull: { friendRequests: friendId },
      }
    );
    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to reject a friend request
exports.rejectFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.userId;
    const user = req.user;
    // Remove the request from the lists
    await User.updateOne(
      { _id: friendId },
      {
        $pull: { sentFriendRequests: user._id },
      }
    );
    await User.updateOne(
      { _id: user._id },
      {
        $pull: { friendRequests: friendId },
      }
    );
    return res
      .status(200)
      .json({ message: "Friend request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
