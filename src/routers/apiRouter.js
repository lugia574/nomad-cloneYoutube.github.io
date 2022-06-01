import express from "express";
import {
  registerView,
  createComment,
  commentDelete,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/comment/:commentId([0-9a-f]{24})/delete", commentDelete);
// apiRouter.post("/comments/:commentId([0-9a-f]{24})/delete", comment_delete);
export default apiRouter;
