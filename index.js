const express = require("express");
const app = express();
const port = 5000;

let files = ["data1.xml", "data2.xml"];
let index = 0;

const nextFile = () => {
  let file = files[index];
  index++;
  if (index >= files.length) index = 0;
  return file;
};

app.get("/", (req, res) => {
  let next = nextFile();
  console.log("Incoming request! Serving:", next);
  res.download(next);
});

app.get("/config", (req, res) => {
  res.download("config.xml");
});

app.listen(port, () => {
  console.log(`Dummy server listening on port ${port}`);
});
