import { User } from "../model/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Ajout d'un utilisateur
 */
export async function signup(req, res) { //signup
    try {
        const hash = await bcrypt.hash(req.body.password, 10) // Hachage du password des utilisateurs avant l'enregistrement dans la BDD 

        const user = new User({
            email: req.body.email,
            password: hash
        })
        
        await user.save() // Enregistrement de l'utilisateur dans la BDD
        return res.status(201).json({ message: 'Utilisateur enregistré' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/**
 * Connexion d'un utilisateur
 */
export async function login(req, res) { //login
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ message: 'La paire login/mdp est incorrecte' })
        }
        const valid = await bcrypt.compare(req.body.password, user.password)
        if (!valid) {
            return res.status(401).json({ message: 'La paire login/mdp est incorrecte' })
        }
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            )
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}