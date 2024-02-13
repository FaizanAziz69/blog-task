const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Initialize Socket.io server for comments
commentController.initSocket();

// Route to add a new comment
router.post("/addComment", authMiddleware, commentController.addComment);

// Route to get all comments
router.get("/all", commentController.getComments);

module.exports = router;
