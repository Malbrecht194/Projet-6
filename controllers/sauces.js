import { Sauce } from "../model/sauce.js"

export const addSauce = async (req, res) => { //Ajout d'une sauce   
    try {
    const sauceItem = JSON.parse(req.body.sauce)
    delete req.body._id
    const sauce = new Sauce ({
        // ...req.body => a éviter d'utiliser
        userID: req.auth.userId,
        name : sauceItem.name,
        manufacturer: sauceItem.manufacturer,
        description: sauceItem.description,
        mainPepper: sauceItem.mainPepper,
        imageName: req.file.filename ,
        heat : sauceItem.heat,
        usersLiked: [],
        usersDisliked: []
    })
        await sauce.save()
        res.status(201).json({message: 'La sauce a été enregistrée'})
    }catch(error){
        res.status(400).json({ error })
    }
}

export const getSauces = async (req, res) =>{ // On récupère les sauces depuis la BDD
    try { 
        const sauces = await Sauce.find()
        res.status(200).json(
            sauces.map(sauce => 
              normalizer(req, sauce.toObject())
            )
        )
    } catch(error){
        res.status(500).json({error})
    }
}

function normalizer(req, sauce){
    return {
        userID: sauce.userId,
        name : sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        heat : sauce.heat,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.usersLiked.length,
        dislikes: sauce.usersDisliked.length,
        imageURL: `${req.protocol}://${req.get('host')}/images/${sauce.imageName}` // --- IMPORTANT ---//
    }
}