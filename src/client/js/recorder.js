const { async } = require("regenerator-runtime");

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const handleStop = async () => {
  startBtn.innerText = "Start Recorder";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
};
const handleStart = async () => {
  startBtn.innerText = "Stop Recorder";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    console.log("녹화끝남");
    console.log(event);
    console.log(event.data);
  };
  console.log(recorder);
  recorder.start();
  console.log(recorder);

  setTimeout(() => {
    recorder.stop();
  }, 10000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 300, height: 200 },
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
