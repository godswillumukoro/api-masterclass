const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config({ path: './config/config.env' })
const bootcamps = require('./routes/bootcamps')
const connectDB = require('./config/db')

connectDB()
const app = express()
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port:${PORT}`))