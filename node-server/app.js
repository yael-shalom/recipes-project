const fs = require('fs').promises;
const path = require('path');
const express = require('express')
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user.route')
const recipesRouter = require('./routes/recipe.route')
const categoriesRouter = require('./routes/categories.route')
const proxyRouter = require('./routes/proxy.route');

const { pageNotFound, serverErrors } = require('./middlewares/handleErrors')
require('dotenv').config();
require('./config/db')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cors());
app.get('/', (req, res) => {
    res.send('welcome to recipe website')
});

app.use('/', async (req, res, next) => {
    const dirPath = path.join(__dirname, 'images');

    try {
        // בדוק אם התיקייה קיימת
        await fs.access(dirPath);
    } catch {
        // אם לא קיימת, צור אותה
        await fs.mkdir(dirPath);
    }

    next(); // המשך לעבד את הבקשה
});

app.use('/images', express.static('images'));
app.use('/users', userRouter);
app.use('/recipes', recipesRouter);
app.use('/categories', categoriesRouter)
app.use('/proxy', proxyRouter);

app.use(pageNotFound);
app.use(serverErrors);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("running at http://localhost:" + port);

})