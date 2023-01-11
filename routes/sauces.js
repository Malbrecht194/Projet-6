import express from "express";
import { addSauce, getSauces, getOneSauce, likeSauce } from "../controllers/sauces.js";
import { auth } from '../middleware/auth.js'
import  multer  from '../middleware/multer-config.js'

const router = express.Router()

router.get('/', auth, getSauces)
router.get ('/:id', auth, getOneSauce)
router.post ('/:id/like', auth, likeSauce)
router.post('/', auth, multer, addSauce)

export default router