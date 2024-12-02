import React, { useEffect, useState } from 'react';
import { getToken, deleteToken } from './components/auth/tokenManager'; // Token kezelő függvények importálása
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from './api/dataController';

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // Felhasználói adatok tárolása
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();

      if (!token) {
        alert('Nincs érvényes token! Kérjük, jelentkezz be.');
        navigate('/login'); // Ha nincs token, visszairányítás a bejelentkezési oldalra
        return;
      }

      try {
        const data = await fetchUserData(token);
        setUserData(data); // Felhasználói adatok tárolása
      } catch (error) {
        console.error('Hiba:', error);
        setErrorMessage(error.message); // Hibakezelés
        if (error.message.includes('Lejárt token')) {
          deleteToken();
          navigate('/login'); // Ha lejárt a token, navigálj a bejelentkezési oldalra
        }
      }
    };

    fetchData();
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
