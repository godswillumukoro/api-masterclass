const errororHandler = (error, req, res, next) => {
    console.log(error.stack.red)

    res.status(500).json({
        success: false,
        erroror: error.message
    })
}

module.exports = errororHandler