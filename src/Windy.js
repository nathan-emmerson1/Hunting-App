import React, { useEffect, useRef } from 'react'
import './index.css'

const WindyMap = ({ coordinates }) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    const changeWindyIframeCoordinates = (newLat, newLon) => {
      const iframe = iframeRef.current
      if (iframe) {
        // Generate new iframe src with updated coordinates
        const src = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${newLat}&lon=${newLon}&detailLat=${newLat}&detailLon=${newLon}&marker=true&message=true`
        iframe.src = src
      }
    }

    if (coordinates && coordinates.length === 2) {
      changeWindyIframeCoordinates(coordinates[1], coordinates[0])
    }
  }, [coordinates])

  return (
    <div className="windy-container">
      <iframe
        id="windyFrame"
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=${coordinates[1]}&lon=${coordinates[0]}&detailLat=${coordinates[1]}&detailLon=${coordinates[0]}&marker=true&message=true`}
        title="Windy Map"
      ></iframe>
    </div>
  )
}

export default WindyMap
