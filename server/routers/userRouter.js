const express = require('express');
const userRouter = express.Router();
const UserModel = require("../schema/User");

userRouter.get("/", async (req, res) => {
  const { jwt: refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  const foundUser = await UserModel.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(404);
  res.json({ user: foundUser.user, joinTime: foundUser.joinTime, perDescr: foundUser.perDescr });
})

userRouter.get("/findByName/:userName", async (req, res) => {
  const { userName } = req.params;
  const foundUser = await UserModel.findOne({ user: userName });
  if (!foundUser) {
    return res.sendStatus(404);
  }
  res.json({ user: foundUser.user, joinTime: foundUser.joinTime, perDescr: foundUser.perDescr });
})

userRouter.get("/all", async (req, res) => {
  const foundUsers = await UserModel.find();
  const resUsers = foundUsers.map(user => ({
    user: user.user,
    joinTime: user.joinTime,
    perDescr: user.perDescr
  }));
  res.json(resUsers);
})

userRouter.get("/search/:string", async (req, res) => {
  const searchString = req.params.string.toLowerCase();
  const allUsers = await UserModel.find();
  const foundUsers = allUsers.filter(user => 
    user.user.toLowerCase().includes(searchString)
  ).map(user => user.user);
  res.json(foundUsers);
})

userRouter.put("/updateProfileDescription/:username", async (req, res) => {
  const { jwt: refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  const { username } = req.params;
  const loggedInUser = await UserModel.findOne({ refreshToken });
  if (loggedInUser.user !== username) return res.sendStatus(403);

  await UserModel.findOneAndUpdate({ user: username }, 
    { $set: { perDescr: req.body.postCont }}, 
    { new: true }
  );
  res.send('Description has been updated');
})

userRouter.put('/pictureUpload/:username', async (req, res) => {
  const { jwt: refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  const { username } = req.params;
  const loggedInUser = await UserModel.findOne({ refreshToken });
  if (loggedInUser.user !== username) return res.sendStatus(403);

  await UserModel.findOneAndUpdate({ user: username }, 
    { $set: { profilePictureURL: req.body.url }},
    { new: true, strict: false }
  );
  res.send('Profile picture has been uploaded successfully');
})

userRouter.get('/pictureUpload/:username', async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ user: username });
  if (!user) return res.sendStatus(404);
  res.json({ profilePictureURL: user.profilePictureURL });
})

module.exports = userRouter;
