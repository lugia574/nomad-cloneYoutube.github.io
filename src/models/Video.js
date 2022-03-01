import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  creationAt: Date,
  hashtag: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const video = mongoose.model("Video", videoSchema);
export default video;
