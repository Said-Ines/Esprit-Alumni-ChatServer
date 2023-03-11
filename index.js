//Dependencies
const express = require("express");
var http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

//Imports
const Message = require("./models/message.js");
const chatRoute = require("./routes/chatRoute.js");
const uploadVoiceMessage = require("./middlewares/multer-config.js");
const VoiceMessage = require("./models/voiceMessage.js");

//Constants
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const databaseName = "chatApp";

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//Database
mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb://localhost:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
  });

//Middlewares
app.use(express.json());
app.use(cors());

// store every socket object of the connected client in the clients' map
var clients = {};

//Open a connection event on a socket io
io.on("connection", (socket) => {
  console.log("Connected");
  console.log(socket.id, "has joined");

  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
    console.log(clients);
  });

  socket.on("message", async (msg) => {
    console.log(msg);
    const message = new Message(msg);
    try {
      await message.save();
      let targetId = msg.targetId;
      if (clients[targetId]) {
        clients[targetId].emit("message", msg);
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on(
    "voice-message",
    uploadVoiceMessage.single("voiceMessage"),
    async (msg) => {
      console.log(msg);
      //convert the voice msg to an mp3 file
      const sourceFile = path.join(
        __dirname,
        "public",
        "uploads",
        "voice-messages",
        msg.voiceMessage.filename
      );
      const targetFile = path.join(
        __dirname,
        "public",
        "uploads",
        "voice-messages",
        `${msg.voiceMessage.filename}.mp3`
      );
      const command = `ffmpeg -i ${sourceFile} -vn -ar 44100 -ac 2 -b:a 192k ${outputFile}`;
      try {
        await execPromise(command);
        const voiceMessage = new VoiceMessage({
          sourceId: msg.sourceId,
          targetId: msg.targetId,
          voiceMessage: {
            filename: `${msg.voiceMessage.filename}.mp3`,
            duration: msg.voiceMessage.duration,
          },
          createdAt: Date.now(),
        });
        await voiceMessage.save();

        let targetId = msg.targetId;
        if (clients[targetId]) {
          clients[targetId].emit("voice-message", {
            _id: voiceMessage._id,
            sourceId: voiceMessage.sourceId,
            targetId: voiceMessage.targetId,
            voiceMessage: {
              filename: voiceMessage.voiceMessage.filename,
              duration: voiceMessage.voiceMessage.duration,
            },
            createdAt: voiceMessage.createdAt,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  );
});

//Routes
app.use("/chats", chatRoute);

//Start the server
server.listen(port, "192.168.1.149", () => {
  console.log(`Server is running on port: ${port}`);
});
