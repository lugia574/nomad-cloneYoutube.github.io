import express from "express";

const PORT = 4000;

const app = express();

const handleListening = () =>
  console.log(`Server linstening on port https://localhost:${PORT}`);

app.listen(PORT, handleListening);
