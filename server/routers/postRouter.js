const PostModel = require("../schema/Post");
const UserModel = require("../schema/User");
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const postRouter = express.Router();

postRouter.post("/new-post", verifyJWT, async (req, res) => {
  try {
    const { postCont, imagePath, url: downloadURL } = req.body;
    const postTime = new Date();
    const dbRes = await PostModel.create({ postCont, postTime, postedBy: req.user.user, imagePath, downloadURL });
    res.send(dbRes);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const dbResponse = await PostModel.find({});
    res.send(dbResponse);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

postRouter.get("/:userName", async (req, res) => {
  try {
    const dbResponse = await PostModel.find({ postedBy: req.params.userName });
    res.send(dbResponse);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

postRouter.delete('/:postId', verifyJWT, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (post.postedBy !== req.user.user) {
      return res.status(403).send('Forbidden');
    }
    await post.deleteOne();
    res.status(200).send('Post has been deleted');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

postRouter.put('/:postId', verifyJWT, async (req, res) => {
  try {
    const { postContent, imagePath, url: downloadURL } = req.body;
    const post = await PostModel.findById(req.params.postId);
    if (post.postedBy !== req.user.user) {
      return res.status(403).send('Forbidden');
    }
    await PostModel.findOneAndUpdate(
      { _id: req.params.postId },
      { $set: { postCont: postContent, imagePath, downloadURL, postTime: new Date() } },
      { new: true }
    );
    res.status(200).send('Post has been updated');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = postRouter;
