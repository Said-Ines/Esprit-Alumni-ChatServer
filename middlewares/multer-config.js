const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const voiceMessageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public", "uploads", "voice-messages");
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);
    return cb(null, filename);
  },
});

const uploadVoiceMessage = multer({
  storage: voiceMessageStorage,
});

module.exports = uploadVoiceMessage;
