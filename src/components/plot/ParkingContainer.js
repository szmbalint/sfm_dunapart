import React from 'react';

const ParkingContainer = ({ spots, getSpotColor, onSpotClick, onMouseEnter, onMouseLeave, positionClass, hoveredSpot }) => {
  return (
    <div className={`parking-container-${positionClass}`}>
      {spots.map((spot) => {
        const { color, image } = getSpotColor(spot);
        return (
          <div
            key={spot.parkolo_id}
            className={`parking-spot ${color}`}
            onClick={() => onSpotClick(spot)}
            onMouseEnter={() => onMouseEnter(spot)}
            onMouseLeave={onMouseLeave}
          >
            {image && <img src={image} alt="spot-status" className="spot-image" />}
            <span>{spot.parkolo_id}</span>
            {/* Tooltip csak akkor jelenjen meg, ha hoveredSpot === spot és a timeUntilFree értéke nem null */}
            {hoveredSpot === spot && spot.timeUntilFree && spot.timeUntilFree !== null && (
              <div className={`tooltip ${positionClass}`}>
                {/* Ellenőrizzük, hogy a formatted kulcs elérhető-e */}
                {spot.timeUntilFree.formatted 
                  ? spot.timeUntilFree.formatted 
                  : `Occupied in ${spot.timeUntilFree.minutes} minutes`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParkingContainer;
