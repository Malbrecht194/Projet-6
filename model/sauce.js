import mongoose from "mongoose";

const SauceSchema = new mongoose.Schema({ //création du schéma
    userID: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPepper: {type: String, require: true},
    imageName: {type: String, require: true},
    heat: {type: Number, require: true},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
})

export const Sauce = mongoose.model('sauce', SauceSchema)