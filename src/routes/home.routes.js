import { Router } from 'express';
import homeController from '../controllers/home.controller.js';

const homeRouter = Router();

homeRouter.get("/", homeController.home);

export default homeRouter