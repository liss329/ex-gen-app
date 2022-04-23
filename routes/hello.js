const express = require('express');
const http = require('https');
const sqlite3 = require('sqlite3');
const knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: 'mydb.sqlite3'
    },
    useNullAsDefault: true
});
const Bookshelf = require('bookshelf')(knex);

const router = express.Router();
const db = new sqlite3.Database('mydb.sqlite3');

const MyData = Bookshelf.Model.extend({
    tableName: 'mydata',
});

router.get('/', function (req, res, next) {
    new MyData().fetchAll().then((collection) => {
        const data = {
            title: 'Hello',
            content: collection.toArray(),
        };
        res.render('hello/index', data);
    }).catch((err) => {
        res.status(500).json({ error: true, data: { message: err.message } });
    });
});

router.get('/add', (req, res, next) => {
    const data = {
        title: 'Hello/Add',
        content: '新しいレコードを入力：',
        form: { name: '', mail: '', age: 0 },
    };
    res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
    req.check('name', 'NAMEは必ず入力してください。').notEmpty();
    req.check('mail', 'MAILはメールアドレスを入力してください。').isEmail();
    req.check('age', 'AGEは年齢（整数）を入力してください。').isInt();
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            let response = '<ul class = error>';
            const result_arr = result.array();
            for (const n in result_arr) {
                response += `<li>${result_arr[n].msg}</li>`;
            }
            response += `</ul>`;
            const data = {
                title: 'hello/add',
                content: response,
                form: req.body,
            };
            res.render('hello/add', data);
        } else {
            new MyData(req.body).save().then((model) => {
                res.redirect('/hello');
            });
        }
    });
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

router.get('/delete', (req, res, next) => {
    const id = req.query.id ?? 1;
    db.serialize(() => {
        const q = 'select * from mydata where id = ?';
        db.get(q, [id], (err, row) => {
            if (!err) {
                const data = {
                    title: 'hello/Delete',
                    content: `id = ${id}のレコードを削除`,
                    mydata: row
                };
                res.render('hello/delete', data);
            }
        });
    });
});

router.post('/delete', (req, res, next) => {
    const id = req.body.id;
    const q = 'delete from mydata where id = ?';
    db.run(q, id);
    res.redirect('/hello');
});

module.exports = router;
