import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Login.css';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-auth-page">
      <div className="pdf-auth-container">
        <h2 className="pdf-auth-logo">TaskOrbit</h2>
        
        <h1 className="pdf-auth-title">Create your account</h1>
        <p className="pdf-auth-subtitle">Please enter your details.</p>

        {error && <div className="pdf-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="pdf-auth-form">
          <div className="form-group">
            <label className="pdf-form-label">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="pdf-form-input"
              placeholder="Enter your name"
              required
              id="signup-name"
            />
          </div>

          <div className="form-group">
            <label className="pdf-form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="pdf-form-input"
              placeholder="Enter your email"
              required
              id="signup-email"
            />
          </div>

          <div className="form-group">
            <label className="pdf-form-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="pdf-form-input"
              placeholder="Password"
              required
              id="signup-password"
            />
          </div>

          <button type="submit" className="pdf-btn-primary" disabled={loading} id="signup-submit">
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>

        <p className="pdf-auth-footer">
          Already have an account? <Link to="/login" className="pdf-auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
