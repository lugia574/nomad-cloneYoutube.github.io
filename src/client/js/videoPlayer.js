const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volumen");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  }
  // else play the video
  else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "pause" : "play";
};
const handlePause = (e) => (playBtn.innerText = "Play");
const handlePlay = (e) => (playBtn.innerText = "Pause");

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const handleLoadedMetadata = () => {
  totalTime.innerText = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currenTime.innerText = Math.floor(video.currentTime);
};
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
if (video.readyState == 4) {
  handleLoadedMetadata();
}
