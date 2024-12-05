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

export const editCar = async (carData) => {
  const { email, auto_id, rendszam, color, name, type } = carData; // Az autó adatai objektumként kerülnek átadásra
  const response = await fetch('http://localhost:8084/api/editCar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      email, // Felhasználói email
      rendszam, // Új rendszám
      color, // Új szín
      name, // Új név
      type, // Új típus
      auto_id, // Azonosító az autóhoz
    },
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Hiányzó vagy érvénytelen rendszám.');
    }
    if (response.status === 409) {
      throw new Error('Az autó adatainak frissítése sikertelen.');
    }
    throw new Error('Hiba történt az autó frissítése során.');
  }

  const result = await response.text(); // Backend válasza
  return result;
};

export const fetchParkingPlots = async () => {
  try {
    const response = await fetch('http://localhost:8084/api/loadPlots', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Alapértelmezett content type
      },
    });

    if (!response.ok) {
      throw new Error('Nem sikerült lekérni a parkolóhelyeket.');
    }

    const plotsData = await response.json(); // A válasz JSON formátumra alakítása
    return plotsData; // Visszaadjuk a lekért adatokat
  } catch (error) {
    console.error('Hiba a parkolóhelyek lekérése során:', error);
    throw error; // Hiba dobása, ha a kérés nem sikerült
  }
};

export const saveBookingDate = async (bookingData) => {
  const { to_date, from_date, auto_id, parkolo_id } = bookingData; // Az időpontok és azonosítók objektumként kerülnek átadásra
  const response = await fetch('http://localhost:8084/api/saveBookingDate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'to_date': to_date, // Formázott dátum (yyyy-MM-dd HH:mm)
      'from_date': from_date, // Formázott dátum (yyyy-MM-dd HH:mm)
      'auto_id': auto_id, // Autó azonosítója
      'parkolo_id': parkolo_id, // Parkoló azonosítója
    },
  });

  if (!response.ok) {
    if (response.status === 412) {
      throw new Error('Nem megfelelő parkolóméret.');
    }
    if (response.status === 417) {
      throw new Error('Hiba a foglalás mentése során.');
    }
    throw new Error('Hiba történt a foglalás mentése során.');
  }

  const result = await response.text(); // Backend válasza
  return result;
};
