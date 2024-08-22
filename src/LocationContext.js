// LocationContext.js
import React, { createContext, useState, useContext } from 'react'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [locationData, setLocationData] = useState({
    name: '',
    id: '',
    coords: '',
    placeInfo: {}, // Add this field to store additional place information
  })

  const updateLocation = (newLocation) => {
    setLocationData(newLocation)
  }

  return (
    <LocationContext.Provider value={{ locationData, updateLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}
