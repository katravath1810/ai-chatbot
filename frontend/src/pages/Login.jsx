import { useState } from 'react';

const BACKEND = 'https://ai-chatbot-backend-4sjk.onrender.com';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const url = isRegister ? `${BACKEND}/api/auth/register` : `${BACKEND}/api/auth/login`;
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
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#212121', alignItems: 'center', justifyContent: 'center', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
          <h1 style={{ color: '#ececec', fontSize: '28px', fontWeight: '600', margin: 0 }}>
            {isRegister ? 'Create account' : 'Welcome back'}
          </h1>
          <p style={{ color: '#8e8ea0', marginTop: '8px' }}>
            {isRegister ? 'Sign up to get started' : 'Sign in to continue'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#3f1f1f', border: '1px solid #7f3f3f', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#ff6b6b', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isRegister && (
            <input placeholder="Full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ padding: '14px 16px', background: '#2f2f2f', border: '1px solid #3f3f3f', borderRadius: '10px', color: '#ececec', fontSize: '16px', outline: 'none' }} />
          )}
          <input placeholder="Email address" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ padding: '14px 16px', background: '#2f2f2f', border: '1px solid #3f3f3f', borderRadius: '10px', color: '#ececec', fontSize: '16px', outline: 'none' }} />
          <input placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ padding: '14px 16px', background: '#2f2f2f', border: '1px solid #3f3f3f', borderRadius: '10px', color: '#ececec', fontSize: '16px', outline: 'none' }} />
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: '14px', background: '#19c37d', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '4px' }}>
            {loading ? 'Please wait...' : (isRegister ? 'Create account' : 'Sign in')}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#8e8ea0', marginTop: '24px', fontSize: '14px' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ color: '#19c37d', cursor: 'pointer', fontWeight: '500' }}>
            {isRegister ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}
