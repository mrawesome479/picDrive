const mongoose = require("mongoose")

const connectToDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database Connected to ${conn.connection.host}`)
    } catch (error) {
        console.error(`error ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectToDB