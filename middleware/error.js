const errororHandler = (error, req, res, next) => {
    console.log(error.stack.red)

    res.status(error.statusCode || 500).json({
        success: false,
        erroror: error.message || 'Server Error'
    })
}

module.exports = errororHandler