import React, { useState } from 'react'; // useState importálása
import { useNavigate } from 'react-router-dom'; // useNavigate a navigációhoz
import './Auth.css';
import { Link } from 'react-router-dom';

import logoImage from '../../assets/logo.png';
import kepImage from '../../assets/kep.png';

const SignUp = () => {
  const navigate = useNavigate(); // Navigáció inicializálása
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Űrlap mezők változásának kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Űrlap beküldése
  const handleSubmit = (e) => {
    e.preventDefault(); // Alapértelmezett beküldési viselkedés megakadályozása
    const { firstName, email, password } = formData;

    if (!firstName || !email || !password) {
      alert("All fields are required!");
      return;
    }

    alert("Account created successfully!");
    navigate('/'); // Visszairányítás a bejelentkezési oldalra
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
            Log In
          </Link>
        </div>

        <div className="signup-form">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first-name">First Name</label>
                <input 
                  type="text" 
                  id="first-name" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="Enter your first name" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="last-name">Last Name</label>
                <input 
                  type="text" 
                  id="last-name" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Enter your last name" 
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email" 
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
            <button type="submit" className="login-button">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
