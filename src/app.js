import express  from "express";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import  methodOverride  from 'method-override'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import products routes
import productRouter from './routes/products.routes.js'
import homeRouter from "./routes/home.routes.js";


const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use("/", homeRouter)
app.use("/api/v1/products", productRouter)

export default app