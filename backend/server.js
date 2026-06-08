const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  let reply;

  if (message.toLowerCase().includes("hello")) {
    reply = "Hi! Nice to meet you.";
  } else if (message.toLowerCase().includes("how are you")) {
    reply = "I'm doing well. How are you?";
  } else {
    reply = "I am still learning.";
  }

  res.json({ reply });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});