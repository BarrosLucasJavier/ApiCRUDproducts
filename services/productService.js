import Product from '../models/productsModel.js';


export const productService = {
    getAll: () => {
        try {
            return Product.find({ deletedAt: null })
        } catch (error) {
            return error
        }
    },
    getOne: (id) => {
        try {
            return Product.findOne({ _id: id })
        } catch (error) {
            return error
        }
    },
    store: (newProduct) => {
        try {
            return Product.create(newProduct)
        } catch (error) {
            return error
        }
    },
    delete: (id) => {
        try {
            return Product.findByIdAndUpdate(
                id,
                { deletedAt: new Date },
                { new: true }
            )
        } catch (error) {
            return error
        }
    },
    update: (id, newProductData) => {
        try {
            return Product.updateOne(
                { _id: id },
                { $set: { ...newProductData } },
                { new: true }
            )
        } catch (error) {
            return error
        }
    }
}