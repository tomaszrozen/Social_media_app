// userRoutes.js
const express = require('express');
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getRecommendedFriends,
    getActualUserInfo,
    getActualUserImage,
    partialSearchUsers,
    updateUserDescription,
    verifyIfUserIsYourFriend,
    verifyIfUserIsInvited
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get('/friend-requests', verifyToken, getFriendRequests);
router.get('/recommended-friends', verifyToken, getRecommendedFriends);
router.get('/getActualUserInfo', verifyToken, getActualUserInfo);
router.get('/getActualUserInfo/:userId', verifyToken, getActualUserInfo);
router.get('/getActualUserImage/:userId', verifyToken, getActualUserImage);
router.get('/verifyIfUserIsYourFriend/:userId', verifyToken, verifyIfUserIsYourFriend);
router.get('/verifyIfUserIsInvited/:userId', verifyToken, verifyIfUserIsInvited);
router.post('/updateUserDescription', verifyToken, updateUserDescription);
router.post('/sendFriendRequest/:userId', verifyToken, sendFriendRequest);
router.post('/acceptFriendRequest/:userId', verifyToken, acceptFriendRequest);
router.post('/rejectFriendRequest/:userId', verifyToken, rejectFriendRequest);
router.get('/partialSearchUsers', verifyToken, partialSearchUsers);


module.exports = router;
