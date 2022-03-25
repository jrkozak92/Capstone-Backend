import express, { Request, Response} from 'express'
const router = express.Router()
const postgres = require('../postgress.ts')

interface Hobby {
  id: number,
  name: string,
  description: string
}

/**
*Get all
*/
router.get('/', (req: Request, res: Response) => {
  postgres.query('SELECT * FROM hobbies ORDER BY name ASC;', (err: any, hobbies: any) => {
    if (err) {
      console.log(err);
    } else {
      res.json(hobbies.rows)
    }
  })
})

/**
*Create New
*/
router.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  postgres.query(`INSERT INTO hobbies (name, description) VALUES ('${req.body.name}', '${req.body.description}');`, (err: any, insertedHobby: any) => {
    postgres.query('SELECT * FROM hobbies ORDER BY id desc LIMIT 1;', (err: any, newHobby: any) => {
      if (err) {
        console.log(err)
      } else {
        res.json(newHobby.rows)
      }
    })
  })
})

/**
*Get one
*/
router.get('/:id', (req: Request, res: Response) => {
  postgres.query(`SELECT * FROM hobbies WHERE id = ${req.params.id};`, (err: any, newHobby: any) => {
    if (err) {
      console.log(err)
    } else {
      res.json(newHobby.rows)
    }
  })
})

/**
*Delete by id
*/
router.delete('/:id', (req: Request, res: Response) => {
  postgres.query(`DELETE FROM hobbies WHERE id = ${req.params.id};`, (err: any, deletedHobby: any) => {
    if (err) {
      console.log(err)
    } else {
      res.json(deletedHobby.rows)
    }
  })
})

/**
*Update by id
*/
router.put('/:id', (req: Request, res: Response) => {
  postgres.query(`UPDATE hobbies SET name = '${req.body.name}', description = '${req.body.description}' WHERE id = ${req.params.id};`, (err: any, updateHobby: any) => {
    postgres.query(`SELECT * FROM hobbies WHERE id = ${req.params.id};`, (err: any, updatedHobby: any) =>
      if (err) {
        console.log(err)
      } else {
        res.json(updatedHobby.rows)
      }
    )
  })
})

module.exports = router
