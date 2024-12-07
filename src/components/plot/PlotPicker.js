import React, { useState, useEffect } from 'react';
import './PlotPicker.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../utils/Modal';
import ParkingContainer from './ParkingContainer';
import { fetchParkingPlots } from '../../api/dataController';
import { getStartDate, getEndDate, getSelectedCar, getCarSize } from '../auth/tokenManager';
const levels = ['1st floor', '2nd floor', '3rd floor'];

function PlotPicker() {
  const [currentLevel, setCurrentLevel] = useState('1st floor');
  const [parkingData, setParkingData] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const [theme] = useState(localStorage.getItem('theme')); // Alapértelmezett téma
  const navigate = useNavigate();

  useEffect(() => {
    const htmlElement = document.documentElement; // A html tag referencia
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
}, [theme]);

// Parkolóhelyek betöltése és timeUntilFree kiszámítása
useEffect(() => {
  const loadParkingData = async () => {
    try {
      const data = await fetchParkingPlots();

      // timeUntilFree kiszámítása és hozzácsatolása minden spot-hoz
      const updatedData = data.map((spot) => {
        if (spot.from_date && spot.to_date) {
          const fromDate = new Date(spot.from_date);
          const toDate = new Date(spot.to_date);
          const currentDate = new Date(); // Jelenlegi idő

          // Ha a parkolóhely foglalása még nem kezdődött el
          if (fromDate > currentDate) {
            const timeDifferenceMinutes = Math.floor((fromDate - currentDate) / (1000 * 60)); // Különbség percekben
            return {
              ...spot,
              timeUntilFree: timeDifferenceMinutes > 0 ? timeDifferenceMinutes : null, // Ha negatív, null-t állítunk be
            };
          } 
          
          // Ha már lejárt a parkolási idő
          if (toDate < currentDate) {
            return {
              ...spot,
              timeUntilFree: 0, // A parkolóhely már szabad
            };
          }

          // Ha a parkolóhely foglalása aktuálisan zajlik, de még nem lejárt
          const timeDifferenceMinutes = Math.floor((toDate - currentDate) / (1000 * 60)); // Különbség percekben
          return {
            ...spot,
            timeUntilFree: timeDifferenceMinutes > 0 ? timeDifferenceMinutes : 0, // Ha negatív, 0-t állítunk be
          };
        }
        return { ...spot, timeUntilFree: 0 }; // Ha nincs dátum, null
      });

      setParkingData(updatedData);
    } catch (error) {
      console.error('Error loading parking data:', error);
    }
  };

  loadParkingData();
}, []);


  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const getSpotColor = (spot) => {
    const carSize = getCarSize(); // A kocsi méretének lekérése a localStorage-ból
    // Foglalt parkoló
    
    if (spot.status && spot.timeUntilFree > 30 ) {
      return { color: 'red', image: '/icons/occupied.png' };
    }
  
    // Hamarosan szabad parkoló
    if (spot.timeUntilFree <= 30 && spot.status) {
      return { color: 'yellow', image: '/icons/soon_free.png' };
    }

    
    
    // Szabad parkoló, de túl kicsi a méret (small kocsi nem fér el medium vagy large parkolóhelyeken, large kocsi nem fér el medium vagy small parkolóhelyeken)
    if (!spot.status && (spot.meret === 1 || spot.meret === 2)) {
      if (
        (carSize === 2 && spot.meret === 1) || // Medium autó nem fér el small parkolóhelyen
        (carSize === 3 && (spot.meret === 1 || spot.meret === 2)) // Large autó nem fér el small vagy medium parkolóhelyeken
      ) {
        return { color: 'red', image: '/icons/small.png' }; // Túl kicsi a parkoló, piros
      }
    }
  
    // Szabad parkoló, és a méret megfelelő
    if (!spot.status && 
        ((carSize === 1 && (spot.meret === 1 || spot.meret === 2 || spot.meret === 3)) || 
        (carSize === 2 && (spot.meret === 2 || spot.meret === 3)) ||
        (carSize === 3 && spot.meret === 3))) {
      return { color: 'gray', image: '/icons/free.png' }; // Szabad parkoló és megfelelő méretű, szürke
    }
  
    return { color: 'gray', image: '/icons/default.png' }; // Alapértelmezett eset
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
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
      <div className="right-panel grey">
        <div className="plot-picker-container">
          <h1>Pick a parking spot</h1>

          <div className="level-buttons">
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
