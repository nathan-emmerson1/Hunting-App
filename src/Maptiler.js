import React, { useEffect } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import { MaplibreLegendControl } from '@watergis/maplibre-gl-legend'
import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css'

const MapTilerComponent = () => {
  useEffect(() => {
    maptilersdk.config.apiKey = 'aRttS83mbQ8qdXahgTPf'

    const map = new maptilersdk.Map({
      container: 'map-tiler', // ID of the div where the map will be rendered
      style: '8eeb818c-c20a-45e2-9e8c-ea10590ce10a', // Your map style
      center: [178.015, -38.656], // Starting position [lng, lat]
      zoom: 10, // Starting zoom level
      terrain: true,
      terrainControl: true,
      pitch: 70,
      bearing: -100.86,
      maxPitch: 85,
      maxZoom: 25,
    })

    map.on('load', () => {
      const targets = {
        Contour: 'Contours',
        Satellite: 'satellite',
        'Doc recreational hunting permit areas': 'Public-hunting-spots',
        'tms-layer': 'Gisborne-aerial',
      }
      const options = {
        showDefault: true,
        showCheckbox: true,
        onlyRendered: false,
        reverseOrder: true,
        title: 'layers',
      }

      // Initialize the MapTiler Geocoding Control
      const geocodingControl =
        new maptilersdk.MaptilerGeocoder.GeocodingControl({})
      const searchContainer = document.getElementById('map-search')
      searchContainer?.appendChild(geocodingControl.onAdd(map))

      // Add Legend Control
      map.addControl(new MaplibreLegendControl(targets, options), 'bottom-left')

      // Add TMS Layer
      map.addSource('tms-source', {
        type: 'raster',
        tiles: [
          'https://tiles-cdn.koordinates.com/services;key=74deadc977294b07a253636d74f9c9de/tiles/v4/layer=118823/EPSG:3857/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
      })

      map.addLayer({
        id: 'tms-layer',
        type: 'raster',
        source: 'tms-source',
        paint: {},
        layout: {
          visibility: 'none',
        },
      })
    })
  }, [])

  return (
    <div>
      <div id="map-search"></div>
      <div id="map-tiler" style={{ width: '100%', height: '500px' }}></div>
    </div>
  )
}

export default MapTilerComponent
