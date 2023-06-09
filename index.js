//Dependencies
const express = require("express");
var http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

//Models & Routes
const Message = require("./models/message.js");
const Conversation = require("./models/converastion.js");
const chatRoute = require("./routes/chatRoute.js");

//Constants
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const databaseName = "ESpritAlumniDB";
//const databaseName = "chatApp";

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//Database
mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb://localhost:27017/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
    const message = new Message(msg);

    try {
      await message.save();

      // Enregistrer le message dans la collection Conversation
      const conversation = await Conversation.findOneAndUpdate(
        { targetId: msg.targetId },
        { sourceId: msg.sourceId, $push: { messagesList: message } },
        { upsert: true, new: true }
      );

      let targetId = msg.targetId;
      if (clients[targetId]) {
        console.log(message);
        clients[targetId].emit("message", message);
        console.log(message);
        // Send push notification to the target user
        clients[targetId].emit("notification", message);
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error(`Error occurred: ${error}`);
  });
});

//Routes
app.use("/chats", chatRoute);

//Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
