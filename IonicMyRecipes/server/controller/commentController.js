const models = require("../models");

exports.createComment = async (req, res) => {
  const { text } = req.body;
  try {
    const comment = await models.Comment.create({
      text,
      PostId: req.params.postId,
      UserId: req.currentUser.id,
    });
    res.status(200).json({ message: "تم إضافة التعليق" });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.getComment = async (req, res) => {
  try {
    const comments = await models.Comment.findAll({
      where: { PostId: req.params.postId },
      include: [
        {
          model: models.User,
          attributes: { exclude: ["email", "password"] },
        },
      ],
    });
    res.status(200).json(comments);
  } catch (e) {
    res.status(500).json(e);
  }
};
