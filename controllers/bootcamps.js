const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query
    const requestQuery = { ...req.query }

    // format query string to create operators ($gt, $lt etc)
    queryString = JSON.stringify(requestQuery)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = Bootcamp.find(JSON.parse(queryString)).populate('courses')

    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']
    removeFields.forEach(field => delete requestQuery[field])

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // Sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        // default sort : descending createdAt
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 8
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // executing query
    const bootcamps = await query

    // pagination result
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({ success: true, total: bootcamps.length, pagination, data: bootcamps })

})

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp with ID:${req.params.id} was not found`, 404)
        ) // If it does not exist in the database
    }
    res.status(200).json({ success: true, data: bootcamp })
})

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

// @desc    Update single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //updates the current with new data
        runValidators: true
    })

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp with ID:${req.params.id} was not found`, 404)
        ) // If it does not exist in the database
    }

    res.status(200).json({ success: true, data: bootcamp })
})

// @desc    Delete single Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp with ID:${req.params.id} was not found`, 404)
        ) // If it does not exist in the database
    }

    bootcamp.remove()

    res.status(200).json({ success: true, data: `${bootcamp.name} was successfully deleted` })
})

// @desc    Get bootcamps within a set radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get lat/lng from geocoder
    const location = await geocoder.geocode(zipcode)
    const latitude = location[0].latitude
    const longitude = location[0].longitude

    const radius = distance / 3963
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[longitude, latitude], radius] }
        }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})