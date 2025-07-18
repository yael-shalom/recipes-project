const axios = require('axios');

exports.getImageFromURL = async (req, res, next) => {
    const imageUrl = req.query.url; // קח את ה-URL מה-query parameter

    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer' // קבל את התגובה כ-binary
        });
        res.set('Content-Type', response.headers['content-type']); // הגדר את סוג התוכן
        res.send(response.data); // שלח את התמונה ללקוח
    } catch (error) {
        console.log(error);
        next({ message: 'Error fetching image' });
    }
};