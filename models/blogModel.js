const { DataTypes } = require("sequelize");
const sequelize = require("../db/configDb.js");
const User = require("./userModel");

// Define the Blog model
const Blog = sequelize.define("Blog", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Set a default value for updatedAt
  },
});

// Define associations between Blog and User
Blog.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Blog, { foreignKey: "userId" });

module.exports = Blog;
