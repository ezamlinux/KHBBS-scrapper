const request = require('request');
const cheerio = require('cheerio');
const tableParser = require('cheerio-tableparser');

class Scrapper
{
    getDataByUrl(p_url, p_selector)
    {
        return new Promise(resolve => {
            request({
                'uri': p_url,
                'method': 'GET',
                'encoding' : 'binary'
            },(err, res, data) => {
                let $ = cheerio.load(data);
                tableParser($);
                let table = $(p_selector).parsetable(true, true, true);
                resolve(table);
            })
        })
    }

    init()
    {
        return new Promise( resolve => {
            let mix = this.getDataByUrl("http://www.khdestiny.fr/kingdom-hearts-birth-by-sleep-mixage-commandes-magies.html", 'center center table.contenu_page')
            let cap = this.getDataByUrl("http://www.khdestiny.fr/kingdom-hearts-birth-by-sleep-mixage-capacites.html", 'div.right_side center:nth-of-type(3) table.contenu_page')
            Promise.all([mix, cap])
                .then(values => {
                    let mixage = [];
                    let capacite = [];

                    let data = values[0];
                    let cristal = values[1];

                    let sort = []
                    //cristal
                    for(let c in cristal[0]){
                        if(c > 0) {
                            capacite.push({
                                'type': cristal[0][c],
                                'cristal': {
                                    'chatoyant': cristal[1][c],
                                    'fugace': cristal[2][c],
                                    'vibrant': cristal[3][c],
                                    'ressourcant': cristal[4][c],
                                    'apaisant': cristal[5][c],
                                    'affame': cristal[6][c],
                                    'abondant': cristal[7][c]
                                }
                            })
                        }
                    }
                    // Mixage
                    for(let c in data[0]){
                        if(c > 0) {
                            var name = data[0][c];
                            // console.log(name);
                            sort.push(name);
                            var colIngOne = data[1][c].split('\n');
                            var colIngTwo = data[2][c].split('\n');
                            var perso = data[3][c].split('\n');
                            var type = data[4][c].split('\n');
                            // remove dot of perso ( T.. => T)
                            var percent = data[5][c].replace(/\./g, '').split('\n');
                            mixage.push({'name': name, 'id': (c - 1), 'recipe': []})
        
                            for(let f in colIngOne){
                                let cristal;
                                for(let i in capacite){
                                    if(capacite[i].type == type[f]){
                                        cristal = capacite[i].cristal;
                                    }
                                }
                                sort.push(colIngOne[f]);
                                sort.push(colIngTwo[f]);
                                mixage[c - 1].recipe.push({
                                    'first': colIngOne[f],
                                    'second': colIngTwo[f],
                                    'cristal': cristal,
                                    'perso': perso[f],
                                    'percent': percent[f]
                                })
                            }
                        }
                    }
                    resolve(mixage);
                })
        })
    }  
}

module.exports = Scrapper;