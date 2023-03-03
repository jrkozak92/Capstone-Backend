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
    const postQuery = {
        text: 'INSERT INTO hobbies (name, description, specs, aspectscores, keywords, resources) VALUES ($1, $2, $3, $4, ARRAY[$5], ARRAY[$6])',
        values: [req.body.name, req.body.description, JSON.stringify(req.body.specs), JSON.stringify(req.body.aspectscores), req.body.keywords, req.body.resources],
    };
    postgres.query(postQuery, (err, insertedHobby) => {
        if (err) {
            console.log(err);
        }
        else {
            postgres.query('SELECT * FROM hobbies ORDER BY id desc LIMIT 1;', (err, newHobby) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(newHobby.rows);
                    res.json(newHobby.rows);
                }
            });
        }
    });
});
/**
*Get one
*/
router.get('/:id', (req, res) => {
    const getQuery = {
        text: 'SELECT * FROM hobbies WHERE id = $1',
        values: [req.params.id]
    };
    postgres.query(getQuery, (err, newHobby) => {
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
    const deleteQuery = {
        text: 'DELETE FROM hobbies WHERE id = $1',
        values: [req.params.id]
    };
    postgres.query(deleteQuery, (err, deletedHobby) => {
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
        values: [req.body.name, req.body.description, JSON.stringify(req.body.specs), JSON.stringify(req.body.aspectscores), req.body.keywords, req.body.resources, Number(req.params.id)]
    };
    console.log(query);
    postgres.query(query, (err, updatedHobby) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Post update Hobby: ", updatedHobby);
            const getQuery = {
                text: 'SELECT * FROM hobbies WHERE id = $1',
                values: [req.params.id]
            };
            postgres.query(getQuery, (err, postUpdateHobby) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Returning post update hobby of: ", postUpdateHobby);
                    res.json(postUpdateHobby.rows);
                }
            });
        }
    });
});
module.exports = router;
