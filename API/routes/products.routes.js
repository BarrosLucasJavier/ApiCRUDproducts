import { Router } from "express";
import productController from "../controllers/products.controller.js";
import fileUpload from 'express-fileupload';

const productRouter = Router();

// GET - http://localhost:3000/api/v1/products/
productRouter.get("/", productController.getAll);

// GET - http://localhost:3000/api/v1/products/:id
productRouter.get("/:id", productController.getOne);

// POST - http://localhost:3000/api/v1/products/
productRouter.post("/", fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}), productController.store);

// DELETE - http://localhost:3000/api/v1/products/:id
productRouter.delete("/:id", productController.delete);

// PUT - http://localhost:3000/api/v1/products/:id
productRouter.put("/:id", productController.update);

export default productRouter