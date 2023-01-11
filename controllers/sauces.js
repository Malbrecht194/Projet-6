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
        console.error(error)
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
        console.error(error)
        res.status(500).json({error})
    }
}

export async function getOneSauce (req, res){
    try{
        const sauce = await Sauce.findOne({
            _id: req.params.id
        })
        res.status(200).json(normalizer(req, sauce.toObject()))
    } catch(error){
        console.error(error)
        res.status(404).json({error}) 
    }
}

/**
 * Fonction qui gère les like
 */
export async function likeSauce (req, res) { 
    try{
        const sauce = await Sauce.findOne({
            _id: req.params.id
        })
        sauce.usersLiked = sauce.usersLiked.filter(userID => userID !== req.body.userId)
        sauce.usersDisliked = sauce.usersDisliked.filter(userID => userID !== req.body.userId)
        if (req.body.like === 1){
            sauce.usersLiked.push(req.body.userId)   
        }
        if (req.body.like === -1){
            sauce.usersDisliked.push(req.body.userId)   
        }
        await sauce.save()
        res.status(201).json({message: 'OK'})
    }catch(error){
        console.error(error)
        res.status(400).json({error})
    }
}

function normalizer(req, sauce){
    return {
        _id : sauce._id,
        userId: sauce.userID,
        name : sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        heat : sauce.heat,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.usersLiked.length,
        dislikes: sauce.usersDisliked.length,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            sauce.imageName
        }` //--- IMPORTANT ---//
    }
}