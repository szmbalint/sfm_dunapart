import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

import logoImage from '../../assets/logo.png';
import kepImage from '../../assets/kep.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Alapértelmezett űrlap küldés megakadályozása.

    try {
      const response = await fetch('http://localhost:8084/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Küldött adatok.
      });

      if (response.ok) {
        const data = await response.json();
        alert('Sikeres bejelentkezés!');
        console.log('Login response:', data); // Itt kezelheted a szerver válaszát.
        // Token mentése vagy navigáció:
        // localStorage.setItem('token', data.token);
        // navigate('/dashboard'); // Ha van irányítás.
      } else {
        setErrorMessage('Helytelen felhasználónév vagy jelszó!');
      }
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
      setErrorMessage('Hiba történt a szerverrel való kommunikáció során.');
    }
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
      <div className="div2">
        <div className="top-right">
          <Link to="/register" className="signup-button">
            Sign Up
          </Link>
        </div>

        <div className="login-form">
          <h2>Log into your account</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Username frissítése.
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Password frissítése.
              />
            </div>

            {/* Remember me és Forgot password */}
            <div className="options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className="forgot-password">
                <Link to="/forgotpassword">Forgot password?</Link>
              </div>
            </div>

            {/* Login gomb az alján */}
            <button type="submit">Login</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Hibaüzenet */}
        </div>
      </div>
    </div>
  );
};

export default Login;
