import React from 'react'
import ReactDOM from 'react-dom/client' // Import from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import './index.css'
import App from './App'
import { LocationProvider } from './LocationContext'

// import Windy from './Windy'

// Create a root container
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render the application
root.render(
  <React.StrictMode>
    <LocationProvider>
      <App />
    </LocationProvider>
  </React.StrictMode>
)
