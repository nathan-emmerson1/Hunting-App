import React, { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import Nav from './Nav'
import './index.css'
import HuntingSpotsCards from './HuntingSpotsCard'
import Windy from './Windy'
import { huntingSpots } from './huntingSpotslist'

mapboxgl.accessToken =
  'pk.eyJ1IjoibmF0aGFuOTgiLCJhIjoiY2x6dXA4cmlwMnJ1dzJscTdhemFoNHFiNyJ9.mck9Zy7uZRZG5ISX-kDf-w'

export default function App() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markerRef = useRef(null)
  const [lng, setLng] = useState(178.00417)
  const [lat, setLat] = useState(-38.65333)
  const [zoom, setZoom] = useState(11)
  const [showWindyMap, setShowWindyMap] = useState(false)
  const [searchCoordinates, setSearchCoordinates] = useState([lng, lat])

  const [location, setLocation] = useState({
    name: 'Gisborne',
    id: 'Gisborne_z901',
    coords: '-38.6533300,178.0041700',
  })

  const moveToLocation = useCallback(
    async (newLng, newLat, locationName, locationId, coords) => {
      if (map.current) {
        map.current.flyTo({
          center: [newLng, newLat],
          essential: true,
          duration: 4000,
        })
        setLng(newLng)
        setLat(newLat)
        setLocation({ name: locationName, id: locationId, coords: coords })
        setSearchCoordinates([newLng, newLat])

        if (markerRef.current) {
          markerRef.current.remove()
        }

        markerRef.current = new mapboxgl.Marker()
          .setLngLat([newLng, newLat])
          .addTo(map.current)

        try {
          const response = await fetch(
            'http://localhost:3001/api/save-location',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ locationName, locationId, coords }),
            }
          )

          if (!response.ok) {
            throw new Error('Failed to save location')
          }
          const result = await response.json()
          console.log(result.message)
        } catch (error) {
          console.error('Error:', error)
        }
      }
    },
    []
  )

  const handleSpotSelect = (spot) => {
    moveToLocation(spot.longitude, spot.latitude, spot.name, '', '')
  }

  const toggleMapView = () => {
    setShowWindyMap((prev) => !prev)
    if (map.current) {
      map.current.remove()
      map.current = null
    }
  }

  const setMapStyleToStreetView = () => {
    console.log('Street View button clicked')
    setShowWindyMap(false)
    if (mapContainer.current) {
      if (map.current) {
        map.current.setStyle('mapbox://styles/mapbox/streets-v12')
      } else {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom,
        })
      }
    }
  }

  useEffect(() => {
    if (!showWindyMap) {
      if (!map.current && mapContainer.current) {
        console.log('Initializing Mapbox map')
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom,
        })

        map.current.on('move', () => {
          setLng(map.current.getCenter().lng.toFixed(4))
          setLat(map.current.getCenter().lat.toFixed(4))
          setZoom(map.current.getZoom().toFixed(2))
        })

        map.current.on('dblclick', (event) => {
          const { lngLat } = event
          const [lng, lat] = [lngLat.lng, lngLat.lat]

          if (markerRef.current) {
            markerRef.current.remove()
          }

          markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current)
        })

        map.current.on('click', () => {
          if (markerRef.current) {
            markerRef.current.remove()
            markerRef.current = null
          }
        })
      } else if (map.current) {
        map.current.resize()
      }
    }
  }, [lng, lat, zoom, showWindyMap])

  return (
    <div>
      <Nav
        moveToLocation={moveToLocation}
        toggleWindyMap={toggleMapView}
        toggleMapboxMap={setMapStyleToStreetView}
      />
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
          <div ref={mapContainer} className="map-container" />
        </>
      )}
    </div>
  )
}
