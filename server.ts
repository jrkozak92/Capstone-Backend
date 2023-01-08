import express, { Application, Request, Response, NextFunction } from 'express'
const app: Application = express()
const cors = require('cors')
require('dotenv').config()
const hobbiesController = require('./controllers/hobbies')
const PORT: number | string = process.env.PORT || 3003

//Middleware
app.use(express.json())
app.use(cors())
app.use('/hobbies', hobbiesController)


//Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

//Start Server
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
})
