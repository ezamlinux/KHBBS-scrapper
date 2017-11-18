const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Scrapper = require('./lib/kh-scrapper');
const kh = new Scrapper();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.listen(3000, () => {
    kh.init();
    console.log('Data extracted from KH:BBS to ./output/');
})

