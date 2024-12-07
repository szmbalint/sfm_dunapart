import React, {useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CarPicker from "./components/car/CarPicker";
import DatePicker from "./components/date/DatePicker";
import PlotPicker from "./components/plot/PlotPicker";
import ForgotPassword from './components/auth/ForgotPassword';
import { calculateTimeUntilFree } from './utils/TimeCalculator';
import { fetchUserData, fetchCarsData, fetchParkingPlots } from './api/dataController';
import { getToken, deleteToken } from './components/auth/tokenManager';
import logoImage from '../src/assets/logo.png';
import kepImage from '../src/assets/kep.png';

function Home() {
  const [cars, setCars] = useState([]);
  const [userName, setUserName] = useState(null); // Felhasználó neve
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Bejelentkezett állapot
  const [theme, setTheme] = useState(localStorage.getItem('theme') || ''); // Alapértelmezett téma
  
// Téma váltása
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Mentés a localStorage-be
  };

  useEffect(() => {
    const htmlElement = document.documentElement; // A html tag referencia
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const token = getToken(); // Token lekérése
  
    if (token) {
      setIsLoggedIn(true); // Bejelentkezett állapot beállítása
      fetchUserData(token)
        .then((userData) => {
          setUserName(userData.firstName); // A felhasználó nevének beállítása
          const userEmail = userData.email; // Email kinyerése a felhasználói adatokból
          return Promise.all([fetchCarsData(userEmail), fetchParkingPlots()]); // Több API hívás párhuzamosan
        })
        .then(([carData, plotsData]) => {
          // Szűrt autók (csak ahol parkolo_id nem null)
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
        })
        .catch((error) => {
          console.error('Hiba a felhasználói adatok, autók vagy parkolóhelyek betöltésekor:', error);
        });
    } else {
      setIsLoggedIn(false); // Ha nincs token, akkor kijelentkezett állapot
      console.error('Nincs token!');
    }
  }, []);
  
  
  const handleLogout = () => {
    deleteToken(); // Töröld a tokent
    setIsLoggedIn(false);
    setUserName(null);
    setCars([]); // Az autók törlése kijelentkezéskor
  };
  

  return (
    <div className="grid-container">
      <div className="left-panel">
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
          <h2>Welcome, {userName} to DunaPark!</h2>
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
                  className={`car-container`}
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
                      <button className="edit-btn">
                        <img src="/icons/edit.png" alt="edit" />
                      </button>
                    </div>
                    <div className='delete-container'>
                    <span>
                      <strong>Plot </strong> • {car.parkolo.parkolo_id}
                    </span>
                      <button className="delete-btn" >
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
