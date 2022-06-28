import { async } from "regenerator-runtime";
import User from "../models/User";
import Comment from "../models/Comment";
import Video, { formatHashtags } from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");

    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  //console.log(video);
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  const comments = await Comment.find({ video: id }).populate("owner");

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }

  return res.render("edit", {
    pageTitle: `Edit ${video.title}`,
    video,
    comments,
  });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);

  // 니코쌤 코드 그대로 쓰면
  // postEdit에서 video.owner이 undefinded가 나옵니다!
  // 이유는 video를 가져올때 Video.exists로 가져오는데
  // exists메소드는 boolean을 리턴하기때문에 video.owner이
  // undefinded로 나오는 거예요!

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;

  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  //.replace(/[\\]/g, "/")
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id).populate("comments");

  await Comment.deleteMany({ video: video._id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.deleteOne({ _id: id });

  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();

  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        //keyword를 contain하고 대소문자 구분없이 찾게됨. (mongoDB의 기능)
        //{ $regex: new RegExp(`${keyword}$`, "i") },
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }

  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus("404");
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  const comment_user = await User.findById(user._id);

  video.comments.push(comment._id);
  video.save();

  comment_user.comments.push(comment._id);
  comment_user.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const commentDelete = async (req, res) => {
  const {
    session: { user },
    // body: { videoId },
    params: { commentId },
  } = req;

  const comment = await Comment.findById(commentId).populate("owner");
  const commentOwner = await User.findById(comment.owner.id).populate(
    "comments"
  );

  if (user._id != comment.owner.id) {
    return res.sendStatus(403);
  }

  await Comment.deleteOne({ _id: commentId });
  // console.log(commentDel);

  // 유저 댓글 부분도 지워주자
  commentOwner.comments.splice(commentOwner.comments.indexOf(commentId), 1);
  commentOwner.save();

  //https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

  return res.sendStatus(201);
};
