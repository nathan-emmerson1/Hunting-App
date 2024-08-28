// MapBox.js
import React, { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

// Make sure to replace with your actual access token
mapboxgl.accessToken =
  'pk.eyJ1IjoibmF0aGFuOTgiLCJhIjoiY2x6dXA4cmlwMnJ1dzJscTdhemFoNHFiNyJ9.mck9Zy7uZRZG5ISX-kDf-w'

const Mapbox = ({ lng, lat, zoom, onLocationChange, marker }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markerRef = useRef(null)
  const [currentState, setCurrentState] = useState({
    lng: Number(lng).toFixed(4),
    lat: Number(lat).toFixed(4),
    zoom: Number(zoom).toFixed(2),
  })

  // Memoize callback functions to prevent unnecessary re-creations
  const handleLocationChange = useCallback(
    (lng, lat, zoom) => {
      if (onLocationChange) {
        onLocationChange(lng, lat, zoom)
      }
    },
    [onLocationChange]
  )

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      console.log('Creating new Mapbox instance')
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom,
      })

      map.current.on('move', () => {
        const { lng, lat } = map.current.getCenter()
        const zoom = map.current.getZoom().toFixed(2)
        const formattedLng = Number(lng).toFixed(4)
        const formattedLat = Number(lat).toFixed(4)
        console.log('Map moved:', {
          lng: formattedLng,
          lat: formattedLat,
          zoom,
        })

        // Update state only if there is a change in the map state
        if (
          currentState.lng !== formattedLng ||
          currentState.lat !== formattedLat ||
          currentState.zoom !== zoom
        ) {
          setCurrentState({ lng: formattedLng, lat: formattedLat, zoom })
          handleLocationChange(formattedLng, formattedLat, zoom)
        }
      })
    } else if (map.current) {
      // Check if map state has changed before calling flyTo
      const formattedLng = Number(lng).toFixed(4)
      const formattedLat = Number(lat).toFixed(4)
      const formattedZoom = Number(zoom).toFixed(2)

      if (
        currentState.lng !== formattedLng ||
        currentState.lat !== formattedLat ||
        currentState.zoom !== formattedZoom
      ) {
        console.log('Updating map state')
        map.current.flyTo({
          center: [lng, lat],
          zoom: zoom,
          essential: true,
          duration: 5000,
        })
        setCurrentState({
          lng: formattedLng,
          lat: formattedLat,
          zoom: formattedZoom,
        })
      }
    }

    // Update marker if provided
    if (map.current && marker) {
      if (markerRef.current) {
        markerRef.current.remove()
      }

      markerRef.current = new mapboxgl.Marker()
        .setLngLat(marker)
        .addTo(map.current)
    }

    // No cleanup is performed here; the map instance remains in place
  }, [lng, lat, zoom, currentState, handleLocationChange, marker])

  return <div ref={mapContainer} className="map-container" />
}

export default Mapbox
