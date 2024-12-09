import React, { useState, useEffect } from 'react';
import './PlotPicker.css';
import Modal from '../../utils/Modal';
import ParkingContainer from './ParkingContainer';
import { fetchParkingPlots } from '../../api/dataController';
import { getStartDate, getEndDate, getSelectedCar, getCarSize, getCarName } from '../auth/tokenManager';
import { calculateTimeUntilFree } from '../../utils/TimeCalculator'; // Feltételezve, hogy itt található a metódus

import FloatingMenu from '../../utils/FloatingMenu';
const levels = ['1st floor', '2nd floor', '3rd floor'];

function PlotPicker() {
  const [currentLevel, setCurrentLevel] = useState('1st floor');
  const [parkingData, setParkingData] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const [theme] = useState(localStorage.getItem('theme')); // Alapértelmezett téma

  useEffect(() => {
    const htmlElement = document.documentElement; // A html tag referencia
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
}, [theme]);
const loadParkingData = async () => {
  try {
    const data = await fetchParkingPlots();

    // timeUntilFree kiszámítása és hozzácsatolása minden spot-hoz
    const updatedData = data.map((spot) => {
      const fromDate = spot.from_date ? new Date(spot.from_date) : null;
      const toDate = spot.to_date ? new Date(spot.to_date) : null;
      const currentDate = new Date();

      if (!fromDate && !toDate) {
        // Ha nincs from_date és to_date, timeUntilFree legyen null
        return {
          ...spot,
          timeUntilFree: null,
        };
      }

      if (fromDate && fromDate > currentDate) {
        // Ha a parkolóhely foglalása még nem kezdődött el
        const timeDifferenceMinutes = Math.floor((fromDate - currentDate) / (1000 * 60));
        return {
          ...spot,
          timeUntilFree: timeDifferenceMinutes > 0 ? { minutes: timeDifferenceMinutes } : null,
        };
      }

      if (toDate && toDate < currentDate) {
        // Ha már lejárt a parkolási idő
        return {
          ...spot,
          timeUntilFree: { days: 0, hours: 0, minutes: 0, formatted: 'Waiting to leave' },
        };
      }

      if (toDate) {
        // Ha a parkolóhely foglalása aktuálisan zajlik
        const timeUntilFree = calculateTimeUntilFree(toDate);
        return {
          ...spot,
          timeUntilFree: timeUntilFree || null, // Ha a számítás hibás, akkor null
        };
      }

      // Ha nincs megfelelő dátum, timeUntilFree legyen null
      return {
        ...spot,
        timeUntilFree: null,
      };
    });

    setParkingData(updatedData);
  } catch (error) {
    console.error('Error loading parking data:', error);
  }
};

useEffect(() => {
  loadParkingData();
  console.log(localStorage);
}, []);



  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const getSpotColor = (spot) => {
    const carSize = getCarSize(); // A kocsi méretének lekérése a localStorage-ból

// Szabad parkoló, és a méret megfelelő
  if (carSize === null) {
    return { color: 'gray', image: '/icons/default.png' };
  }

// Foglalt parkoló
if (spot.status && (spot.timeUntilFree?.minutes > 30 || spot.timeUntilFree?.hours >= 1 || spot.timeUntilFree?.days >= 1)) {
  return { color: 'red', image: '/icons/occupied.png' };
}

// Hamarosan szabad parkoló
if (spot.status && spot.timeUntilFree?.minutes <= 30) {
  return { color: 'yellow', image: '/icons/soon_free.png' };
}

  
    // Szabad parkoló, de a hely nem megfelelő méretű
    if (!spot.status) {
      if (carSize > spot.meret) {
        // A kocsi túl nagy a helyhez képest
        return { color: 'red', image: '/icons/small.png' };
      }
      if (carSize < spot.meret) {
        // A kocsi túl kicsi a helyhez képest
        return { color: 'red', image: '/icons/large.png' };
      }
    }
  
    // Szabad parkoló, és a méret megfelelő
    if (!spot.status && carSize === spot.meret) {
      return { color: 'gray', image: '/icons/free.png' };
    }
  
    // Alapértelmezett eset
    return { color: 'gray', image: '/icons/default.png' };
  };
  
  const handleSpotClick = (spot) => {
    const { color } = getSpotColor(spot);
    if (color !== 'gray') {
      console.log('Spot is not available:', spot);
      return; // Csak akkor lépünk tovább, ha a parkolóhely szabad
    }
    
    setSelectedSpot(spot);
    setShowModal(true);
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSpot(null);
  };

  const handleConfirmSelection = async () => {
    if (selectedSpot) {
      // Adatok lekérése a localStorage-ből
      const to_date = getEndDate();
      const from_date = getStartDate();
      const auto_id = getSelectedCar();
  
      if (!to_date || !from_date || !auto_id) {
        console.error('Missing data in localStorage. Please ensure all required data is set.');
        return;
      }
  
      // Foglalási adatok összeállítása
      const bookingData = {
        to_date,
        from_date,
        auto_id,
        parkolo_id: selectedSpot.parkolo_id,
      };
  
      try {
        // Adatok elküldése a szervernek
        const response = await fetch('http://localhost:8084/api/saveBookingDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'to_date': bookingData.to_date,
            'from_date': bookingData.from_date,
            'auto_id': bookingData.auto_id,
            'parkolo_id': bookingData.parkolo_id,
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Hiba történt: ${errorText}`);
        }
  
        const result = await response.text();
        console.log('Foglalás sikeres:', result);

        // Újra lekérdezzük a parkolóhelyeket
        loadParkingData();
      } catch (error) {
        console.error('Foglalás mentése sikertelen:', error.message);
      }
    } else {
      console.warn('No spot selected.');
    }
  
    setShowModal(false); // Modal bezárása
  };

  const handleMouseEnter = (spot) => {
    setHoveredSpot(spot);
  };

  const handleMouseLeave = () => {
    setHoveredSpot(null);
  };

  const getSpotsByLevel = () => {
    const levelIndex = levels.indexOf(currentLevel);
    return parkingData.slice(levelIndex * 30, (levelIndex + 1) * 30);
        // Kiíratjuk a parkolóhelyek parkolo_id-ját

  };

  const spots = getSpotsByLevel();

  return (
    <div className="grid-container">
      <div className="left-panel green">
      </div>
      <FloatingMenu />
      <div className="right-panel grey">
        <div className="plot-picker-container">
          <h1>Pick a parking spot</h1>

          <div className="level-buttons">
          <div className='car-data parking-spot'>
  <img src='\icons\nav\carPicker-filled-inverted.png' alt='car-icon'/>
  <div className={"tooltip car-data-tooltip"}>
    <div>
      <img src='\icons\car.png' alt='car-icon'/>
      {getCarName() === null ? 'Car Name: Not selected' : `Car Name: ${getCarName()}`}
    </div>
    <div>
      <img src='\icons\start.png' alt='car-icon'/>
      {getStartDate() === null ? 'Start Date: Not selected' : `Start Date: ${getStartDate()}`}
    </div>
    <div>
      <img src='\icons\end.png' alt='car-icon'/>
      {getEndDate() === null ? 'End Date: Not selected' : `End Date: ${getEndDate()}`}
    </div>
  </div>
</div>
            {levels.map((level) => (
              <button
                key={level}
                className={level === currentLevel ? 'active' : ''}
                onClick={() => handleLevelChange(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="parking-layout">
            <ParkingContainer
              spots={spots.slice(0, 10)}
              getSpotColor={getSpotColor}
              onSpotClick={handleSpotClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              hoveredSpot={hoveredSpot}
              positionClass="top"
            />

            <ParkingContainer
              spots={spots.slice(25, 30).reverse()}
              getSpotColor={getSpotColor}
              onSpotClick={handleSpotClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              hoveredSpot={hoveredSpot}
              positionClass="left"
            />

            <ParkingContainer
              spots={spots.slice(15, 25).reverse()}
              getSpotColor={getSpotColor}
              onSpotClick={handleSpotClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              hoveredSpot={hoveredSpot}
              positionClass="bottom"
            />

            <ParkingContainer
              spots={spots.slice(10, 15)}
              getSpotColor={getSpotColor}
              onSpotClick={handleSpotClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              hoveredSpot={hoveredSpot}
              positionClass="right"
            />

            <div className="parking-container-middle">
              <div className="lift-base">
                <div className="lift-top"></div>
                <div className="lift-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal onClose={handleModalClose} onConfirm={handleConfirmSelection} />
      )}
    </div>
  );
}

export default PlotPicker;
