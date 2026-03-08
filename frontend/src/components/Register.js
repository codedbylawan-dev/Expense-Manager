import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API = `${API_URL}/api`;

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.confirm)
      return setError('All fields are required.');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm)
      return setError('Passwords do not match.');

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Full Name', type: 'text', placeholder: 'Lawan Kumar' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>💰</div>
        <h1 style={s.title}>Create Account</h1>
        <p style={s.subtitle}>Start managing your expenses</p>

        {error && <div style={s.error}>⚠️ {error}</div>}

        {fields.map(f => (
          <div key={f.name} style={s.field}>
            <label style={s.label}>{f.label}</label>
            <input style={s.input} type={f.type} name={f.name}
              placeholder={f.placeholder} value={form[f.name]} onChange={handle} />
          </div>
        ))}

        <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleRegister} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={s.link}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#059669', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)', padding: '20px' },
  card: { background: 'white', padding: '44px 40px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: '420px' },
  icon: { fontSize: '40px', textAlign: 'center', marginBottom: '8px' },
  title: { textAlign: 'center', color: '#064E3B', fontSize: '26px', fontWeight: 800, marginBottom: '6px' },
  subtitle: { textAlign: 'center', color: '#6B7280', marginBottom: '28px', fontSize: '15px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '15px', outline: 'none' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #064E3B, #059669)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' },
  error: { background: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  link: { textAlign: 'center', marginTop: '20px', color: '#6B7280', fontSize: '14px' }
};

export default Register;
