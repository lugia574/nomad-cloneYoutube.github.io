const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = () => {
  event.preventDefault();
};

form.addEventListener("submit", handleSubmit);
