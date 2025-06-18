import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Import the CSS file

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login success:', data);
      
        // Store token
        localStorage.setItem('token', data.token);
      
        // Optionally, store user info too
        localStorage.setItem('user', JSON.stringify(data.user));
      
        navigate('/items');
      }
       else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome to HomeHive</h2>
        <p className="login-subtitle">Smart home inventory management at your fingertips</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="form-label-group">
              <label>Password</label>
              <Link to="/forgot-password" className="link-small">Forgot password?</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          
          {/* <div className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label>Remember me</label>
          </div> */}

          <button type="submit" className="login-button">Log in</button>
        </form>

        {/* <div className="or-divider">OR CONTINUE WITH</div>

        <div className="social-buttons">
          <button className="social-button"><span>📧</span> Google</button>
          <button className="social-button"><span>📘</span> Facebook</button>
        </div> */}

        <p className="signup-text">
          Don’t have an account? <Link to="/signup" className="link-small">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
