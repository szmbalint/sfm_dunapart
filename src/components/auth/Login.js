import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Az űrlap alapértelmezett működésének megakadályozása.

    try {
      const response = await fetch('https://your-backend-api-url.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Adatok küldése JSON formátumban.
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Sikeres bejelentkezés!');
        console.log('Bejelentkezési válasz:', data); // További feldolgozás, pl. token mentése.
      } else {
        setMessage('Hibás email vagy jelszó!');
      }
    } catch (err) {
      console.error('Hiba történt a szerverrel:', err);
      setMessage('Hiba történt a szerverrel való kommunikáció során.');
    }
  };

  return (
    <div className="grid-container">
      <div className="left-panel-grey">
        <button>
          <Link to="/">Vissza a főoldalra</Link>
        </button>
      </div>

      <div className="right-panel">
        <h1>Bejelentkezés</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Email állapot frissítése.
              required
            />
          </div>

          <div>
            <label htmlFor="password">Jelszó:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Jelszó állapot frissítése.
              required
            />
          </div>

          <button type="submit">Bejelentkezés</button>
        </form>

        {message && <p>{message}</p>} {/* Visszajelzés a felhasználónak */}
      </div>
    </div>
  );
}

export default Login;
