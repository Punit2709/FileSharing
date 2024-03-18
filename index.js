const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const File = require('./models/file')
const bcrypt = require("bcrypt")
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const uploads = multer({ dest: "uploads" });

app.set("view engine", "ejs");
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', uploads.single('file'), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
    }

    if (req.body.password != null && req.body.password !== '') {
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }

    console.log(fileData);
    const file = await File.create(fileData);

    res.render('index', { fileLink: `${req.headers.origin}/file/${file.id}` })
})

app.route('/file/:id').get(handleDownload).post(handleDownload)

async function handleDownload(req, res){
        
    const file = await File.findById(req.params.id);
 
    if(file.password != undefined){
        if(req.body.password == null){
            res.render("password")
            return 
        }

        if(!await bcrypt.compare(req.body.password, file.password)){
            res.render("password", {error: true})
            return 
        }
    }
    res.download(file.path, file.originalName);
}   

app.listen(3000, console.log('Server running at 3000'))