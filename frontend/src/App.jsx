import { useState, useRef, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");
    setIsTyping(true);

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

      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch (error) {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server not reachable" },
      ]);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>AI Chat App</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          height: "400px",
          padding: "15px",
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor:
                  msg.sender === "user"
                    ? "#007bff"
                    : "#e0e0e0",
                color:
                  msg.sender === "user"
                    ? "white"
                    : "black",
                padding: "10px 15px",
                borderRadius: "15px",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "#e0e0e0",
                padding: "10px 15px",
                borderRadius: "15px",
              }}
            >
              Bot is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "10px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;