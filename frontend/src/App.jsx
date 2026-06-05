import { useState, useEffect, useRef } from 'react';
import Login from './pages/Login';
import { useSpeech } from './hooks/useSpeech';

const BACKEND = 'https://ai-chatbot-backend-4sjk.onrender.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const { listening, startListening, speak, stopSpeaking } = useSpeech((text) => {
    setInput(text);
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => { if (user) fetchChats(); }, [user]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchChats = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND}/api/chats`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setChats(Array.isArray(data) ? data : []);
  };

  const loadChat = async (chatId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND}/api/chats/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setCurrentChat(chatId);
    setMessages(data.messages || []);
  };

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const token = localStorage.getItem('token');
    setMessages(prev => [...prev, { role: 'user', content: msg }, { role: 'assistant', content: '...' }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg, chatId: currentChat })
      });
      const data = await res.json();
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.reply }]);
      setCurrentChat(data.chatId);
      fetchChats();
      // Auto speak the reply
      setSpeaking(true);
      speak(data.reply);
      setSpeaking(false);
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Error. Please try again.' }]);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null); setChats([]); setMessages([]); setCurrentChat(null);
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    await fetch(`${BACKEND}/api/chats/${chatId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchChats();
    if (currentChat === chatId) { setCurrentChat(null); setMessages([]); }
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#212121', color: '#ececec', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '260px' : '0', minWidth: sidebarOpen ? '260px' : '0', background: '#171717', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', overflow: 'hidden' }}>
        <div style={{ padding: '12px' }}>
          <button onClick={() => { setCurrentChat(null); setMessages([]); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: '1px solid #3f3f3f', borderRadius: '8px', color: '#ececec', cursor: 'pointer', fontSize: '14px' }}>
            ✏️ New chat
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {chats.length > 0 && <p style={{ color: '#8e8ea0', fontSize: '12px', padding: '8px 12px', margin: 0 }}>Recent</p>}
          {chats.map(chat => (
            <div key={chat._id} onClick={() => loadChat(chat._id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '2px', background: currentChat === chat._id ? '#2f2f2f' : 'transparent' }}>
              <span style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: '#c5c5d2' }}>{chat.title}</span>
              <button onClick={(e) => deleteChat(chat._id, e)} style={{ background: 'none', border: 'none', color: '#8e8ea0', cursor: 'pointer', fontSize: '12px' }}>🗑</button>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid #2f2f2f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#19c37d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '14px', flex: 1 }}>{user.name}</span>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#8e8ea0', cursor: 'pointer', fontSize: '16px' }} title="Logout">↩</button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #2f2f2f' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: '20px', marginRight: '12px' }}>☰</button>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>🤖 AI Assistant</span>
          {speaking && (
            <span style={{ marginLeft: 'auto', color: '#19c37d', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔊 Speaking...
              <button onClick={() => { stopSpeaking(); setSpeaking(false); }} style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}>Stop</button>
            </span>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '120px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h2 style={{ color: '#ececec', fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>How can I help you today?</h2>
              <p style={{ color: '#8e8ea0', fontSize: '16px' }}>Type or use 🎤 to speak your message</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} style={{ padding: '12px 0', background: msg.role === 'assistant' ? '#2f2f2f' : 'transparent' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? '#19c37d' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                    {msg.role === 'user' ? user.name[0].toUpperCase() : '🤖'}
                  </div>
                  <div style={{ flex: 1, lineHeight: '1.7', fontSize: '16px', color: '#ececec', paddingTop: '4px', whiteSpace: 'pre-wrap' }}>
                    {msg.content === '...' ? (
                      <span style={{ color: '#8e8ea0' }}>Thinking...</span>
                    ) : msg.content}
                  </div>
                  {msg.role === 'assistant' && msg.content !== '...' && (
                    <button onClick={() => speak(msg.content)} title="Read aloud"
                      style={{ background: 'none', border: 'none', color: '#8e8ea0', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>🔊</button>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px 24px', background: '#212121' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', background: '#2f2f2f', borderRadius: '16px', border: `1px solid ${listening ? '#19c37d' : '#3f3f3f'}`, display: 'flex', alignItems: 'flex-end', padding: '12px 16px', gap: '8px', transition: 'border-color 0.3s' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={listening ? '🎤 Listening...' : 'Message AI Assistant...'}
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#ececec', fontSize: '16px', resize: 'none', outline: 'none', maxHeight: '200px', lineHeight: '1.5' }} />
            <button onClick={startListening} title="Voice input"
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: listening ? '#19c37d' : '#3f3f3f', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
              <span style={{ fontSize: '16px' }}>{listening ? '⏹' : '🎤'}</span>
            </button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: input.trim() ? '#19c37d' : '#3f3f3f', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: '16px' }}>↑</span>
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#8e8ea0', fontSize: '12px', marginTop: '8px' }}>AI can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
}
