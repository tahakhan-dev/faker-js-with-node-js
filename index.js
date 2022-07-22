// creating consumers

// const create_consumers = require('./data_creator/consumer')
// create_consumers.createFakeUsers(100000)

// creating accounts

// const create_accounts = require('./data_creator/account')
// create_accounts.createFakeAccounts()

// creating transaction

const create_transaction = require('./data_creator/transaction')
// for (let index = 1; index < 200; index++) {
    create_transaction.createFakeTransaction(100000)
// }
