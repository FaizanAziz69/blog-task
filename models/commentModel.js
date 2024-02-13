const { DataTypes } = require("sequelize");
const sequelize = require("../db/configDb.js");
const User = require("../models/userModel.js");
const Blog = require("../models/blogModel.js");

// Define the Comment model
const Comment = sequelize.define("Comment", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Blog,
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations between Comment, User, and Blog
Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Blog, { foreignKey: "blogId" });

module.exports = Comment;
