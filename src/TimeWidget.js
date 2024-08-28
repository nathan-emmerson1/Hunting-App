// TimeSunriseSunsetWidget.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MY_API_KEY = '98d4af4361c75cb1681c74f25944de42'

const TimeSunriseSunsetWidget = ({ lat, lng }) => {
  const [time, setTime] = useState('')
  const [sunrise, setSunrise] = useState('')
  const [sunset, setSunset] = useState('')

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${MY_API_KEY}`
        )
        const data = response.data
        const timezoneOffset = data.timezone // In seconds
        const localTime = new Date(
          Date.now() + timezoneOffset * 1000
        ).toLocaleTimeString()

        setTime(localTime)
        setSunrise(new Date(data.sys.sunrise * 1000).toLocaleTimeString())
        setSunset(new Date(data.sys.sunset * 1000).toLocaleTimeString())
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    fetchWeatherData()

    const interval = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [lat, lng])

  return (
    <div className="time-widget">
      <h2>Current Time: {time}</h2>
      <p>Sunrise: {sunrise}</p>
      <p>Sunset: {sunset}</p>
    </div>
  )
}

export default TimeSunriseSunsetWidget
