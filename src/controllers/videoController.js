let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
  {
    title: "Fourth Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 4,
  },
];
export const trending = (req, res) => {
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  // const id = req.params.id; 랑 같음
  const video = videos[id - 1];

  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  // const id = req.params.id; 랑 같음
  const video = videos[id - 1];
  // 수정할 비디오 특정 (id)

  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  //const title = req.body.title;

  videos[id - 1].title = title;

  return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search");
export const upload = (req, res) => {
  return res.render("upload");
};

export const uploadPost = (req, res) => {
  const { title } = req.body;
  const rating = parseInt(req.body.rating);
  const comments = parseInt(req.body.comments);
  const { createdAt } = req.body;
  const views = parseInt(req.body.views);
  const id = parseInt(req.body.id);

  videos.push({
    title: title,
    rating: rating,
    comments: comments,
    createdAt: createdAt,
    views: views,
    id: id,
  });

  return res.render("home", { pageTitle: "Home", videos });
};
export const deleteVideo = (req, res) => res.send("Delete Video");
