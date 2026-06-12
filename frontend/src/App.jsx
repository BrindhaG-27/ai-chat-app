import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./socket/socket";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [typingUser, setTypingUser] = useState("");

  const currentUser = "Priya";

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userTyping", (sender) => {
      setTypingUser(`${sender} is typing...`);

      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
    };
  }, []);

  const joinRoom = async () => {
    if (!room.trim()) {
      alert("Please enter a room name");
      return;
    }

    socket.emit("joinRoom", room);
    setJoinedRoom(room);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${room}`
      );

      setMessages(res.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    if (!joinedRoom) {
      alert("Please join a room first");
      return;
    }

    const msgData = {
      text: message,
      sender: currentUser,
      room: joinedRoom,
    };

    socket.emit("sendMessage", msgData);

    setMessage("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Chat App</h1>

      <h3>Room: {joinedRoom || "No Room Joined"}</h3>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          onClick={joinRoom}
          style={{ marginLeft: "10px" }}
        >
          Join Room
        </button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            if (joinedRoom) {
              socket.emit("typing", {
                sender: currentUser,
                room: joinedRoom,
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          style={{ width: "300px" }}
        />

        <button
          onClick={sendMessage}
          style={{ marginLeft: "10px" }}
        >
          Send
        </button>
      </div>

      {typingUser && (
        <p
          style={{
            color: "gray",
            fontStyle: "italic",
          }}
        >
          {typingUser}
        </p>
      )}

      <h3>Messages</h3>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => {
          const isMine = msg.sender === currentUser;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isMine
                  ? "flex-end"
                  : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: isMine
                    ? "#DCF8C6"
                    : "#EAEAEA",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                }}
              >
                <strong>{msg.sender}</strong>
                <br />
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
