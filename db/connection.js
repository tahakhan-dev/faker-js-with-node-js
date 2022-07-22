const sql = require('mssql')
const config = {
    user: 'sa',
    password: 'Rand0mPass',
    database: 'hk_db_dev',
    server: '34.93.110.6',
    port: 30373,
    pool: {
      max: 99999,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
module.exports = {
  sql, connectionPool: poolPromise
}