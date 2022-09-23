const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()

        res.status(200).json({ success: true, total: bootcamps.length, data: bootcamps })
    } catch (error) {
        res.status(400).json({ success: false, data: error })

    }
}

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp with ID:${req.params.id} was not found`, 404)
            ) // making sure the bootcamp actually exists
        }
        res.status(200).json({ success: true, data: bootcamp })
    } catch (error) {
        next(new ErrorResponse(`Bootcamp with ID:${req.params.id} was not found`, 404))
    }

}

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
            success: true,
            data: bootcamp
        })

    } catch (error) {
        res.status(400).json({ success: false }) //If duplicate name was supplied
    }
}

// @desc    Update single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //updates the current with new data
            runValidators: true
        })

        if (!bootcamp) {
            return res.status(400).json({ success: false }) //making sure the bootcamp exists
        }

        res.status(200).json({ success: true, data: bootcamp })
    } catch (error) {
        return res.status(400).json({ success: false })

    }


}

// @desc    Delete single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if (!bootcamp) {
            return res.status(400).json({ success: false }) //making sure the bootcamp exists

        }

        res.status(200).json({ success: true, data: `${bootcamp.name} was successfully deleted` })
    } catch (error) {
        res.status(400).json({ success: false })
    }

}