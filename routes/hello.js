const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const data = {
        title: 'Hello',
        content: `※なにか書いて送信してください。`,
    }
    res.render('hello', data);
});

router.post('/post', (req, res, next) => {
    const msg = req.body['message'];
    const data = {
        title: 'Hello',
        content: `あなたは「${msg}」と送信しました`,
    };
    res.render('hello', data);
});

module.exports = router;
