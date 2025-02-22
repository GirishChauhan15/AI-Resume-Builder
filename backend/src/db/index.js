import mongoose from 'mongoose'
import { dbName } from '../constant.js'

export const dbConnect = async() =>{
    try {
        const res = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        // console.log("Mongo db connected :: host - ",res.connection.host)
    } catch (error) {
        // console.log("MongoDb connection error - ",error)
        process.exit(1)
    }
}