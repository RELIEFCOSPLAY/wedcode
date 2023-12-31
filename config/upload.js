const multer = require("multer");

const storageOption = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/");
  },
  filename: function (red, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storageOption,
  limits: { fileSize: 100 * 1000 },
}).single("filetoupload");
module.exports = upload;