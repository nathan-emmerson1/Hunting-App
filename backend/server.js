const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors') // Import cors
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3001 // Backend server port

app.use(cors()) // Enable CORS for all origins
app.use(bodyParser.json()) // For parsing application/json

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

// POST endpoint to save location data
app.post('/api/save-location', (req, res) => {
  const { locationName, locationId, coords } = req.body

  // Create or append to the data.json file
  const filePath = path.join(__dirname, 'data.json')
  const newData = { locationName, locationId, coords }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read data file' })
    }

    const fileData = data ? JSON.parse(data) : []
    fileData.push(newData)

    fs.writeFile(filePath, JSON.stringify(fileData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to write data file' })
      }

      res.status(200).json({ message: 'Location saved successfully' })
    })
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
