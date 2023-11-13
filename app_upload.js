const express = require("express");
const path = require("path");
const upload = require("./config/upload");

const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
// for json exchange
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/uploading", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Uplod Error");
    }
    console.log(res.body.username);
    console.log(res.file.filename);
    res.send("Uplod done");
  });
});

app.get("/", function (_req, res) {
  res.sendFile(path.join(__dirname, "views/upload.html"));
});

const port = 3000;
app.listen(port, function () {
  console.log("Server is ready at " + port);
});
