import express  from "express";


// Import products routes
import productRouter from './routes/products.routes.js'

const app = express();
app.use(express.json());


app.use("/api/v1/products", productRouter)

export default app