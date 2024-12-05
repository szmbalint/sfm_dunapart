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
            {hoveredSpot === spot && spot.timeUntilFree !== 0 && (
              <div className={`tooltip ${positionClass}`}>
                {`Free in ${spot.timeUntilFree} minutes`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParkingContainer;
