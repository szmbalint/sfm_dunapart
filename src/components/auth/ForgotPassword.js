import React, { useState } from "react";
import { Link } from 'react-router-dom';

import logoImage from '../../assets/logo.png';
import kepImage from '../../assets/kep.png';

const ForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Password changed successfully!");
    }
  };

  return (
    <div className="parent">
      {/* Bal oldal */}
      <div className="div1">
        <div className="section1">
          <img src={logoImage} alt="Section1" className='section-logo' /> {/* Használjuk a logoImage változót */}
        </div>

        <div className="section2">
          <p className="section-text">
            We make <br />
            parking <br />
            effortless
          </p>
        </div>

        <div className="section3">
          <img src={kepImage} alt="Section3" className='section-kep' /> {/* Használjuk a kepImage változót */}
        </div>
      </div>

      {/* Jobb oldal */}
      <div className="div2">

        <div className="top-right">
          <Link to="/login" className="signup-button">
            Log in
          </Link>
        </div>
        <div className="forgot-password-page">
          <h2>Enter the new password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm your password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
