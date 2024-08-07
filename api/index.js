import express from "express";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override'
import { connectToDB } from './utils/mongoose.js'
import cors from 'cors'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import products routes
import productRouter from './routes/products.routes.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(cors());

app.use("/api/v1/products", productRouter)

async function main() {
    // DB connection
    await connectToDB();
    app.listen(3000, () => console.log("Server running in 3000 port - http://localhost:3000"));
}

main()