import express, { Application, Request, Response, NextFunction } from 'express'
const app: Application = express()

const hobbiesController = require('./controllers/hobbies')


//Middleware
app.use(express.json())
// app.use(cors())
app.use('/hobbies', hobbiesController)


//Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

//Start Server
app.listen(3000, () => {
  console.log('Listening on 3000');
})
