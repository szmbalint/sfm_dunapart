import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate hozzáadása
import './Auth.css';

import logoImage from '../../assets/logo.png';
import kepImage from '../../assets/kep.png';

const Login = () => {
  const navigate = useNavigate(); // Navigáció inicializálása
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  // Űrlap mezők változásának kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Űrlap beküldése
  const handleSubmit = async (e) => {
    e.preventDefault(); // Alapértelmezett beküldési viselkedés megakadályozása
    const { usernameOrEmail, password } = formData;

    if (!usernameOrEmail || !password) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      // API hívás a bejelentkezési adatokkal
      const response = await fetch('http://your-backend-url/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || 'Invalid credentials'}`);
        return;
      }

      const data = await response.json();
      alert(`Welcome back, ${data.username || 'User'}!`);
      navigate('/dashboard'); // Sikeres bejelentkezés után irányítás a főoldalra
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in. Please try again.');
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usernameOrEmail">Username or Email</label>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter your username or email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            {/* Remember me és Forgot password */}
            <div className="options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            {/* Login gomb az alján */}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
