// tokenManager.js

const TOKEN_KEY = 'authToken';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const deleteToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const SELECTED_CAR_KEY = 'selectedCarId';

// Kiválasztott autó ID mentése a localStorage-ba
export const saveSelectedCar = (autoId) => {
  localStorage.setItem(SELECTED_CAR_KEY, autoId);
};

// Kiválasztott autó ID lekérése a localStorage-ból
export const getSelectedCar = () => {
  return localStorage.getItem(SELECTED_CAR_KEY);
};

// Kiválasztott autó ID törlése a localStorage-ból
export const deleteSelectedCar = () => {
  localStorage.removeItem(SELECTED_CAR_KEY);
};

const CAR_SIZE_KEY = 'carSize';

// Kiválasztott autó méretének mentése a localStorage-ba
export const saveCarSize = (carSize) => {
  if (carSize >= 0 && carSize <= 3) {
    localStorage.setItem(CAR_SIZE_KEY, carSize.toString()); // Az int-et stringgé alakítjuk
  } else {
    console.error('Érvénytelen autó méret:', carSize);
  }
};

// Kiválasztott autó méretének lekérése a localStorage-ból
export const getCarSize = () => {
  const carSize = localStorage.getItem(CAR_SIZE_KEY);
  return carSize ? parseInt(carSize, 10) : null; // A lekért stringet integeré alakítjuk
};

// Kiválasztott autó méretének törlése a localStorage-ból
export const deleteCarSize = () => {
  localStorage.removeItem(CAR_SIZE_KEY);
};

const CAR_NAME_KEY = 'carName';

// Kiválasztott autó nevének mentése a localStorage-ba
export const saveCarName = (carName) => {
  if (carName && typeof carName === 'string') {
    localStorage.setItem(CAR_NAME_KEY, carName); // A név közvetlenül elmentve
  } else {
    console.error('Érvénytelen autó név:', carName);
  }
};

// Kiválasztott autó nevének lekérése a localStorage-ból
export const getCarName = () => {
  const carName = localStorage.getItem(CAR_NAME_KEY);
  return carName ? carName : null; // A lekért név visszaadása
};

// Kiválasztott autó nevének törlése a localStorage-ból
export const deleteCarName = () => {
  localStorage.removeItem(CAR_NAME_KEY);
};

const START_DATE_KEY = 'startDateTime';
const END_DATE_KEY = 'endDateTime';

// Kezdő dátum és idő mentése a localStorage-ba
export const saveStartDate = (startDateTime) => {
  localStorage.setItem(START_DATE_KEY, startDateTime);
};

// Kezdő dátum és idő lekérése a localStorage-ból
export const getStartDate = () => {
  return localStorage.getItem(START_DATE_KEY);
};

// Kezdő dátum és idő törlése a localStorage-ból
export const deleteStartDate = () => {
  localStorage.removeItem(START_DATE_KEY);
};

// Befejező dátum és idő mentése a localStorage-ba
export const saveEndDate = (endDateTime) => {
  localStorage.setItem(END_DATE_KEY, endDateTime);
};

// Befejező dátum és idő lekérése a localStorage-ból
export const getEndDate = () => {
  return localStorage.getItem(END_DATE_KEY);
};

// Befejező dátum és idő törlése a localStorage-ból
export const deleteEndDate = () => {
  localStorage.removeItem(END_DATE_KEY);
};

export const initializeLocalStorage = () => {
  deleteCarName();
  deleteStartDate();
  deleteEndDate();
  deleteCarSize();
  const defaults = {
    authToken: null,
    theme: 'light', // Egyszerű szövegként mentjük

    selectedCarId: null,
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) {
      // Ha a value `null`, egyszerű szövegként tároljuk
      localStorage.setItem(key, value !== null ? value : 'null');
    }
  });
};