const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')

const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})

const Bootcamp = require('./models/Bootcamp')
mongoose.connect(process.env.MONGODB_URI)

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`))

// import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data imported successfully'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

// Delete from DB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()

        console.log('Data destroyed successfully'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}