const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messageRoutes");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message({
        text: data.text,
        sender: data.sender || "anonymous",
        room: data.room,
      });

      const savedMessage = await newMessage.save();

      // Send only to users in that room
      io.to(data.room).emit("receiveMessage", savedMessage);

      console.log(
        `Message sent to room ${data.room}: ${data.text}`
      );
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});