import express from "express";

const PORT = 4000;

const app = express();

const handleHome = () => console.log("sex");

app.get("/", handleHome);

const handleListening = () =>
  console.log(`Server linstening on port https://localhost:${PORT} yo!`);

app.listen(PORT, handleListening);
