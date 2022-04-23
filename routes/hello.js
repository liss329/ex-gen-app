const express = require('express');
const http = require('https');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('mydb.sqlite3');

router.get('/', function (req, res, next) {
    db.serialize(() => {
        db.all('select * from mydata', (err, rows) => {
            if (!err) {
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

router.get('/show', (req, res, next) => {
    const id = req.query.id;
    db.serialize(() => {
        const q = 'select * from mydata where id = ?';
        db.get(q, [id], (err, row) => {
            if (!err) {
                const data = {
                    title: 'hello/show',
                    content: `id = ${id}のレコード`,
                    mydata: row
                };
                res.render('hello/show', data);
            }
        });
    });
});

router.get('/edit', (req, res, next) => {
    console.log(`クエリパラメータ:${req.query.id}`);
    const id = req.query.id ?? 1;
    db.serialize(() => {
        const q = 'select * from mydata where id = ?';
        db.get(q, [id], (err, row) => {
            if (!err) {
                const data = {
                    title: 'hello/edit',
                    content: `id = ${id}のレコードを編集`,
                    mydata: row,
                };
                res.render('hello/edit', data);
            }
        });
    });
});

router.post('/edit', (req, res, next) => {
    const id = req.body.id;
    const nm = req.body.name;
    const ml = req.body.mail;
    const ag = req.body.age;
    const q = 'update mydata set name = ?, mail = ?, age = ? where id = ?';
    db.run(q, nm, ml, ag, id);
    res.redirect('/hello');
});

module.exports = router;
