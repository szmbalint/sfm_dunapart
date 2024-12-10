import React, {useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CarPicker from "./components/car/CarPicker";
import DatePicker from "./components/date/DatePicker";
import PlotPicker from "./components/plot/PlotPicker";
import ForgotPassword from './components/auth/ForgotPassword';
import { calculateTimeUntilFree } from './utils/TimeCalculator';
import { deleteCarName, deleteCarSize, deleteEndDate, deleteSelectedCar, deleteStartDate, initializeLocalStorage } from './components/auth/tokenManager';
import { fetchUserData, fetchCarsData, fetchParkingPlots, deleteBookedPlot, modifyBookingDate, clearDatabase  } from './api/dataController';
import { getToken, deleteToken } from './components/auth/tokenManager';
import logoImage from '../src/assets/logo.png';
import kepImage from '../src/assets/kep.png';
import FloatingMenu from './utils/FloatingMenu';

function Home() {
  const [cars, setCars] = useState([]);
  const [userName, setUserName] = useState(null); // Felhasználó neve
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Bejelentkezett állapot
  const [theme, setTheme] = useState(localStorage.getItem('theme') || ''); // Alapértelmezett téma
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCarToDelete, setSelectedCarToDelete] = useState(null);
  const [newDate, setNewDate] = useState(''); // Kezdő dátum, amit a car-ból kinyerünk
  const [selectedCar, setSelectedCar] = useState(null); // Add selectedCar to track which car was selected for editing
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1 másodperces várakozás az animáció indításához
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Kb. 500ms után indul el az animáció

    return () => clearTimeout(timer);
  }, []);

  // Téma váltása
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Mentés a localStorage-be
  };
  
  useEffect(() => {
    clearDatabase();
    initializeLocalStorage(); // Inicializálás az alkalmazás betöltésekor
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement; // A html tag referencia
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
  }, [theme]);

  const handleOpenModal = (car) => {
    setSelectedCar(car); // Save the selected car for editing
    
    setIsModalOpen(true); // Modal megjelenítése

  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Modal elrejtése
  };

  const handleSaveDate = async () => {
    try {
      if (selectedCar) {
        const formattedDate = newDate.replace('T', ' ');; // Formázott dátum (pl. yyyy-MM-dd HH:mm)

        const result = await modifyBookingDate(formattedDate, selectedCar.parkolo.parkolo_id); // Use selectedCar
        fetchUserAndCarData(getToken());
        console.log(result);
        handleCloseModal(); // Modal bezárása, ha a dátum sikeresen módosítva lett
      }
    } catch (error) {
      console.error('Hiba a dátum módosításakor:', error);
    }
  };

  // Külön függvény a logika kiszervezésére
const fetchUserAndCarData = async (token) => {
  try {
    const userData = await fetchUserData(token); // Felhasználói adatok lekérése
    setUserName(userData.firstName); // Felhasználó neve
    const userEmail = userData.email; // Email kinyerése

    const [carData, plotsData] = await Promise.all([fetchCarsData(userEmail), fetchParkingPlots()]); // Több API hívás párhuzamosan

    // Szűrt autók (csak ahol parkolóhely nem null)
    const filteredCars = carData.filter((car) => car.parkolo !== null);

    // Autókhoz hozzárendeljük a timeUntilFree változót
    const updatedCars = filteredCars
      .map((car) => {
        const plot = plotsData.find(
          (p) => p.parkolo_id === car.parkolo.parkolo_id
        ); // Megfelelő parkolóhely keresése
        const toDate = plot ? new Date(plot.to_date) : null; // to_date dátumként

        return {
          ...car,
          to_date: toDate,
          timeUntilFree: calculateTimeUntilFree(toDate),
        };
      })
      .filter((car) => {
        // Csak azokat az autókat tartjuk meg, amelyeknél a hátralévő idő nem negatív
        const timeUntilFree = car.timeUntilFree;
        return timeUntilFree && timeUntilFree.hours >= 0 && timeUntilFree.minutes >= 0;
      });

    console.log('Car data:', updatedCars);
    setCars(updatedCars); // Frissített autóadatok mentése

  } catch (error) {
    console.error('Hiba a felhasználói adatok, autók vagy parkolóhelyek betöltésekor:', error);
  }
};

