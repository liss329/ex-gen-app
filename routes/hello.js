const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const data = {
        title: 'Hello',
        content: `これはサンプルコンテンツです。<br>
                this is a sample content.`,
    }
    res.render('hello', data);
});

module.exports = router;
