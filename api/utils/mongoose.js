import mongoose from "mongoose";
import 'dotenv/config'


const mongoUrl = process.env.MONGO_URL;

export async function connectToDB(){
    
    try {
        mongoose.connect( mongoUrl, )
            .then(response => console.log("DB Connection Ok!"))
    } catch (error) {
        console.error(error)
    }
}