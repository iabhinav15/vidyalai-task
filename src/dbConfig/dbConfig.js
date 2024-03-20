import mongoose from 'mongoose';

export async function connect() {
    try {
        // actual db url given here is for testing purpose only
        mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://officialabhinavsingh15:rEXXlW5Sb7IXgyqC@cluster0.9d1p8w1.mongodb.net/Pdf-Extractor");
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }

}