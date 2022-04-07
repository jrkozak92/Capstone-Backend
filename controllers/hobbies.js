"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const postgres = require('../postgress.ts');
/**
*Get all
*/
router.get('/', (req, res) => {
    postgres.query('SELECT * FROM hobbies ORDER BY name ASC;', (err, hobbies) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(hobbies.rows);
        }
    });
});
/**
*Create New
*/
router.post('/', (req, res) => {
    postgres.query(`INSERT INTO hobbies (name, description, specs, aspectscores, keywords, resources) VALUES ('${req.body.name}', '${req.body.description}', '${JSON.stringify(req.body.specs)}', '${JSON.stringify(req.body.aspectscores)}', ARRAY[${req.body.keywords}], ARRAY[${req.body.resources}]);`, (err, insertedHobby) => {
        postgres.query('SELECT * FROM hobbies ORDER BY id desc LIMIT 1;', (err, newHobby) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(newHobby.rows);
                res.json(newHobby.rows);
            }
        });
    });
});
/**
*Get one
*/
router.get('/:id', (req, res) => {
    postgres.query(`SELECT * FROM hobbies WHERE id = ${req.params.id};`, (err, newHobby) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(newHobby.rows);
        }
    });
});
/**
*Delete by id
*/
router.delete('/:id', (req, res) => {
    postgres.query(`DELETE FROM hobbies WHERE id = ${req.params.id};`, (err, deletedHobby) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(deletedHobby.rows);
        }
    });
});
/**
*Update by id
* https://stackoverflow.com/questions/38883233/postgres-jsonb-set-multiple-keys-update
* complex update came from this article, super helpful
* If you handle SQL Injection, I think it will fix the ' issue
*/
router.put('/:id', (req, res) => {
    const query = {
        text: 'UPDATE hobbies SET name = $1, description = $2, specs = specs || $3, aspectscores = aspectscores || $4, keywords = ARRAY[$5], resources = ARRAY[$6] WHERE id = $7;',
        values: [req.body.name, req.body.description, JSON.stringify(req.body.specs), JSON.stringify(req.body.aspectscores), req.body.keywords, req.body.resources, Number(req.params.id)],
    };
    console.log(query);
    postgres.query(query, (err, updatedHobby) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(updatedHobby.rows);
        }
    });
});
module.exports = router;
