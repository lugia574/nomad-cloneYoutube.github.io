import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
//const { createFFmpeg, fetchFile } = require(`@ffmpeg/ffmpeg`);

const { async } = require("regenerator-runtime");

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbnail = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbnail.buffer], { type: "image/jpg" });

  const mp4URL = URL.createObjectURL(mp4Blob);
  const thumURL = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4URL;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumA = document.createElement("a");
  thumA.href = thumURL;
  thumA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumA);
  thumA.click();

  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
  stream = null;
};

const handleStop = async () => {
  startBtn.innerText = "Download Recorder";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};
const handleStart = async () => {
  startBtn.innerText = "Stop Recorder";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };

  recorder.start();
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
