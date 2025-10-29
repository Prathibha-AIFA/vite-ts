import React, { useState } from "react";
import "./Login.css"; // import the CSS file
import { apiLogin, apiRegister } from '../api';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let res: any;
      if (isRegister) {
        res = await apiRegister(username.trim(), email.trim(), password);
      } else {
        res = await apiLogin(email.trim(), password);
      }
      if (res?.token) {
        localStorage.setItem('token', res.token);
        onLogin(res.user?.username || username);
      } else if (res?.error) {
        setError(res.error);
      } else {
        setError('Unexpected response from server');
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isRegister ? 'Create an account' : 'Welcome Back 👋'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Sign up' : 'Login')}
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          {isRegister ? (
            <>
              Already have an account? <button type="button" className="link-btn" onClick={() => setIsRegister(false)}>Login</button>
            </>
          ) : (
            <>
              New here? <button type="button" className="link-btn" onClick={() => setIsRegister(true)}>Create account</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
