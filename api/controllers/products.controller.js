import Product from '../models/productsModel.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'

const productController = {
    getAll: async (req, res) => {
        try {

            let {
                limit = 10,
                page = 1,
                order = 'ASC',
                sortBy = 'release_date',
                search = '',
                category = '',
                gender = ''
            } = req.query;

            limit = limit > 20 ? 20 : limit;
            page = +page;
            order = order === 'ASC' ? 1 : -1;

            const query = { name: { $regex: search, $options: 'i' } };

            if (category) {
                query.category = category;
            }
            if (gender) {
                query.gender = gender;
            }

            const products = await Product.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ [sortBy]: order });

            const allProducts = await Product.countDocuments(query);
            const totalPages = Math.ceil(allProducts / limit)

            return res.status(200).json({
                status: 200,
                data: products,
                total: allProducts,
                totalPages: totalPages,
                page: page,
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message
            })
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findOne({ _id: id });
            return res.status(200).json({
                status: 200,
                data: product
            })
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: "El Producto no existe"
            })
        }
    },
    store: async (req, res) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({
                    status: 400,
                    isStored: false,
                    message: "The product name is required"
                })
            }
            let newProduct = {
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                size: req.body.size,
                price: req.body.price,
                gender: req.body.gender,
                color: req.body.color,
                collectionName: req.body.collectionName,
                brand: req.body.brand,
                quantity: req.body.quantity,
                rating: req.body.rating,
                discount: req.body.discount,
                release_date: req.body.release_date,
                shipping_cost: req.body.shipping_cost,
            };

            if (req.files?.image) {
                let imgSaved = await Promise.all(
                    req.files.image.map(async (item) => {
                        const result = await uploadImage(item.tempFilePath)
                        await fs.unlink(item.tempFilePath)
                        return {
                            public_id: result.public_id,
                            secure_url: result.secure_url
                        }
                    })
                )
                newProduct = {
                    ...newProduct,
                    images: imgSaved
                }
            }

            const productStored = await Product.create(newProduct);
            return res.status(200).json({
                data: productStored
            })

        } catch (error) {
            return res.status(500).json({
                status: 500,
                isStored: false,
                message: "Error al guardar producto " + error
            })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const response = await Product.findByIdAndUpdate(
                id,
                { deletedAt: new Date },
                { new: true }
            );

            if (!response) return res.status(404).json({
                message: 'No existe el producto',
                error: response
            })

            if (response.images.length > 0) {
                await Promise.all(
                    response.images.map(async (item) => {
                        return await deleteImage(item.public_id)
                    })
                )
            }

            return res.status(200).json({
                status: 200,
                isdeleted: true,
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Error al eliminar producto " + error
            })
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const oldProduct = await Product.findOne({ _id: id });

            if (!oldProduct) {
                return res.status(404).json({
                    status: 404,
                    message: "The product is not found "
                })
            }

            const updatedProduct = {
                name: req.body.name ? req.body.name : oldProduct.name,
                category: req.body.category ? req.body.category : oldProduct.category,
                description: req.body.description ? req.body.description : oldProduct.description,
                images: req.body.images ? req.body.images : oldProduct.images,
                size: req.body.size ? req.body.size : oldProduct.size,
                price: req.body.price ? req.body.price : oldProduct.price,
                gender: req.body.gender ? req.body.gender : oldProduct.gender,
                color: req.body.color ? req.body.color : oldProduct.color,
                collectionName: req.body.collectionName ? req.body.collectionName : oldProduct.collectionName,
                brand: req.body.brand ? req.body.brand : oldProduct.brand,
                quantity: req.body.quantity ? req.body.quantity : oldProduct.quantity,
                rating: req.body.rating ? req.body.rating : oldProduct.rating,
                discount: req.body.discount ? req.body.discount : oldProduct.discount,
                release_date: req.body.release_date ? req.body.release_date : oldProduct.release_date,
                shipping_cost: req.body.shipping_cost ? req.body.shipping_cost : oldProduct.shipping_cost,
            }

            const response = await Product.updateOne(
                { _id: id },
                { $set: { ...updatedProduct } },
                { new: true }
            );

            return res.status(200).json({
                status: 200,
                isUpdate: true,
                data: response
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                isUpdate: false,
                message: "Error al actualizar producto"
            })
        }
    },
    categories: async (req, res) => {
        try {
            const categories = await Product.distinct('category');
            const amount = categories.length;

            return res.status(200).json({
                status: 200,
                data: categories,
                amount: amount,
            })

        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: error
            })
        }
    }
}

export default productController;