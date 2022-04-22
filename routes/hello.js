const express = require('express');
const http = require('https');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('mydb.sqlite3');

/* GET home page. */
router.get('/', function (req, res, next) {
    db.serialize(() => {
        db.all('select * from mydata', (err, rows) => {
            if(!err){
                const data = {
                    title: 'Hello',
                    content: rows,
                };
                res.render('hello', data);
            }
            console.error(err);
        });
    });
});


module.exports = router;
