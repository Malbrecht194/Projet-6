import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const Userschema = new mongoose.Schema({ //création du schéma
    email: {type:String , required: true, unique: true},
    password: {type:String , required: true}
})

Userschema.plugin(mongooseUniqueValidator)
export const User = mongoose.model('user', Userschema) //création du model