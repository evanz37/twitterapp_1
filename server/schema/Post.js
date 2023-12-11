const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  postCont: String,
  postTime: Date,
  postedBy: String,
  imagePath: String,
  downloadURL: String
}, {collection: "posts"}, { strict: false })

module.exports = mongoose.model("Post", postSchema);
