import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-auth-page">
      <div className="pdf-auth-container">
        <h2 className="pdf-auth-logo">TaskOrbit</h2>
        
        <h1 className="pdf-auth-title">Log in to your account</h1>
        <p className="pdf-auth-subtitle">Please enter your details.</p>

        {error && <div className="pdf-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="pdf-auth-form">
          <div className="form-group">
            <label className="pdf-form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pdf-form-input"
              placeholder="Enter your email"
              required
              id="login-email"
            />
          </div>

          <div className="form-group">
            <label className="pdf-form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pdf-form-input"
              placeholder="Password"
              required
              id="login-password"
            />
          </div>

          <button type="submit" className="pdf-btn-primary" disabled={loading} id="login-submit">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="pdf-auth-footer">
          Don't have an account? <Link to="/signup" className="pdf-auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
