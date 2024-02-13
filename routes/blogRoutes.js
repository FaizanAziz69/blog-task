const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/auth");

// Route to create a new blog post
router.post("/post", authMiddleware, blogController.createBlog);

// Route to get all blogs
router.get("/all", blogController.getBlogs);

// Route to delete a blog post
router.delete("/delete/:blogId", authMiddleware, blogController.deleteBlog);

// Route to update a blog post
router.put("/update/:blogId", authMiddleware, blogController.updateBlog);

module.exports = router;
