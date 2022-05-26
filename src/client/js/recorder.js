const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 300, height: 200 },
  });
  video.srcObject = stream;
  video.play();
  console.log(stream);
};

startBtn.addEventListener("click", handleStart);
