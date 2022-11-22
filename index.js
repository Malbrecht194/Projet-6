import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import authRoutes from './routes/auth.js'
import saucesRoutes from './routes/sauces.js'
import dotenv from 'dotenv'

// -----   IMPORTANT DE NE PAS OUBLIER CES 3 LIGNES -----
// import * as url from 'url'; 
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config()
const app = express()
app.use(cors())

app.use(express.json()) //Récupérer les requêtes en Json
app.use('/api/auth', authRoutes)
app.use('/api/sauces', saucesRoutes)
// app.use('/images', express.static(path.join(__dirname, '/images')));
app.use(express.static('images'))

main()
async function main() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connection à la BDD réussi')
        app.listen(3000)
        console.log('serveur démarré')
    } catch(_) {
        console.log('Connection à la BDD échoué')
    }
}