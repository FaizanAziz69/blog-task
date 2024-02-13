const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route to register a new user
router.post("/register", userController.registerUser);

// Route to login an existing user
router.post("/login", userController.loginUser);

// Route to get all users
router.get("/allUsers", userController.getAllUsers);

// Route to get a user by ID
router.get("/byId/:id", userController.getUserById);

// Route to update a user
router.put("/update/:id", userController.updateUser);

// Route to delete a user
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
