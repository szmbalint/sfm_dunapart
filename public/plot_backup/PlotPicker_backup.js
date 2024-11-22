import React, { useState, useEffect } from 'react';
import './PlotPicker.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../utils/Modal';  // Importáld a Modal komponenst

const levels = ['-1st floor', '-2nd floor', '-3rd floor'];

function PlotPicker() {
  const [currentLevel, setCurrentLevel] = useState('-1st floor');
  const [carSize, setCarSize] = useState('');
  const [parkingData, setParkingData] = useState({});
  const [selectedSpot, setSelectedSpot] = useState(null); // A kiválasztott parkolóhely
  const [showModal, setShowModal] = useState(false); // Modal állapot
  const [hoveredSpot, setHoveredSpot] = useState(null);  // New state for hovered spot info
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
    fetch('/data/parking.json')
      .then((res) => res.json())
      .then((data) => {
        setParkingData(data);
      })
      .catch((err) => console.error('Error loading parking data:', err));
  }, []);
  

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const getSpotColor = (spot) => {
    
    // Foglalt parkoló
    if (spot.status === 'occupied') {
      return { color: 'red', image: '/icons/occupied.png' };
    }
  
    // Hamarosan szabad parkoló
    if (spot.status === 'soon_free') {
      return { color: 'yellow', image: '/icons/soon_free.png' };
    }

    // A parkoló hely már el lett foglalva
    if (spot.status === 'claimed') {

      return { color: 'green', image: '/icons/claimed.png' }; // Zöld szín és egy új ikon
    }
    
    // Szabad parkoló, de túl kicsi a méret (small kocsi nem fér el medium vagy large parkolóhelyeken, large kocsi nem fér el medium vagy small parkolóhelyeken)
    if (spot.status === 'free' && (spot.size === 'small' || spot.size === 'medium')) {
      if (
        (carSize === 'medium' && spot.size === 'small') || // Medium autó nem fér el small parkolóhelyen
        (carSize === 'large' && (spot.size === 'small' || spot.size === 'medium')) // Large autó nem fér el small vagy medium parkolóhelyeken
      ) {
        return { color: 'red', image: '/icons/small.png' }; // Túl kicsi a parkoló, piros
      }
    }
  
    // Szabad parkoló, és a méret megfelelő
    if (spot.status === 'free' && 
        ((carSize === 'small' && (spot.size === 'small' || spot.size === 'medium' || spot.size === 'large')) || 
        (carSize === 'medium' && (spot.size === 'medium' || spot.size === 'large')) ||
        (carSize === 'large' && spot.size === 'large'))) {
      return { color: 'gray', image: '/icons/free.png' }; // Szabad parkoló és megfelelő méretű, szürke
    }
  
    return { color: 'gray', image: '/icons/default.png' }; // Alapértelmezett eset
  };

  const handleSpotClick = (spot) => {
    const { color } = getSpotColor(spot); // A spot színét és státuszát lekérjük
    
    // Ha a parkolóhely szabad és a méret megfelelő
    if (color !== 'red') { // 'red' a túl kicsi parkolóhelyeket jelöli
      if (spot.status === 'free') {
        setSelectedSpot(spot);
        setShowModal(true); // Modal megjelenítése
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Modal bezárása
    setSelectedSpot(null);
  };

  const handleConfirmSelection = () => {
    if (selectedSpot) {
      // Küldjük a spot ID-t a back-endnek
      /*
      fetch('/api/select-spot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotId: selectedSpot.id }),
      })
      .then((res) => res.json())
      .then((data) => {

        setShowModal(false); // Modal bezárása
      })
      .catch((err) => console.error('Error selecting spot:', err));
      */
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

  const spots = parkingData[currentLevel] || [];
  
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
            <div className="parking-container-top">
              {spots.slice(0, 10).map((spot) => {
                const { color, image } = getSpotColor(spot);
                return (
                  <div
                    key={spot.id}
                    className={`parking-spot ${color}`}
                    onClick={() => handleSpotClick(spot)} 
                    onMouseEnter={() => handleMouseEnter(spot)} 
                    onMouseLeave={handleMouseLeave} 
                  >
                    {image && <img src={image} alt="spot-status" className="spot-image" />}
                    {spot.id}
                    {hoveredSpot === spot && spot.timeUntilFree !== 0 && (
                      <div className="tooltip">
                        {`Free in ${spot.timeUntilFree} minutes`}
                      </div>
                    )}
                  </div>
                  
                );
              })}
            </div>
  
            <div className="parking-container-left">
              {spots.slice(25, 30).reverse().map((spot) => {
                const { color, image } = getSpotColor(spot);
                return (
                  <div
                    key={spot.id}
                    className={`parking-spot ${color}`}
                    onClick={() => handleSpotClick(spot)} 
                    onMouseEnter={() => handleMouseEnter(spot)} 
                    onMouseLeave={handleMouseLeave} 
                  >
                    {image && <img src={image} alt="spot-status" className="spot-image" />}
                    <span>{spot.id}</span>
                    {hoveredSpot === spot && spot.timeUntilFree !== 0 && (
                      <div className="tooltip left">
                        {`Free in ${spot.timeUntilFree} minutes`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
  
            <div className="parking-container-bottom">
              {spots.slice(15, 25).reverse().map((spot) => {
                const { color, image } = getSpotColor(spot);
                return (
                  <div
                    key={spot.id}
                    className={`parking-spot ${color}`}
                    onClick={() => handleSpotClick(spot)} 
                    onMouseEnter={() => handleMouseEnter(spot)}
                    onMouseLeave={handleMouseLeave} 
                  >
                    {image && <img src={image} alt="spot-status" className="spot-image" />}
                    {spot.id}
                    {hoveredSpot === spot && spot.timeUntilFree !== 0 && (
                      <div className="tooltip">
                        {`Free in ${spot.timeUntilFree} minutes`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
  
            <div className="parking-container-right">
              {spots.slice(10, 15).map((spot) => {
                const { color, image } = getSpotColor(spot);
                return (
                  <div
                    key={spot.id}
                    className={`parking-spot ${color}`}
                    onClick={() => handleSpotClick(spot)} 
                    onMouseEnter={() => handleMouseEnter(spot)} 
                    onMouseLeave={handleMouseLeave} 
                  >
                    {image && <img src={image} alt="spot-status" className="spot-image" />}
                    <span>{spot.id}</span>
                    {hoveredSpot === spot && spot.timeUntilFree !== 0 && (
                      <div className="tooltip right">
                        {`Free in ${spot.timeUntilFree} minutes`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
  
            <div className="parking-container-middle">
              <div className="lift-base">
                <div className="lift-top"></div>
                <div className="lift-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* Modal szövegdoboz */}
            {showModal && (
        <Modal onClose={handleModalClose} onConfirm={handleConfirmSelection} />
      )}
    </div>
  );
};

export default PlotPicker;
