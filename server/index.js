import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { mongoConnect } from "./utils/DbConnect.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: "GET,POST",
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  console.log("route visited");
  res.send("hello");
});

mongoConnect(); // db connection

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);
//   io.to(socket.id).emit("userid", socket.id);
//   socket.on("messageSent", (msgObj) => {
//     console.log(msgObj, "msg received from client");
//     io.emit("displayMsg", msgObj);
//   });

//   socket.on("userTyping", (userN) => {
//     console.log("user is typing");
//     socket.broadcast.emit("updateUserTypingStatus", userN);
//   });

//   socket.on("turnTypingOff", (UID) => {
//     console.log("typing status needs to be turned off", UID);
//     socket.broadcast.emit("turnOffTypingStatus");
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

server.listen(8000, () => {
  console.log("server is running at port 8000");
});
