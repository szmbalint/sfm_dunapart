import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../api/dataController";

import logoImage from "../../assets/logo.png";
import kepImage from "../../assets/kep.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ellenőrizzük, hogy a két jelszó egyezik-e
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Ha a jelszavak megegyeznek, meghívjuk a resetPassword funkciót az emaillel és a jelszóval
    resetPassword(newPassword, email);

    // Rendelkezhetünk a válasszal (pl. siker üzenet vagy navigálás)
    alert("Password reset request sent!");
  };

  return (
    <div className="parent">
      {/* Bal oldal */}
      <div className="div1">
        <div className="section1">
          <img src={logoImage} alt="Section1" className="section-logo" />
        </div>

        <div className="section2">
          <p className="section-text">
            We make <br />
            parking <br />
            effortless
          </p>
        </div>

        <div className="section3">
          <img src={kepImage} alt="Section3" className="section-kep" />
        </div>
      </div>

      {/* Jobb oldal */}
      <div className="div2 green">
        <div className="top-right">
          <button>
            <Link to="/login">
              Log in
            </Link>
          </button>
        </div>
        <div className="forgot-password-page">
          <h2>Enter your email and new password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}  // Set the email value to the state
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
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
