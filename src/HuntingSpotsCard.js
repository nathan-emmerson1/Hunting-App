import React from 'react'
import './index.css' // Import CSS for styling
import hungtingSpotImg from './images/cardcover.png'

const HuntingSpotsCards = ({ huntingSpots, onSpotSelect }) => {
  return (
    <div className="spots-container">
      {huntingSpots.map((spot, index) => (
        <div
          key={index}
          className="spot-card"
          onClick={() => onSpotSelect(spot)}
        >
          <img src={hungtingSpotImg} alt={spot.name} className="spot-image" />
          <div className="spot-details">
            <h4 className="spot-name">{spot.name}</h4>
            <p className="spot-coords">
              Lat: {spot.latitude.toFixed(4)}, Lon: {spot.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HuntingSpotsCards
