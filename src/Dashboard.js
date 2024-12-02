import React, { useEffect, useState } from 'react';
import { getToken, deleteToken } from './components/auth/tokenManager'; // Token kezelő függvények importálása
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // Felhasználói adatok tárolása
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();

      if (!token) {
        alert('Nincs érvényes token! Kérjük, jelentkezz be.');
        navigate('/login'); // Ha nincs token, visszairányítás a bejelentkezési oldalra
        return;
      }

      try {
        console.log(token);
        const response = await fetch('http://localhost:8084/api/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Felhasználói adatok tárolása
        } else if (response.status === 401) {
          setErrorMessage('Lejárt token. Kérjük, jelentkezz be újra.');
          deleteToken();
          navigate('/login');
        } else {
          setErrorMessage('Hiba történt az adatok lekérdezésekor.');
        }
      } catch (error) {
        console.error('Hálózati hiba:', error);
        setErrorMessage('Hiba történt a szerverrel való kommunikáció során.');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    deleteToken();
    navigate('/login'); // Kijelentkezés után navigálás a bejelentkezési oldalra
  };

  return (
    <div className="dashboard-container">
      <h1>Felhasználói profil</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {userData ? (
        <div className="user-info">
          <p><strong>Felhasználónév:</strong> {userData.firstName} {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Regisztráció dátuma:</strong> {userData.registrationDate}</p>
        </div>
      ) : (
        <p>Adatok betöltése...</p>
      )}
      <button className="logout-button" onClick={handleLogout}>
        Kijelentkezés
      </button>
    </div>
  );
};

export default Dashboard;
