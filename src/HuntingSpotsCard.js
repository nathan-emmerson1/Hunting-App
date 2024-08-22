import React from 'react'
import './index.css' // Import CSS for styling

const HuntingSpotsCards = ({ onSpotSelect }) => {
  const huntingSpots = [
    {
      name: 'Gisbonre',
      description: 'Description for spot 1',
      latitude: -38.65333,
      longitude: 178.00417,
      image: '/images/cardcover.png',
    },
    {
      name: 'Napier',
      description: 'Description for spot 2',
      latitude: -38.65333,
      longitude: 178.10417,
      image: '../images/cardcover.png',
    },
    {
      name: 'HawkesBay',
      description: 'Description for spot 3',
      latitude: -38.75333,
      longitude: 178.00417,
      image: '../images/cardcover.png',
    },
    {
      name: 'Thames',
      description: 'Description for spot 3',
      latitude: -38.75333,
      longitude: 178.00417,
      image: '../images/cardcover.png',
    },
    {
      name: 'Whangamata',
      description: 'Description for spot 3',
      latitude: -38.75333,
      longitude: 178.00417,
      image: '/images/cardcover.png',
    },
  ]

  return (
    <div className="spots-container">
      {huntingSpots.map((spot, index) => (
        <div
          key={index}
          className="spot-card"
          onClick={() => onSpotSelect(spot)}
        >
          <img src={spot.image} alt={spot.name} className="spot-image" />
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
