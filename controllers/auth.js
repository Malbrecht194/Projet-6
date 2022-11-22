import { User } from "../model/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => { //signup
    try {
        const hash = await bcrypt.hash(req.body.password, 10) // Hachage du password des utilisateurs avant l'enregistrement dans la BDD 

        const user = new User({
            email: req.body.email,
            password: hash
        })
        return user.save() // Enregistrement de l'utilisateur dans la BDD
            .then(() => res.status(201).json({ message: 'Utilisateur enregistré' }))
    } catch (error) {
        res.status(500).json({ error })
    }
}

export const login = async (req, res) => { //login
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
                'MON_SUPER_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
        })
    } catch (error) {
        res.status(500).json({ error })
    }
}