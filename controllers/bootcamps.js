const { findByIdAndUpdate } = require('../models/Bootcamp')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()

        res.status(200).json({ success: "true", message: bootcamps })
    } catch (error) {
        res.status(400).json({ success: "false", message: error })

    }
}

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return res.status(400).json({ success: "false" })
        }
        res.status(200).json({ success: "true", message: bootcamp })
    } catch (error) {
        res.status(400).json({ success: "false", message: error })

    }

}

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
    })
}

// @desc    Update single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //updates the current with new data
        runValidators: true
    })

    if (!bootcamp) {
        return res.status(400).json({ success: "false" })
    }

    res.status(200).json({ success: true, data: bootcamp })
}

// @desc    Delete single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: "true", message: 'Delete Bootcamp' })

}