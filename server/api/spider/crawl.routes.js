const express = require('express');
const crawlJob = require('./crawler.controller');
const router = express.Router();

router.post('/', crawlJob);
module.exports = router;
