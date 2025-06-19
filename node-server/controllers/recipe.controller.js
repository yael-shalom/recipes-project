const { Recipes: Recipe } = require("../models/recipe.model")
const { Categories } = require("../models/categories.model");
const { default: mongoose } = require("mongoose");
const multer = require('multer');
const path = require('path');
const { error, log } = require("console");
const { query } = require("express");
const { getAllUsers } = require("./user.controller");
const { User } = require("../models/user.model");
const { rename } = require("fs/promises");
//#
exports.getAllRecipes = async (req, res, next) => {
    // optional parameters - לא חובה
    // http://localhost:5000/courses?search=ab&page=1&perPage=3
    let { search, page, perPage } = req.query;
    search ??= ''
    page ??= 1
    perPage ??= 3
    try {
        const query = [
            { name: new RegExp(search), isPrivate: false }
        ];

        if (req.user) {
            query.push({ 'user._id': req.user.user_id, isPrivate: true });
        }

        const allRecipes = await Recipe.find({ $or: query })
            //  .skip((page - 1) * perPage)
            //  .limit(perPage)
            .select('-__v');
        return res.send(allRecipes);
    } catch (error) {
        next(error)
    }

}


//#
exports.getRecipeByCode = async (req, res, next) => {
    const id = req.params.id;

    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            const recipeById = await Recipe.findById(id, { __v: false })
            res.json(recipeById).status(200);
        } catch (error) {
            next({ message: error.message })
        }

    }
    else {
        next({ message: 'id is not valid ', status: 404 })
    }
};


exports.getRecipesByUser = async (req, res, next) => {
    let { search } = req.query;
    search ??= ''

    //לבדוק הראשות שה למשתמש 
    const id = req.params.userId;
    try {
        const userRecipe = await Recipe.find({ 'user._id': id }).select('-__v');
        return res.json(userRecipe).status(200);
    } catch (error) {
        next({ message: error.message, status: 404 })
    }
    //האם צריך הרשאות לפי טוקן ?

}

exports.getRecipesByPreparationTime = async (req, res, next) => {
    const { preparationTime } = req.params;

    try {
        const recipeByPreparationTime = await Recipe.find({ preparationTime: preparationTime }).select('-__v')
        return res.json(recipeByPreparationTime).status(201);
    } catch (error) {
        next({ message: error.message, status: 404 })
    }
}


exports.addRecipe = async (req, res, next) => {
    upload(req, res, async (err) => {
        let { categories } = req.body;


        if (typeof (categories) === "string")
            categories = [categories]

        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err });
            } else {
                // An unknown error occurred when uploading.
                return res.status(500).json({ message: err });
            }
        }

        try {
            if (req.user.role == 'admin' || req.user.role == "user" || req.user.role == "registered user") {

                if (req.file) {
                    req.body.imagUrl = req.file.filename;
                }

                let recipe = new Recipe(req.body);
                const user = await User.findById(req.user.user_id)
                recipe.user = { name: user.username, _id: user._id }

                await recipe.save();

                if (req.file) {
                    const newPath = req.file.path.replace(req.file.filename, recipe._id)
                    await rename(req.file.path, newPath);
                    recipe = await Recipe.findByIdAndUpdate(recipe._id, { imagUrl: path.basename(newPath) }, { new: true });
                }

                if (categories) {
                    for (const element of categories) {
                        const cat = await Categories.findOne({ description: element });
                        if (cat) {
                            cat.recipes.push(recipe);
                            await cat.save();
                        }
                        else {

                            const mewCategory = new Categories({
                                description: element,
                                recipes: {
                                    name: recipe.name,
                                    imagUrl: recipe.imagUrl,
                                    difficulty: recipe.difficulty,
                                    preparationTime: recipe.preparationTime,
                                    _id: recipe.id
                                }
                            })
                            await mewCategory.save();
                        }
                    }
                }

                res.json(recipe).status(201);//created json
            }
            else {
                next({ message: ' only admin or registered user can add recipe ', status: 403 })
            }

        } catch (error) {
            next({ message: error.message })
        }

    })



}
//##
exports.updateRecipes = async (req, res, next) => {
    upload(req, res, async (error) => {
        let { categories } = req.body;

        if (typeof (categories) === "string")
            categories = [categories]

        if (error) {
            if (error instanceof multer.MulterError) {
                return next({ message: error, status: 400 });
            } else {
                return next({ message: error, status: 500 });
            }
        }


        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            next({ message: 'id is not valid' })
        try {
            if (req.user.role == 'admin' || req.user.role == 'user' || req.user.role == 'registered user') {

                const prevRecipe = await Recipe.findById(id)
                if (!prevRecipe)
                    return next({ message: 'recipe not found' })
                if (req.file) {
                    const newPath = req.file.path.replace(req.file.filename, prevRecipe._id)
                    await rename(req.file.path, newPath);
                    req.body.imagUrl = path.basename(newPath);
                }

                const updatedRecipe = await Recipe.findByIdAndUpdate(
                    id,
                    { $set: req.body },
                    { new: true });

                const prevCategory = prevRecipe.categories
                for (let category of prevCategory) {
                    if (!categories.includes(category)) {
                        const cat = await Categories.findOne({ description: category });
                        if (cat) {

                            if (cat.recipes.length == 1) {
                                await Categories.findByIdAndDelete(cat._id)
                            }
                            else {
                                cat.recipes = cat.recipes.filter(x => x.id != id)
                                await cat.save()
                            }

                        }

                    }
                }
                for (let element of categories) {
                    const cat = await Categories.findOne({ description: element });
                    if (!cat) {
                        const mewCategory = new Categories({
                            description: element,
                            recipes: {
                                name: updatedRecipe.name,
                                imagUrl: updatedRecipe.imagUrl,
                                difficulty: updatedRecipe.difficulty,
                                preparationTime: updatedRecipe.preparationTime,
                                _id: updatedRecipe.id
                            }
                        })
                        await mewCategory.save();
                    }
                    if (cat) {
                        let RecipeIndex = cat.recipes.findIndex(x => x._id == prevRecipe._id)

                        cat.recipes[RecipeIndex] = {
                            name: updatedRecipe.name,
                            imagUrl: updatedRecipe.imagUrl,
                            difficulty: updatedRecipe.difficulty,
                            preparationTime: updatedRecipe.preparationTime,
                            _id: updatedRecipe.id
                        }
                        await cat.save();
                    }
                }


                return res.json(updatedRecipe)
            }
            else {
                next({ message: ' only admin or registered user can add recipe ', status: 403 })

            }
        } catch (error) {
            next({ message: error.message })
        }

    })

}


exports.deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: ' id is not valid' })
    try {
        if (req.user.role == 'admin' || req.user.role == 'registered user' || req.user.role == 'user') {
            const rec = await Recipe.findById(id)
            if (!rec)
                return next({ message: 'recipe not found' })

            const categories = rec.categories;
            for (element of categories) {

                const cat = await Categories.findOne({ description: element });
                if (cat) {
                    if (cat.recipes.length == 1) {
                        await Categories.findByIdAndDelete(cat._id)
                    }
                    else {
                        cat.recipes.filter(x => x._id != rec._id)
                        await cat.save();
                    }

                }



            }

            await Recipe.findByIdAndDelete(id)
            return res.status(204).send();
        }
    } catch (error) {
        next({ message: error.message })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(Date.now() + file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
}).single('image');  