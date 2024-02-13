const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const io = require("socket.io")();
const jwt = require("jsonwebtoken");

const commentController = {
  // Add a new comment to a blog
  addComment: async (req, res) => {
    try {
      const { blogId, content } = req.body;

      // Find the blog to add a comment to
      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Create a new comment associated with the user and the blog
      const userComment = await Comment.create({
        userId: req.user.id,
        blogId,
        content,
      });

      // Emit a newComment event through Socket.io
      io.emit("newComment", {
        blogId,
        comment: {
          id: userComment.id,
          content: userComment.content,
          userId: userComment.userId,
          blogId: userComment.blogId,
          createdAt: userComment.createdAt,
        },
      });

      res.status(201).json({
        message: "Comment added successfully",
        comment: {
          id: userComment.id,
          content: userComment.content,
          userId: userComment.userId,
          blogId: userComment.blogId,
          createdAt: userComment.createdAt,
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Retrieve all comments with associated user and blog details
  getComments: async (req, res) => {
    try {
      // Find all comments with associated user and blog information
      const comments = await Comment.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
          {
            model: Blog,
            attributes: ["id", "title", "content"],
          },
        ],
        order: [["createdAt", "DESC"]], // Order by creation date in descending order
      });

      res.status(200).json({
        message: "Comments retrieved successfully",
        comments: comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          userId: comment.userId,
          blogId: comment.blogId,
          createdAt: comment.createdAt,
          user: {
            id: comment.User.id,
            name: comment.User.name,
            email: comment.User.email,
          },
          blog: {
            id: comment.Blog.id,
            title: comment.Blog.title,
            content: comment.Blog.content,
          },
        })),
      });
    } catch (error) {
      console.error("Error retrieving comments:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Initialize Socket.io server
  initSocket: () => {
    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    io.listen(3001, () => {
      console.log("Socket.io server is running on port 3001");
    });
  },
};

module.exports = commentController;
