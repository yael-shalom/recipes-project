const mongoose = require('mongoose');
const {Recipes} =require('./recipe.model');
const joi = require('joi');

const recipesMiniSchema=new mongoose.Schema({
    name:{type:String},
    imagUrl:{type:String},
    difficulty:{type:Number,match:[1-5]},
    preparationTime:{type:Number},
    _id:{type:mongoose.Types.ObjectId,ref:'recipes'}//??
});
const  categoriesSchema= new mongoose.Schema({
    description:{type:String},
    recipes:[recipesMiniSchema]//
});

module.exports.Categories=mongoose.model('categories',categoriesSchema)