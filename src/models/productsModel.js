import mongoose from "mongoose";
const { Schema, model} = mongoose;


const productSchema = new Schema({
    name:{
        type: String,
        require: true,
    },
    category:{
        type:String,
        require: true,
    },
    description:{
        type:String,
    },
    images:{
        type:Array,
    },
    size:{
        type:Array,
    },
    price:{
        type: Number,
    },
    createdAt:{
        type:Date,
        default: new Date(),
    },
    deletedAt:{
        type:Date,
    }
});

const Product = model('product', productSchema);

export default Product;