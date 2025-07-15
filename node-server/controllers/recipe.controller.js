const { Recipes: Recipe } = require("../models/recipe.model")
const { Categories } = require("../models/categories.model");
const { default: mongoose } = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require("fs/promises");
const fileType = require('file-type');
const { getAllUsers } = require("./user.controller");
const { User } = require("../models/user.model");
const { log } = require("console");
const cloudinary = require('cloudinary').v2;


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

        try {
            if (req.user.role == 'admin' || req.user.role == "user" || req.user.role == "registered user") {

                if (req.file) {
                    req.body.imagUrl = req.file.filename;
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // if (req.file) {
                //     const result = await cloudinary.uploader.upload(req.file.path, {
                //         public_id: 'new_image_name' // כאן תכניס את השם החדש שתרצה לתת לתמונה
                //     });
                //     req.body.imagUrl = result.secure_url; // שמור את ה-URL של התמונה
                // }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////


                let recipe = new Recipe(req.body);
                const user = await User.findById(req.user.user_id)
                recipe.user = { name: user.username, _id: user._id }

                await recipe.save();

                let newCloudinaryPath = null;
                if (req.file) {
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        public_id: recipe._id // כאן תכניס את השם החדש שתרצה לתת לתמונה
                    });
                    newCloudinaryPath = result.secure_url; // שמור את ה-URL של התמונה
                }

                if (req.file) {
                    const newPath = req.file.path.replace(req.file.filename, recipe._id)
                    await fs.rename(req.file.path, newPath);
                    recipe = await Recipe.findByIdAndUpdate(recipe._id, { imagUrl: newCloudinaryPath }, { new: true });
                }

                // if (req.file) {
                //     const newPath = req.file.path.replace(req.file.filename, recipe._id)
                //     await fs.rename(req.file.path, newPath);
                //     recipe = await Recipe.findByIdAndUpdate(recipe._id, { imagUrl: path.basename(newPath) }, { new: true });
                // }

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

                // if (req.file) {
                //     const newPath = req.file.path.replace(req.file.filename, prevRecipe._id)
                //     await fs.rename(req.file.path, newPath);
                //     req.body.imagUrl = path.basename(newPath);
                // } else {
                //     req.body.imagUrl = null;
                // }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if (req.file) {
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        public_id: prevRecipe._id // כאן תכניס את השם החדש שתרצה לתת לתמונה
                    });
                    req.body.imagUrl = result.secure_url; // שמור את ה-URL של התמונה
                }
                else {
                    req.body.imagUrl = null;
                    if (prevRecipe.imagUrl) {
                        await cloudinary.uploader.destroy(prevRecipe._id);
                    }
                }

                // if (req.file) {
                //     const newPath = req.file.path.replace(req.file.filename, recipe._id)
                //     await fs.rename(req.file.path, newPath);
                //     recipe = await Recipe.findByIdAndUpdate(recipe._id, { imagUrl: newCloudinaryPath }, { new: true });
                // }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

            if (rec.imagUrl) {
                await cloudinary.uploader.destroy(rec._id);
            }

            const categories = rec.categories;
            for (element of categories) {
                const cat = await Categories.findOne({ description: element });
                if (cat) {
                    if (cat.recipes.length == 1) {
                        await Categories.findByIdAndDelete(cat._id)
                    }
                    else {
                        cat.recipes = cat.recipes.filter(x => x._id != rec._id)
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
    fileFilter: async (req, file, cb) => {
        console.log(file);

        if (!file || !file.path) {
            return cb(null, true);
        }

        const filePath = file.path;
        log('File path: multer ', filePath);
        const fileBuffer = await fs.readFile(filePath); // קריאה אסינכרונית של הקובץ
        const type = await fileType.fromBuffer(fileBuffer);

        if (!type || !type.mime.startsWith('image/')) {
            return cb('Uploaded file is not an image', false);
        }

        return cb(null, true);
    }
}).single('image');

// async function checkIfImage(filePath) {
//     const fileBuffer = await fs.readFile(filePath); // קריאה אסינכרונית של הקובץ

//     console.log('Checking file type for:', filePath);
    
//     console.log('File path:', filePath);
//     const type = await fileType.fromBuffer(fileBuffer);
//     if (type && type.mime.startsWith('image/')) {
//         console.log('This is an image file:', type);
//     } else {
//         console.log('This is not an image file');
//     }
// }