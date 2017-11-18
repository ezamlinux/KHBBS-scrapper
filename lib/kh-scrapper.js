const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const tableParser = require('cheerio-tableparser');
const fs = require('fs');

class Scrapper{
    init(){
        this.mixage = [];
        this.capacite = [];
        request('http://www.khdestiny.fr/kingdom-hearts-birth-by-sleep-mixage-commandes-magies.html', (err, res, data) =>{
            let $ = cheerio.load(data);
            tableParser($);
            let table = $('center center table.contenu_page').parsetable(true, true, true);
            var index = 0;
            for(let c in table[0]){
                if(c > 0) {
                    var name = table[0][c];
                    var colIngOne = table[1][c].split('\n');
                    var colIngTwo = table[2][c].split('\n');
                    var perso = table[3][c].split('\n');
                    var type = table[4][c].split('\n');
                    var percent = table[5][c].split('\n');
                    this.mixage.push({'name' : name,'id': index, 'recipe': []})

                    for(let f in colIngOne){
                        this.mixage[c - 1].recipe.push({
                            'first': colIngOne[f],
                            'second': colIngTwo[f],
                            'type': type[f],
                            'perso': perso[f],
                            'percent': percent[f]
                        })
                    }
                    index++;
                }
            }
            fs.writeFileSync('./output/mixage.json', JSON.stringify(this.mixage), 'utf-8');
        })

        request('http://www.khdestiny.fr/kingdom-hearts-birth-by-sleep-mixage-capacites.html', (err, res, data) =>{
            let $ = cheerio.load(data);
            tableParser($);
            let table = $('div.right_side center:nth-of-type(3) table.contenu_page').parsetable(true, true, true);
            for(let c in table[0]){
                if(c > 0) {
                    let type = table[0][c];
                    let chatoyant = table[1][c];
                    let fugace = table[2][c];
                    let vibrant = table[3][c];
                    let ressourcant = table[4][c];
                    let apaisant = table[5][c];
                    let affame = table[6][c];
                    let abondant = table[7][c];
                    this.capacite.push({
                        'type': type,
                        'cristal': {
                            'chatoyant': chatoyant,
                            'fugace': fugace,
                            'vibrant': vibrant,
                            'ressourcant': ressourcant,
                            'apaisant': apaisant,
                            'affame':affame,
                            'abondant': abondant
                        }
                    })
                }
            }
            fs.writeFileSync('./output/capacite.json', JSON.stringify(this.capacite), "utf-8");
        })
    }
}

module.exports = Scrapper;