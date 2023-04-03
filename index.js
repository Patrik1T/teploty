/* Připojení modulu frameworku Express */
const express = require("express");
/* Vytvoření základního objektu serverové aplikace */
const app = express();
/* Připojení externího modulu body-parser (https://www.npmjs.com/package/body-parser) -middleware pro parsování těla požadavku */
const bodyParser = require("body-parser");
/* Připojení externího modulu moment (https://momentjs.com/) -knihovna pro formátování datových a časových údajů */
const moment = require("moment");
/* Připojení externího modulu csvtojson (https://www.npmjs.com/package/csvtojson) -knihovna usnadňující načtení dat z CSV do formátu JSON */
const csvtojson = require('csvtojson');
/* Připojení vestavěných modulů fs (práce se soubory) a path (cesty v adresářové struktuře) */
const fs = require("fs");
const path = require("path");
/* Nastavení portu, na němž bude spuštěný server naslouchat */
const port = 3000;
/* Identifikace složky obsahující statické soubory klientské části webu */
app.use(express.static("public"));
/* Nastavení typu šablonovacího engine na pug*/
app.set("view engine", "pug");
/* Nastavení složky, kde budou umístěny šablony pug */
app.set("views", path.join(__dirname, "views"));
/* Spuštění webového serveru */
app.listen(port, () =>{console.log(`Server naslouchá na portu ${port}`);});
/* Využití modulu body-parser pro parsování těla požadavku */
const urlencodedParser = bodyParser.urlencoded({extended: false});
/* Ošetření požadavku poslaného metodou POST na adresu <server>/savedataUkládá data poslaná z webového formuláře do souboru CSV */
app.post('/savedata', urlencodedParser, (req, res) =>{
    /* Do proměnné date bude pomocí knihovny MomentJS uloženo aktuální datum v podobě YYYY-MM-DD (rok-měsíc-den) */
    let date = moment().format('DD-MM-YYYY');
    /* Vytvoření řetězce z dat odeslaných z formuláře v těle požadavku (req.body) a obsahu proměnné date.Data jsou obalena uvozovkami a oddělená čárkou. Escape sekvence \n provede ukončení řádku. */
    let str = `"${req.body.ukol}","${req.body.predmet}","${req.body.kdy}","${req.body.min}","${req.body.max}","${req.body.odevzdani}"\n`;
    /* Pomocí modulu fs a metody appendFile dojde k přidání připraveného řádku (proměnná str) do uvedeného souboru */
    fs.appendFile(path.join(__dirname, 'data/ukoly.csv'), str, function(err) {
        /* Když byla zaznamenána chyba při práci se souborem */
        if(err) {
            /* Vypsání chyby do konzole NodeJS (na serveru). */
            console.error(err);
            /* Odpovědí serveru bude stavová zpráva 400 a v hlavičce odpovědi budou odeslány upřesňující informace. */
            returnres.status(400).json({success: false,message: "Nastala chyba během ukládání souboru"
            });
        }
    });
            /* Přesměrování na úvodní stránku serverové aplikace včetně odeslání stavové zprávy 301. */
    res.redirect(301, '/');});
    /* Reakce na požadavek odeslaný metodou get na adresu <server>/todolist */
    app.get("/todolist", (req, res) => {
        csvtojson({ headers: ['ukol', 'predmet', 'kdy', 'min', 'max', 'odevzdani'] })
          .fromFile(path.join(__dirname, 'data/ukoly.csv'))
          .then(data => {
            res.render('index', { nadpis: "Seznam úkolů", ukoly: data });
          })
          .catch(err => {
            res.render('error', { nadpis: "Chyba v aplikaci", chyba: err });
          });
        });