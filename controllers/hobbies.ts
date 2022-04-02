import express, { Request, Response} from 'express'
const router = express.Router()
const postgres = require('../postgress.ts')

interface Hobby {
  id: number,
  name: string,
  description: string,
  specs: {
      graphPath: string,
      initialInvestment: {
        amount: string,
        equipment: string
      },
      timePerSession: string,
      pickUpAndPlayAbility: string,
  },
  aspectScores: {
      intellectualChallenge: number,
      physicalChallenge: number,
      creativeFocus: number,
      technicalFocus: number,
      financialRequirement: number,
      soloVsGroup: number,
      problemSolvingVsExpression: number,
      desiredTimeInvestment: number,
      technicalBarrierToEntry: number,
  },
  keywords: [string],
  resources: [string]
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
  postgres.query(`INSERT INTO hobbies (name, description, specs, aspectscores, keywords, resources) VALUES ('${req.body.name}', '${req.body.description}', '${JSON.stringify(req.body.specs)}', '${JSON.stringify(req.body.aspectscores)}', ARRAY[${req.body.keywords}], ARRAY[${req.body.resources}]);`, (err: any, insertedHobby: any) => {
    postgres.query('SELECT * FROM hobbies ORDER BY id desc LIMIT 1;', (err: any, newHobby: any) => {
      if (err) {
        console.log(err)
      } else {
        console.log(newHobby.rows)
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
* https://stackoverflow.com/questions/38883233/postgres-jsonb-set-multiple-keys-update
* complex update came from this article, super helpful
*/
router.put('/:id', (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body.specs))
  postgres.query(`UPDATE hobbies SET name = '${req.body.name}', description = '${req.body.description}', specs = specs || '${JSON.stringify(req.body.specs)}', aspectscores = aspectscores || '${JSON.stringify(req.body.aspectscores)}', keywords = ARRAY[${req.body.keywords}], resources = ARRAY[${req.body.resources}] WHERE id = ${req.params.id};`, (err: any, updateHobby: any) => {
    postgres.query(`SELECT * FROM hobbies WHERE id = ${req.params.id};`, (err: any, updatedHobby: any) => {
      if (err) {
        console.log(err)
      } else {
        res.json(updatedHobby.rows)
      }
    })
  })
})

module.exports = router
