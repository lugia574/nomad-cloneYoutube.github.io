import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  upload,
  uploadPost,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(upload).post(uploadPost);
videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;
