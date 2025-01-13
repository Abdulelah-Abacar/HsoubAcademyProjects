const models = require("../models");

exports.like = async (req, res) => {
  try {
    const userLiked = await models.Like.findOne({
      where: { UserId: req.currentUser.id, PostId: req.params.postId },
    });
    if (userLiked) {
      await models.Like.destroy({
        where: { UserId: req.currentUser.id, PostId: req.params.postId },
      });
      res.status(200).json({ message: "تم حذف الإعجاب" });
    } else {
      await models.Like.create({
        UserId: req.currentUser.id,
        PostId: req.params.postId,
      });
      res.status(200).json({ message: "تم إضافة الإعجاب" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.likeCount = async (req, res) => {
  try {
    const likes = await models.Like.findAll({
      where: { PostId: req.params.postId },
    });
    const userLiked = await models.Like.findOne({
      where: { UserId: req.currentUser.id, PostId: req.params.postId },
    });

    res.status(200).json({
      likes: likes.length,
      userLiked,
    });
  } catch (e) {
    res.status(500).json(e);
  }
};
