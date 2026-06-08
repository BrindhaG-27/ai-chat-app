import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [...prev, "You: " + userMessage]);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, "Bot: " + data.reply]);
    } catch (error) {
      setMessages((prev) => [...prev, "Bot: Server not reachable"]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat App</h1>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          padding: "10px",
          marginBottom: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;