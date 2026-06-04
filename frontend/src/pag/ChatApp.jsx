import { useState, useEffect } from "react";

function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchChats(); }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chats");
      const data = await res.json();
      setChats(data);
    } catch (err) { console.error(err); }
  };

  const loadChat = async (chatId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${chatId}`);
      const data = await res.json();
      setCurrentChatId(chatId);
      setMessages(data.messages.map(m => ({
        text: m.content,
        sender: m.role === "user" ? "user" : "ai"
      })));
    } catch (err) { console.error(err); }
  };

  const startNewChat = () => { setCurrentChatId(null); setMessages([]); };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    await fetch(`http://localhost:5000/api/chats/${chatId}`, { method: "DELETE" });
    setChats(prev => prev.filter(c => c._id !== chatId));
    if (currentChatId === chatId) startNewChat();
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userText = message;
    setMessages(prev => [...prev, { text: userText, sender: "user" }]);
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, chatId: currentChatId }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: "ai" }]);
      setCurrentChatId(data.chatId);
      fetchChats();
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error connecting to server.", sender: "ai" }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a", color: "white", fontFamily: "sans-serif" }}>
      
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#1e293b", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>🤖 AI ChatBot</h2>
        <button onClick={startNewChat} style={{ background: "#7c3aed", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>
          + New Chat
        </button>
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
          {chats.map(chat => (
            <div key={chat._id} onClick={() => loadChat(chat._id)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderRadius: "8px", cursor: "pointer", background: currentChatId === chat._id ? "#334155" : "#1e293b", border: "1px solid #334155" }}>
              <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title}</span>
              <button onClick={(e) => deleteChat(chat._id, e)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", background: "#1e293b", borderBottom: "1px solid #334155" }}>
          <h2 style={{ margin: 0 }}>AI Assistant</h2>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" }}>
              <h1>Welcome 👋</h1>
              <p>Ask me anything!</p>
            </div>
          ) : messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ padding: "12px 18px", borderRadius: "18px", maxWidth: "70%", background: msg.sender === "user" ? "#7c3aed" : "#1e293b", whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "12px 18px", borderRadius: "18px", background: "#1e293b", color: "#64748b" }}>Thinking...</div>
            </div>
          )}
        </div>

        <div style={{ padding: "20px", borderTop: "1px solid #334155", display: "flex", gap: "10px" }}>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything..."
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #334155", background: "#1e293b", color: "white", fontSize: "15px", outline: "none" }}
          />
          <button onClick={sendMessage} disabled={loading}
            style={{ background: "#7c3aed", color: "white", border: "none", padding: "14px 28px", borderRadius: "12px", cursor: "pointer", fontSize: "15px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;