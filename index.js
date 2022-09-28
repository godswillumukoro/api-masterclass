const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/error') // importing custom error handler middleware

dotenv.config({ path: './config/config.env' })
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const connectDB = require('./config/db')

connectDB()
const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use(errorHandler) // using custom error handler middleware

const PORT = process.env.PORT
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port:${PORT}`.yellow.bold))

// Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})