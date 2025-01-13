const db = require("./database");

const Like = db.define(
  "Like",
  {},
  {
    timestamps: false,
  }
);

Like.associte = (models) => {
  models.User.belongsToMany(models.Post, { through: "Like" });
  models.Post.belongsToMany(models.User, { through: "Like" });
};

module.exports = Like;
