const { default: mongoose } = require("mongoose");
//connecting db
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('mongo db connected'))
    .catch(err => console.log(err.message));


const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});