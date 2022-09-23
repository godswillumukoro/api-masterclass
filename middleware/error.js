const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (error, req, res, next) => {

    console.log(error.stack.red)

    // Handle bad ObjectID
    if (error.name === 'CastError') {
        const message = `Bootcamp with ID:${error.value} was not found`
        error = new ErrorResponse(message, 404)
    }

    // Handle duplicate keys
    if (error.code === 11000) {
        const message = `Duplicate field value entered`
        error = new ErrorResponse(message, 400)
    }

    // Validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map(value => value.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler