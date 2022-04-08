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
  aspectscores: {
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
  const postQuery = {
    text: 'INSERT INTO hobbies (name, description, specs, aspectscores, keywords, resources) VALUES ($1, $2, $3, $4, ARRAY[$5], ARRAY[$6])',
    values: [req.body.name, req.body.description, JSON.stringify(req.body.specs), JSON.stringify(req.body.aspectscores), req.body.keywords, req.body.resources],
  }
  postgres.query(postQuery, (err: any, insertedHobby: any) => {
    if (err){
      console.log(err)
    } else {
      postgres.query('SELECT * FROM hobbies ORDER BY id desc LIMIT 1;', (err: any, newHobby: any) => {
        if (err) {
          console.log(err)
        } else {
          console.log(newHobby.rows)
          res.json(newHobby.rows)
        }
      })
    }
  })
})

/**
*Get one
*/
router.get('/:id', (req: Request, res: Response) => {
  const getQuery = {
    text: 'SELECT * FROM hobbies WHERE id = $1',
    values: [req.params.id]
  }
  postgres.query(getQuery, (err: any, newHobby: any) => {
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
  const deleteQuery = {
    text:'DELETE FROM hobbies WHERE id = $1',
    values:[req.params.id]
  }
  postgres.query(deleteQuery, (err: any, deletedHobby: any) => {
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
* If you handle SQL Injection, I think it will fix the ' issue
*/

router.put('/:id', (req: Request, res: Response) => {
  const query = {
    text: 'UPDATE hobbies SET name = $1, description = $2, specs = specs || $3, aspectscores = aspectscores || $4, keywords = ARRAY[$5], resources = ARRAY[$6] WHERE id = $7;',
    values: [req.body.name, req.body.description, JSON.stringify(req.body.specs), JSON.stringify(req.body.aspectscores), req.body.keywords, req.body.resources, Number(req.params.id)],
  }
  console.log(query)  
  postgres.query(query, (err: any, updatedHobby: any) => {
    if (err) {
      console.log(err)
    } else {
      const getQuery = {
        text: 'SELECT * FROM hobbies WHERE id = $1',
        values: [req.params.id]
      }
      postgres.query(getQuery, (err: any, postUpdateHobby: any) => {
        if (err) {
          console.log(err)
        } else {
          res.json(postUpdateHobby.rows)
        }
      })
    }
  })
})

module.exports = router
