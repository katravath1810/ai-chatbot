import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const url = isRegister
      ? 'https://ai-chatbot-backend-4sjk.onrender.com/api/auth/register'
      : 'https://ai-chatbot-backend-4sjk.onrender.com/api/auth/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '360px' }}>
        <h2 style={{ color: 'white', marginBottom: '24px', textAlign: 'center' }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        {isRegister && (
          <input placeholder="Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white' }} />
        )}
        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white' }} />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white' }} />
        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '16px', cursor: 'pointer' }}
          onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}
