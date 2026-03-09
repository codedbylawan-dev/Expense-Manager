import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Backend API URL
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>💰</div>

        <h1 style={styles.title}>Expense Manager</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {/* Email */}
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Login Button */}
        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={styles.link}>
          No account?{" "}
          <Link to="/register" style={{ color: "#059669", fontWeight: 600 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

/* Styles */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #064E3B 0%, #059669 100%)",
    padding: "20px"
  },
  card: {
    background: "white",
    padding: "44px 40px",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "420px"
  },
  icon: {
    fontSize: "40px",
    textAlign: "center",
    marginBottom: "8px"
  },
  title: {
    textAlign: "center",
    color: "#064E3B",
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "6px"
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: "28px",
    fontSize: "15px"
  },
  field: {
    marginBottom: "18px"
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px"
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none"
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #064E3B, #059669)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "4px"
  },
  error: {
    background: "#FEF2F2",
    color: "#DC2626",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px"
  },
  link: {
    textAlign: "center",
    marginTop: "20px",
    color: "#6B7280",
    fontSize: "14px"
  }
};

export default Login;