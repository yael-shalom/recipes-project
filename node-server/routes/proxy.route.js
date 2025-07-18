const express = require('express');
const { getImageFromURL } = require('../controllers/proxy.controller');

const router = express.Router();

router.get('/', getImageFromURL);

module.exports = router;