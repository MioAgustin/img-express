const express = require('express');
const {json, query} = require('express')
const colors = require('colors');
const path = require('path')
const {connectdb} = require('./db.js')

// App configuration
const app = express();
app.set('port', 8000)
app.set('view engine', 'ejs')
app.set('views', __dirname)
app.use(json())
app.use(express.urlencoded({extended: false}))

async function querydb(query) {
    let conn = await connectdb();
    try {
        let result = await conn.query(query);
        return result;
    } catch (error) {
        console.log(error);
        return {status: "err"}
    }
}

// Middleware
app.use((req, res, next)=> {
    console.log(`URL: ${req.originalUrl}`)
    next()
})

// Routers
app.get('/', (req, res) => {
    async function homePhotos() {
        let result = await querydb('SELECT * FROM animals');
        res.render('./view/home.ejs', {result: result[0]})
    }
    homePhotos()
})

app.get('/img/:name', (req, res)=> {
    async function imgByName() {
        let result = await querydb(`SELECT * FROM animals WHERE name = "${req.params.name}"`);
        if(result[0].length > 0) {
            res.render('./view/img.name.ejs', {result: result[0]})
        } else {
            res.render('./view/not.found.ejs', {message: `Not Found Character: ${req.params.name}`})
        }
    }
    imgByName();
})

app.get('/upload', (req, res) => {
    let status = 'none';
    let classA = 'none';
    let type = 'Upload Files';
    let inputOne = 'name';
    let url = '/uploadPost'
    function resSendFile() {
        res.render('./view/upload.data.ejs', {status, classA, type, inputOne, url})
    }
    if(req.query.status == 'ok') {
        status = 'Img Saved!';
        classA = 'img-saved';
        resSendFile()
    } else if (req.query.status == 'err') {
        status = 'Error Try Again';
        classA = 'img-not-saved';
        resSendFile()
    } else {
        status = 'Welcome!';
        resSendFile()
    }
})

app.post('/uploadPost', (req, res) => {
    let nameCharacter = req.body.name;
    let urlCharacter = req.body.url;
    let statuAs = 'as';
    async function uploadPostImg() {
        let queryResult = await querydb(`INSERT INTO animals(name, url) VALUES ("${nameCharacter}", "${urlCharacter}")`)
        if(queryResult.status == 'err') {
            res.redirect('/upload?status=err')
        } else {
            res.redirect('/upload?status=ok')
        }
    }
    uploadPostImg();
})

app.get('/delete/:id', (req, res) => {
    async function deteleteImg() {
        let deleteResult = await querydb(`DELETE FROM animals WHERE id = ${req.params.id}`);
        if (deleteResult.status == 'err') {
            res.render('./view/detelete.img.ejs', {message: 'IMG NOT DELETED!'});
        } else {
            res.render('./view/detelete.img.ejs', {message: 'IMG DELETED!'});
        }
    }
    deteleteImg();
})

app.get('/update', (req, res) => {
    let status = 'none';
    let classA = 'none';
    let type = 'Upload Files';
    let inputOne = 'id';
    let url = '/updatePost'
    function resSendFile() {
        res.render('./view/upload.data.ejs', {status, classA, type, inputOne, url})
    }
    if(req.query.status == 'ok') {
        status = 'Img Updated!';
        classA = 'img-saved';
        resSendFile()
    } else if (req.query.status == 'err') {
        status = 'Error Try Again';
        classA = 'img-not-saved';
        resSendFile()
    } else {
        status = 'Welcome!';
        resSendFile()
    }
})

app.post('/updatePost', (req, res) => {
    let idCharacter = req.body.id;
    let urlCharacter = req.body.url;
    async function updatePostImg() {
        let queryResult = await querydb(`UPDATE animals SET url = "${urlCharacter}" WHERE id = "${idCharacter}"`);
        if (queryResult.status == 'err') {
            res.redirect('/update?status=err');
        } else {
            res.redirect('/update?status=ok')
        }
    }
    updatePostImg()
})

// Public folder configuration
app.use(express.static(path.join(__dirname, 'public')))

// Listing 
app.listen(app.get('port'), ()=> {
    console.log(`Server is runing on port: ${app.get('port')}`.bgBlack)
})
