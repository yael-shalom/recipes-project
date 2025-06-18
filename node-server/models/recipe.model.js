const mongoose = require('mongoose');
const Joi = require('joi');
const { userSchema } = require('./user.model')

const miniUser = new mongoose.Schema({
    name: { type: String, require: true, get(v) { return v.toUpperCase } },
    _id: { type: mongoose.Types.ObjectId, required: true, ref: 'users' }
})
const recipeSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    categories: [{ type: String, required: true }],
    preparationTime: { type: Number },
    difficulty: { type: Number, min: 1, max: 5 },
    dateAdded: { type: Date, default: new Date() },
    layersArray: [{
        description: { type: String },
        ingredients: [{ type: String }]
    }],
    preparationInstruction: {
        type: [String],
        validate: {
            validator(v) {
                return v && v.length >= 1;
            },
            message: 'category mast contain at least one item '
        }
    },
    imagUrl: { type: String },
    isPrivate: { type: Boolean },
    user: miniUser
})

module.exports.Recipes = mongoose.model('recipes', recipeSchema)
