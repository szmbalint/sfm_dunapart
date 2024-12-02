// api.js
// api.js

export const fetchUserData = async (token) => {
  const response = await fetch('http://localhost:8084/api/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Token használata autentikációhoz
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült lekérni a felhasználói adatokat.');
  }
  
  const userData = await response.json(); // Válasz JSON formátumra alakítása
  return userData;
};

export const fetchCarsData = async (userEmail) => {
  const response = await fetch('http://localhost:8084/api/loadCars', {
    method: 'GET',
    headers: {
      email: `Bearer ${userEmail}`, // Email használata az autók lekéréséhez
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült betölteni az autók listáját.');
  }
  
  const carData = await response.json(); // Válasz JSON formátumra alakítása
  return carData;
};