// useEffect módosítása
useEffect(() => {
  const token = getToken(); // Token lekérése
  if (token && token !== 'null' && token !== '') {
    setIsLoggedIn(true); // Bejelentkezett állapot beállítása
    fetchUserAndCarData(token); // Adatok lekérése külön függvénnyel
  } else {
    setIsLoggedIn(false); // Ha nincs token, akkor kijelentkezett állapot
  }
}, []);
  
  const handleLogout = () => {
    deleteToken(); // Töröld a tokent
    deleteSelectedCar();
    deleteCarSize();
    deleteStartDate();
    deleteEndDate();
    deleteCarName();
    setIsLoggedIn(false);
    setUserName(null);
    setCars([]); // Az autók törlése kijelentkezéskor
  };

  const handleDeleteOpenModal = (parkolo_id, auto_id) => {
    setSelectedCarToDelete({ parkolo_id, auto_id });
    setIsDeleteModalOpen(true); // Modal megnyitása
  };
  
  const handleDeleteCloseModal = () => {
    setIsDeleteModalOpen(false); // Modal bezárása
    setSelectedCarToDelete(null); // Reset the car to delete
  };

  const handleConfirmDelete = async () => {
    if (selectedCarToDelete) {
      const { parkolo_id, auto_id } = selectedCarToDelete;
      try {
        await deleteBookedPlot(parkolo_id, auto_id);
        fetchUserAndCarData(getToken()); // Frissítsük az adatokat
        console.log('Foglalás törölve');
      } catch (error) {
        console.error('Hiba történt a törlés során:', error);
      }
      handleDeleteCloseModal(); // Modal bezárása
    }
  };
  

  return (
    <div className="grid-container">
      <div className="left-panel">
      <div className="section1">
          <img src={logoImage} alt="Section1" className='section-logo' /> {/* Használjuk a logoImage változót */}
        </div>

        <div className="section2">
          <p className={`appearY ${isVisible ? 'visible' : ''} section-text`}>
            We make <br />
            parking <br />
            effortless
          </p>
        </div>

        <div className="section3">
          <img src={kepImage} alt="Section3" className='section-kep' /> {/* Használjuk a kepImage változót */}
        </div>
      </div>
        <FloatingMenu />
      <div className="right-panel green">
        <nav>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button><Link to="/Login">Login</Link></button>
            </>
          )}
        </nav>
      {isLoggedIn ? (
        <>
          <h2 className={`appear ${isVisible ? 'visible' : ''}`}>Welcome, {userName} to DunaPark!</h2>
        </>
      ) : (
        <>
        <h1>Welcome to DunaPark!</h1>
        <h3>Please log in for the best user experience!</h3>
        </>
      )}

      <div className='car-main-container'>
        <h1>Your parking cars</h1>
        <span className='separator'></span>
          {cars.length > 0 ? (
            <ul>
              {cars.map((car, index) => (
                <li
                  key={index}
                  className={`car-container appearY ${isVisible ? 'visible' : ''}`}
                >
                  <img src={`/cars/${car.type.toLowerCase()}.png`} alt={car.type} />
                  <div className="car-details">
                    <h2>{car.name}</h2>
                    <div className="license-type">
                      <span className='license'><strong>License</strong> • {car.rendszam}</span>
                      <span className={`type ${car.color.toLowerCase()}`}><strong>Type</strong> • {car.type}</span>
                    </div>
                  </div>
                  <div className="btns">
                    <div className='edit-container'>
                    <span>
                    <strong>Time </strong> • {car.timeUntilFree.formatted}
                    </span>
                    <button className="edit-btn" onClick={() => handleOpenModal(car)}>
                      <img src="/icons/edit.png" alt="edit" />
                    </button>




                    </div>
                    <div className='delete-container'>
                    <span>
                      <strong>Plot </strong> • {car.parkolo.parkolo_id}
                    </span>
                    <button className="delete-btn" onClick={() => handleDeleteOpenModal(car.parkolo.parkolo_id, car.auto_id)}>
  <img src="/icons/delete.png" alt="delete" />
</button>

                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
          ) : (
            <p>No cars found for the given user.</p>
          )}
            <Link to="/CarPicker">
              <button className='addcar-btn'>
                <img src='/icons/add.png' alt='add-icon' />
              </button>
            </Link>
          </div>
        </div>

        {isDeleteModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Delete car</h2>
      <p>Are you sure you want to cancel your reservation for this parking space?</p>
      <div className="modal-actions">
        <button onClick={handleConfirmDelete}>Yes</button>
        <button onClick={handleDeleteCloseModal}>No</button>
      </div>
    </div>
  </div>
)}

        {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content modify-date">
      <h2>Modify Booking Date</h2>
      <div>
          
        <label htmlFor="newDate">New Date and Time:</label>
        <input
          type="datetime-local"  // Dátum és idő választó
          id="newDate"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)} // Dátum és idő frissítése
        />
      </div>
      <div className="modal-actions">
        <button onClick={handleSaveDate}>Save</button>
        <button onClick={handleCloseModal}>Cancel</button>
      </div>
    </div>
  </div>
)}
      </div>
    );
  }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/CarPicker" element={<CarPicker />} />
        <Route path="/DatePicker" element={<DatePicker />} />
        <Route path="/PlotPicker" element={<PlotPicker />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
      </Routes>
    </Router>
  );
}

export default App;
