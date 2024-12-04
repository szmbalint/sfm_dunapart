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

export const addCar = async (carData) => {
  const { email, meret, rendszam, color, name, type } = carData; // Az autó adatai objektumként kerülnek átadásra
  const response = await fetch('http://localhost:8084/api/addCar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      email, // Felhasználói email
      meret,
      rendszam, // Rendszám
      color, // Szín
      name, // Név
      type, // Típus
    },
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Ilyen rendszámmal már létezik autó!');
    }
    throw new Error('Az autó nem került hozzáadásra.');
  }

  const result = await response.text(); // Backend válasza
  return result;
};