//Dependencies
const express = require("express");
var http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

//Importsnotification
const Message = require("./models/message.js");
const Conversation = require("./models/converastion.js");
const chatRoute = require("./routes/chatRoute.js");
//const Conversation = require("./models/converastion.js");

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
    console.log(msg);
    const message = new Message(msg);
    console.log(message);
    try {
      await message.save();

      // Enregistrer le message dans la collection Conversation
      const conversation = await Conversation.findOneAndUpdate(
        { targetId: msg.targetId },
        { $push: { messagesList: message } },
        { upsert: true, new: true }
      );

      let targetId = msg.targetId;
      if (clients[targetId]) {
        clients[targetId].emit("message", message);
        // Send push notification to the target user
        clients[targetId].emit("notification", message);
      }
    } catch (err) {
      console.log(err);
    }
  });
});

//Routes
app.use("/chats", chatRoute);

//Start the server
server.listen(port, "172.17.2.100", () => {
  console.log(`Server is running on port: ${port}`);
});
