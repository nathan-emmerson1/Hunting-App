import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import './index.css'
import logo from './images/Logo.png'

const Nav = ({
  moveToLocation,
  toggleWindyMap,
  toggleMapboxMap,
  toggleMapTiler,
}) => {
  const geocoderContainer = useRef(null)

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })

    if (geocoderContainer.current) {
      geocoderContainer.current.appendChild(geocoder.onAdd())
    }

    geocoder.on('result', (event) => {
      const { geometry, place_name } = event.result
      const [newLng, newLat] = geometry.coordinates

      moveToLocation(
        newLng,
        newLat,
        place_name,
        `${place_name.replace(/\s+/g, '_')}_z901`,
        `${newLat},${newLng}`
      )
    })

    return () => {
      if (geocoderContainer.current) {
        geocoderContainer.current.innerHTML = ''
      }
    }
  }, [moveToLocation])

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="weka maps logo"></img>
      </div>
      <div className="navbar-search" ref={geocoderContainer} />
      <div className="navbar-buttons">
        <button className="btn-windy" onClick={toggleWindyMap}>
          Windy
        </button>
        <button className="btn-satelite" onClick={toggleMapboxMap}>
          Satelite
        </button>
        <button className="btn-maptiler" onClick={toggleMapTiler}>
          Map Tiler
        </button>
      </div>
    </nav>
  )
}

export default Nav
