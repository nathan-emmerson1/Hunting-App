// App.js
import React, { useCallback, useState, useEffect } from 'react'
import Nav from './Nav'
import HuntingSpotsCards from './HuntingSpotsCard'
import Windy from './Windy'
import Mapbox from './MapBox'
import './index.css'
import TimeSunriseSunsetWidget from './TimeWidget'

const App = () => {
  const [lng, setLng] = useState(178.00417)
  const [lat, setLat] = useState(-38.65333)
  const [zoom, setZoom] = useState(11)
  const [showWindyMap, setShowWindyMap] = useState(false)
  const [searchCoordinates, setSearchCoordinates] = useState([lng, lat])
  const [huntingSpots, setHuntingSpots] = useState([])
  const [marker, setMarker] = useState([lng, lat]) // Default marker

  const fetchHuntingSpots = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/hunting-spots')
      if (!response.ok) {
        throw new Error('Failed to fetch hunting spots')
      }
      const data = await response.json()
      setHuntingSpots(data)
    } catch (error) {
      console.error('Error fetching hunting spots:', error)
    }
  }, [])

  useEffect(() => {
    fetchHuntingSpots()
  }, [fetchHuntingSpots])

  const moveToLocation = useCallback(
    async (newLng, newLat, locationName, locationId, coords) => {
      setLng(newLng)
      setLat(newLat)
      setZoom(11) // Reset zoom if needed
      setSearchCoordinates([newLng, newLat])
      setMarker([newLng, newLat]) // Update marker position

      try {
        const response = await fetch(
          'http://localhost:3001/api/save-location',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locationName, locationId, coords }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to save location')
        }
        await fetchHuntingSpots()
      } catch (error) {
        console.error('Error:', error)
      }
    },
    [fetchHuntingSpots]
  )

  const handleSpotSelect = (spot) => {
    moveToLocation(spot.longitude, spot.latitude, spot.name, '', '')
  }

  const toggleMapView = () => {
    setShowWindyMap((prev) => !prev)
  }

  return (
    <div className="main-container">
      <Nav
        moveToLocation={moveToLocation}
        toggleWindyMap={toggleMapView}
        toggleMapboxMap={toggleMapView}
      />

      <div className="content-container">
        {showWindyMap ? (
          <Windy coordinates={searchCoordinates} />
        ) : (
          <>
            <HuntingSpotsCards
              huntingSpots={huntingSpots}
              onSpotSelect={handleSpotSelect}
            />
            <div className="sidebar">
              Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <Mapbox
              lng={lng}
              lat={lat}
              zoom={zoom}
              onLocationChange={(lng, lat, zoom) => {
                setLng(lng)
                setLat(lat)
                setZoom(zoom)
              }}
              marker={marker} // Pass marker position
            />
            <div>
              <TimeSunriseSunsetWidget lat={lat} lng={lng} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
