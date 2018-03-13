const path = require('path')
const express = require('express')

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static(publicPath))

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
