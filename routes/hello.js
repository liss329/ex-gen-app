const express = require('express');
const http = require('https');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('mydb.sqlite3');

router.get('/', function (req, res, next) {
    db.serialize(() => {
        db.all('select * from mydata', (err, rows) => {
            if(!err){
                const data = {
                    title: 'Hello',
                    content: rows,
                };
                res.render('hello/index', data);
            }
            console.error(err);
        });
    });
});

router.get('/add', (req, res, next) => {
    const data = {
        title: 'Hello/Add',
        content: '新しいレコードを入力：',
    };
    res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
    let nm = req.body.name;
    let ml = req.body.mail;
    let ag = req.body.age;
    db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag);
    res.redirect('/hello');
});

module.exports = router;
