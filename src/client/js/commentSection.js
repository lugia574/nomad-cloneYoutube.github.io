const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const comment = document.getElementById("video__comments");
const videoComments = document.querySelector(".video__comments ul");

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  newComment.id = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const button = document.createElement("button");
  button.innerText = "✖";
  button.id = newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(button);
  videoComments.prepend(newComment);
};

const delComment = (element) => {
  element.remove();
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  //console.log(response.status);

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelComment = async (event) => {
  const commentID = event.target.parentElement.dataset.id;
  const videoId = videoContainer.dataset.id;

  const response = await fetch(`/api/comment/${commentID}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });

  if (response.status === 201) {
    // 이제 fakeComment 지워주자
    delComment(event.target.parentElement);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

videoComments.addEventListener("click", handleDelComment);
