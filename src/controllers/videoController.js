import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    console.log(videos);
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
export const watch = (req, res) => {
  const { id } = req.params;
  // const id = req.params.id; 랑 같음

  return res.render("watch", { pageTitle: `Watching:` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  // const id = req.params.id; 랑 같음

  return res.render("edit", { pageTitle: `Editing:` });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  //const title = req.body.title;

  return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search");
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const deleteVideo = (req, res) => res.send("Delete Video");
