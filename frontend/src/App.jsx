import { useState, useEffect } from 'react';
import Login from './pages/Login';

const BACKEND = 'https://ai-chatbot-backend-4sjk.onrender.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  const fetchChats = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND}/api/chats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setChats(data);
  };

  const loadChat = async (chatId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND}/api/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCurrentChat(chatId);
    setMessages(data.messages || []);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem('token');
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '...' }]);
    setInput('');
    setLoading(true);
    const res = await fetch(`${BACKEND}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: input, chatId: currentChat })
    });
    const data = await res.json();
    setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.reply }]);
    setCurrentChat(data.chatId);
    setLoading(false);
    fetchChats();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setChats([]);
    setMessages([]);
    setCurrentChat(null);
  };

  const deleteChat = async (chatId) => {
    const token = localStorage.getItem('token');
    await fetch(`${BACKEND}/api/chats/${chatId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchChats();
    if (currentChat === chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f172a', color: 'white' }}>
      <div style={{ width: '260px', background: '#1e293b', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>🤖 AI ChatBot</h2>
        </div>
        <button onClick={() => { setCurrentChat(null); setMessages([]); }}
          style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', marginBottom: '16px' }}>
          + New Chat
        </button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div key={chat._id} onClick={() => loadChat(chat._id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', background: currentChat === chat._id ? '#334155' : 'transparent' }}>
              <span style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</span>
              <button onClick={e => { e.stopPropagation(); deleteChat(chat._id); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>🗑</button>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '12px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 8px' }}>👤 {user.name}</p>
          <button onClick={logout}
            style={{ width: '100%', padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '100px' }}>
              <h2>AI Assistant</h2>
              <p>Ask me anything!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
              <div style={{ maxWidth: '70%', padding: '12px 18px', borderRadius: '18px', background: msg.role === 'user' ? '#7c3aed' : '#1e293b', color: 'white', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px' }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything..."
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#1e293b', color: 'white', fontSize: '16px' }} />
          <button onClick={sendMessage} disabled={loading}
            style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
