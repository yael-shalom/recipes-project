const express=require('express');
const {getAllRecipes,
    getRecipeByCode,
    getRecipesByPreparationTime,
    getRecipesByUser,
    addRecipe,
    updateRecipes,
    deleteRecipe}= require('../controllers/recipe.controller');
const { userAuth, getAuth } = require('../middlewares/userAuth');
const { adminAuth } = require('../middlewares/adminAuth');

const router=express.Router();
router.get('/getallrecipes', getAuth, getAllRecipes);
router.get('/getRecipeByCode/:id',getRecipeByCode);
router.get('/getRecipesByPreparationTime/:preparationTime',getRecipesByPreparationTime);
router.get('/getRecipesByUser/:userId',getRecipesByUser);
router.post('/addRecipe', userAuth, addRecipe);
router.put('/updateRecipes/:id',userAuth,updateRecipes);
router.delete('/deleteRecipe/:id',userAuth,deleteRecipe);
module.exports=router;
