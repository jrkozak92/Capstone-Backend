const { Pool } = require('pg')

const pool = new Pool({
  user: 'joey',
  host: 'localhost',
  database: 'hobby',
  password: '',
  port: 5432
})

module.exports = pool
