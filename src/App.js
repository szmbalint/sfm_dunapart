import React, {useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CarPicker from "./components/car/CarPicker";
import DatePicker from "./components/date/DatePicker";
import PlotPicker from "./components/plot/PlotPicker";
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './Dashboard';
import { fetchUserData, fetchCarsData, fetchParkingPlots } from './api/dataController';
import { getToken, deleteToken } from './components/auth/tokenManager';
import logoImage from '../src/assets/logo.png';
import kepImage from '../src/assets/kep.png';

function Home() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null); // Kijelölt autó
    const [userName, setUserName] = useState(null); // Felhasználó neve
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Bejelentkezett állapot

  const handleSelectCar = (index) => {
    setSelectedCar(index === selectedCar ? null : index); // Toggling selection
  };

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
          const updatedCars = filteredCars.map((car) => {
            const plot = plotsData.find((p) => p.parkolo_id === car.parkolo.parkolo_id); // Megfelelő parkolóhely keresése
            const toDate = plot ? new Date(plot.to_date) : null; // to_date dátumként
            const now = new Date(); // Jelenlegi idő
  
            return {
              ...car,
              to_date: toDate, // to_date hozzáadása
              timeUntilFree: toDate
                ? {
                    hours: Math.floor((toDate - now) / 3600000), // Órák kiszámítása
                    minutes: Math.floor(((toDate - now) % 3600000) / 60000), // Percek kiszámítása
                    formatted: `${Math.floor((toDate - now) / 3600000)}:${Math.floor(((toDate - now) % 3600000) / 60000)} left`, // Formázott kimenet
                  }
                : null, // Ha nincs `to_date`, akkor null
            };
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
{/* Üdvözlő szöveg, felhasználó nevével, ha be van jelentkezve */}
{isLoggedIn ? (
  <>
    <h2>Welcome, {userName} to DunaPark!</h2>
  </>
) : (
  <>
    <h1>Welcome to DunaPark</h1>
    <h3>Please log in for the best user experience!</h3>
  </>
)}

<nav>
  {isLoggedIn ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <>
      <button><Link to="/Login">Login</Link></button>
      <button><Link to="/Register">Register</Link></button>
    </>
  )}
</nav>

    <div className='car-main-container'>
      <h1>Your parking cars</h1>
      <span className='separator'></span>
        {cars.length > 0 ? (
          <ul>
            {cars.map((car, index) => (
              <li
                key={index}
                className={`car-container ${
                  selectedCar === index ? 'selected' : ''
                }`}
                onClick={() => handleSelectCar(index)}
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
          <p>Nem találhatóak autók az adott felhasználóhoz.</p>
        )}

{/* Gomb a CarPicker oldalra navigálásra */}

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
        <Route path="/Dashboard" element={<Dashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;
