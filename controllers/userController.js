const { DataTypes } = require("sequelize");
const sequelize = require("../db/configDb.js");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  // Register a new user
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if a user with the given email already exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        // User with the same email already exists
        return res
          .status(400)
          .json({ message: "Email address is already in use." });
      }

      // If user doesn't exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Unexpected error registering user:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Log in an existing user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id }, "your-secret-key", {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "User login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get a user by ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update user information
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, password } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user fields
      user.name = name;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);

      await user.save();

      res.status(200).json({
        message: "User updated successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
