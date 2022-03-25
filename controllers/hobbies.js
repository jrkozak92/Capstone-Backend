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
    console.log(req.body);
    postgres.query(`INSERT INTO hobbies (name, description) VALUES ('${req.body.name}', '${req.body.description}');`, (err, insertedHobby) => {
        postgres.query('SELECT * FROM hobbies ORDER BY id desc LIMIT 1;', (err, newHobby) => {
            if (err) {
                console.log(err);
            }
            else {
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
*/
router.put('/:id', (req, res) => {
    postgres.query(`UPDATE hobbies SET name = '${req.body.name}', description = '${req.body.description}' WHERE id = ${req.params.id};`, (err, updateHobby) => {
        postgres.query(`SELECT * FROM hobbies WHERE id = ${req.params.id};`, (err, updatedHobby) => {
            if (err) {
                console.log(err);
            }
            else {
                res.json(updatedHobby.rows);
            }
        });
    });
});
module.exports = router;
