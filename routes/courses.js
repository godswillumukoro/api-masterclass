const express = require('express')
const { getCourses } = require('../controllers/courses')
const router = express.Router({ mergeParams: true }) //merging url parameters

router.route('/').get(getCourses)

module.exports = router