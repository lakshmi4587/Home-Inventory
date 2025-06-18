import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css'; // We’ll create this css too!

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1 = enter email, Step 2 = enter code + password

  const handleSendCode = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Code sent to your email!');
        setStep(2);
      } else {
        alert(data.message || 'Failed to send code');
      }
    } catch (err) {
      console.error('Error sending code:', err);
      alert('Something went wrong.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        alert(verifyData.message || 'Invalid code');
        return;
      }

      // Code verified, now reset password
      const resetResponse = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const resetData = await resetResponse.json();

      if (resetResponse.ok) {
        alert('Password reset successful! Please log in.');
        navigate('/');
      } else {
        alert(resetData.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="forgot-password-form">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Code</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <label>Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button type="submit">Reset Password</button>
          </form>
        )}

        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
