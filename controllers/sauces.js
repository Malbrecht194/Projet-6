import { Sauce } from "../model/sauce.js"
import fs from 'fs'

/**
 * Ajouter une sauce 
 */
export async function addSauce(req, res) {
    try {
        const sauceItem = JSON.parse(req.body.sauce)
        delete req.body._id
        const sauce = new Sauce({
            // ...req.body => a éviter d'utiliser
            userID: req.auth.userId,
            name: sauceItem.name,
            manufacturer: sauceItem.manufacturer,
            description: sauceItem.description,
            mainPepper: sauceItem.mainPepper,
            imageName: req.file.filename,
            heat: sauceItem.heat,
            usersLiked: [],
            usersDisliked: []
        })
        await sauce.save()
        res.status(201).json({ message: 'La sauce a été enregistrée' })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}

/**
 * Récupérer toute les sauces
 */
export async function getSauces(req, res) {
    try {
        const sauces = await Sauce.find()
        res.status(200).json(
            sauces.map(sauce =>
                normalizer(req, sauce.toObject())
            )
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/**
 * Récupérer une seule sauce
 */
export async function getOneSauce(req, res) {
    try {
        const sauce = await Sauce.findOne({
            _id: req.params.id
        })
        res.status(200).json(normalizer(req, sauce.toObject()))
    } catch (error) {
        console.error(error)
        res.status(404).json({ error })
    }
}

/**
 * Modifier une sauce
 */
export async function modifySauce(req, res) {
    try {
        const sauce = await Sauce.findOne({ // appel de la sauce 
            _id: req.params.id
        })
        if (sauce.userID !== req.auth.userId) { // vérif du user
            return res.status(401).json({ message: 'Non autorisé' })
        }

        const sauceObject = req.file ? { // vérif si oui ou non y'a un fichier
            ...JSON.parse(req.body.sauce),
            imageName: req.file.filename
        } : { ...req.body };

        delete sauceObject._userId //Mesure de sécurité

        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //update des informartions
        if (req.file) {
            fs.unlinkSync(`images/${sauce.imageName}`)
        }
        res.status(200).json({ message: 'Sauce modifié' })
    
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }

}

/**
 * Supprimer une sauce
 */
export async function deleteSauce(req, res) {
    try {
        const sauce = await Sauce.findOne({
            _id: req.params.id
        })
        if (sauce.userID !== req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' })
        } else {
            const filename = sauce.imageName
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                res.status(200).json({ message: 'Objet supprimé !' })
            })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}

/**
 * Fonction qui gère les like
 */
export async function likeSauce(req, res) {
    try {
        const sauce = await Sauce.findOne({
            _id: req.params.id
        })
        sauce.usersLiked = sauce.usersLiked.filter(userID => userID !== req.body.userId)
        sauce.usersDisliked = sauce.usersDisliked.filter(userID => userID !== req.body.userId)
        if (req.body.like === 1) {
            sauce.usersLiked.push(req.body.userId)
        }
        if (req.body.like === -1) {
            sauce.usersDisliked.push(req.body.userId)
        }
        await sauce.save()
        res.status(200).json()
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}

function normalizer(req, sauce) {
    return {
        _id: sauce._id,
        userId: sauce.userID,
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        heat: sauce.heat,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.usersLiked.length,
        dislikes: sauce.usersDisliked.length,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${sauce.imageName}` //--- IMPORTANT ---//
    }
}