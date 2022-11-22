import express from "express";
import { addSauce, getSauces } from "../controllers/sauces.js";
import { auth } from '../middleware/auth.js'
import  multer  from '../middleware/multer-config.js'

const router = express.Router()

router.get('/', auth, getSauces)
router.post('/', auth, multer, addSauce)

export default router