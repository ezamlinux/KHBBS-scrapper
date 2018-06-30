const app = require('express')();
const Scrapper = require('./lib/kh-scrapper');
const fs = require('fs');
const kh = new Scrapper();

app.listen(3000, () => {
    kh.init()
        .then(data => {
            fs.writeFileSync('./output/mixage_fr.json', JSON.stringify(data), 'utf-8');
            console.log('output file in ./output/');
            process.exit(0);
        });
});

