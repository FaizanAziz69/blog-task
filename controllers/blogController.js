const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blogModel");

const blogController = {
  // Create a new blog
  createBlog: async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;

      // Find the user based on user ID
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create a new blog associated with the user
      const newBlog = await Blog.create({
        title,
        content,
        userId,
        updatedAt: new Date(), // Explicitly set updatedAt to the current date
      });

      res.status(201).json({
        message: "Blog created successfully",
        blog: {
          id: newBlog.id,
          title: newBlog.title,
          content: newBlog.content,
          userId: newBlog.userId,
          createdAt: newBlog.createdAt,
          updatedAt: newBlog.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Retrieve all blogs with associated user information
  getBlogs: async (req, res) => {
    try {
      // Find all blogs with associated user details
      const blogs = await Blog.findAll({
        include: {
          model: User,
          as: "User", // Alias for the User model
          attributes: ["id", "name", "email", "createdAt", "updatedAt"],
        },
        order: [["createdAt", "DESC"]], // Order by creation date in descending order
      });

      res.status(200).json({
        message: "Blogs retrieved successfully",
        blogs: blogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          userId: blog.userId,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          user: {
            id: blog.User.id,
            name: blog.User.name,
            email: blog.User.email,
            createdAt: blog.User.createdAt,
            updatedAt: blog.User.updatedAt,
          },
        })),
      });
    } catch (error) {
      console.error("Error retrieving blogs:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update an existing blog
  updateBlog: async (req, res) => {
    try {
      const { blogId } = req.params; // Change from id to blogId
      const { title, content } = req.body;

      // Find the blog to update
      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Check if the user making the request is the author of the blog
      if (blog.userId !== req.user.id) {
        return res
          .status(403)
          .json({
            message: "Unauthorized: You can only update your own blogs",
          });
      }

      // Update the blog
      blog.title = title;
      blog.content = content;
      blog.updatedAt = new Date();
      await blog.save();

      res.status(200).json({
        message: "Blog updated successfully",
        blog: {
          id: blog.id,
          title: blog.title,
          content: blog.content,
          userId: blog.userId,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Delete an existing blog
  deleteBlog: async (req, res) => {
    try {
      const { blogId } = req.params;

      // Find the blog to delete
      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Check if the user making the request is the author of the blog
      if (blog.userId !== req.user.id) {
        return res
          .status(403)
          .json({
            message: "Unauthorized: You can only delete your own blogs",
          });
      }

      const deletedBlog = { ...blog.dataValues };

      // Delete the blog
      await blog.destroy();

      res.status(200).json({
        message: "Blog deleted successfully",
        deletedBlog,
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = blogController;
