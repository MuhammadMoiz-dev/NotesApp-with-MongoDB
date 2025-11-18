import mongoose from "mongoose";



async function connnectDB() {
    try {

        await mongoose.connect(process.env.DB_URL)
        console.log('Connect DB');

    } catch (error) {
        console.log(error);

    }
}

export default connnectDB;