import { productService } from '../services/productService.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'

const productController = {
    getAll: async (req, res) => {
        try {
            const allProducts = await productService.getAll();
            return res.status(200).json({
                status: 200,
                total: allProducts.length,
                data: allProducts
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
            const product = await productService.getOne(id);
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
                collection: req.body.collection,
                brand: req.body.brand,
                quantity: req.body.quantity,
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

            const productStored = await productService.store(newProduct);
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
            const response = await productService.delete(id);
            
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
            const oldProduct = await productService.getOne(id);
            
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
                collection: req.body.collection ? req.body.collection : oldProduct.collection,
                brand: req.body.brand ? req.body.brand : oldProduct.brand,
                quantity: req.body.quantity ? req.body.quantity : oldProduct.quantity,
            }
            
            const response = await productService.update(id, updatedProduct);

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
    }
}

export default productController;