import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const dbConnect = new Promise((resolve, reject) => {
    try {
        const connection = mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        resolve(connection);
    } catch (error) {
        reject(error);
    }
})

export default dbConnect