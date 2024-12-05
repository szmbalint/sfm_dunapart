import React, { useState, useEffect } from 'react';
import './PlotPicker.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../utils/Modal';
import ParkingContainer from './ParkingContainer';
import { fetchParkingPlots } from '../../api/dataController';

const levels = ['1st floor', '2nd floor', '3rd floor'];

function PlotPicker() {
  const [currentLevel, setCurrentLevel] = useState('1st floor');
  const [carSize, setCarSize] = useState('');
  const [parkingData, setParkingData] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const navigate = useNavigate();

  // Autó méretének betöltése
  useEffect(() => {
    fetch('/data/car.json')
      .then((res) => res.json())
      .then((data) => setCarSize(data.carSize))
      .catch((err) => console.error('Error loading car size:', err));
  }, []);

  // Parkolóhelyek betöltése
  useEffect(() => {
    const loadParkingData = async () => {
      try {
        const data = await fetchParkingPlots();
        setParkingData(data);
      } catch (error) {
        console.error('Error loading parking data:', error);
      }
    };

    loadParkingData();
  }, []);

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const calculateSoonFree = (spot) => {
    const startDate = new Date(spot.start_date);
    const endDate = new Date(spot.end_date);
    const timeDifference = (endDate - startDate) / (1000 * 60 * 60 * 24); // Különbség napokban
    return timeDifference < 30;
  };

  const getSpotColor = (spot) => {
    if (spot.status) {
      return { color: 'red', image: '/icons/occupied.png' }; // Foglalt parkoló
    }

    if (!spot.status && calculateSoonFree(spot)) {
      return { color: 'yellow', image: '/icons/soon_free.png' }; // Hamarosan szabad parkoló
    }

    return { color: 'gray', image: '/icons/free.png' }; // Szabad parkoló
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

  const handleConfirmSelection = () => {
    if (selectedSpot) {
      console.log('Spot selected:', selectedSpot);
    }
    setShowModal(false);
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
      <div className="left-panel-green">
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
      <div className="right-panel">
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
