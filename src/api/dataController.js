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

export const deleteCar = async (carData) => {
  const { email, auto_id } = carData; // Az autó adatainak szükséges elemei

  const response = await fetch('http://localhost:8084/api/deleteCar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      email, // Felhasználói email
      auto_id, // Az autó azonosítója
    },
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Hiányzó vagy érvénytelen autóazonosító.');
    }
    if (response.status === 409) {
      throw new Error('Az autó törlését nem sikerült végrehajtani.');
    }
    throw new Error('Hiba történt az autó törlése során.');
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
    if (response.status === 410) {
      throw new Error('Már parkolsz valahol, barátom.');
    }
    throw new Error('Hiba történt a foglalás mentése során.');
  }

  const result = await response.text(); // Backend válasza
  return result;
};

export const deleteBookedPlot = async (parkolo_id, auto_id) => {
  try {
    const response = await fetch('http://localhost:8084/api/deleteBookedPlot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'parkolo_id': parkolo_id,
        'auto_id': auto_id,
      },
    });

    if (!response.ok) {
      if (response.status === 412) {
        throw new Error('Nem megfelelő parkolóméret.');
      }
      if (response.status === 417) {
        throw new Error('Hiba a foglalás törlése során.');
      }
      throw new Error('Hiba történt a foglalás törlése során.');
    }

    const result = await response.text(); // Backend válasza
    return result;
  } catch (error) {
    console.error('Hálózati hiba:', error);
    throw error;
  }
};

export const modifyBookingDate = async (to_date, selected_plot) => {
  try {
    const response = await fetch('http://localhost:8084/api/modifyBookingDate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'to_date': to_date, // Formázott dátum (yyyy-MM-dd HH:mm)
        'parkolo_id': selected_plot, // Parkoló azonosítója
      },
    });

    if (!response.ok) {
      if (response.status === 412) {
        throw new Error('A foglalás meghosszabbítása nem lehetséges.');
      }
      if (response.status === 417) {
        throw new Error('Hiba történt a foglalás módosítása során.');
      }
      throw new Error('Hiba történt a foglalás módosítása során.');
    }

    const result = await response.text(); // A backend válasza
    return result;
  } catch (error) {
    console.error('Hálózati hiba:', error);
    throw error;
  }
};

// resetPassword.js or resetPassword.ts (depending on your setup)
export const resetPassword = async (newPassword, email) => {
  const url = "http://localhost:8084/api/forgotPassword"; // Cseréld le a megfelelő API végpontra

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ha JSON-t is küldenél, ez szükséges
        "newpasswd": newPassword,
        "email": email
      }
    });

    if (response.ok) {
      const message = await response.text();
      console.log("Sikeres jelszó módosítás:", message);
    } else {
      const error = await response.text();
      console.error("Sikertelen jelszó módosítás:", error);
    }
  } catch (error) {
    console.error("Hiba történt a kérés során:", error);
  }
};

export const clearDatabase = async () => {
  try {
    const response = await fetch('http://localhost:8084/api/clearDatabase', {
      method: 'POST', // POST kérést küldünk
      headers: {
        'Content-Type': 'application/json', // Az adatok formátuma JSON
        // Ha szükséges token vagy egyéb autentikációs fejlécek:
        // 'Authorization': `Bearer ${yourAuthToken}`,
      },
    });

    // Ellenőrizzük, hogy a válasz rendben van-e
    if (response.ok) {
      const data = await response.text(); // Az adatbázis törlés sikerességének üzenete
      console.log(data);
    } else {
      const errorData = await response.text();
      alert(`Hiba történt: ${errorData}`);
    }
  } catch (error) {
    // Hiba kezelése, ha a kérelem nem sikerül
    console.error('Hiba a kérés során:', error);
    alert('Hiba a kérés során');
  }
};
