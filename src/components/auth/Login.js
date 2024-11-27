import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

import logoImage from '../../assets/logo.png';
import kepImage from '../../assets/kep.png';


const Login = () => {
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
          <Link to="/register" className="signup-button">
            Sign Up
          </Link>
        </div>

        <div className="login-form">
          <h2>Log into your account</h2>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input type="text" id="username" placeholder="Enter your username or email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
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

            {/*login gomb az alján*/}
            <button 
              type="submit"
              
              onClick={(e) => {
                e.preventDefault();
                alert("Logged in!");
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Default export hozzáadása
export default Login;
