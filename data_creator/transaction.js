const faker = require("faker");
const categories = require("../data/categories")
const accounts = require("../data/accounts")

const { sql, connectionPool } = require("../db/connection");

const getFakeTransaction = (numberOfTransaction) => {
    const transactions = {};

    let vch_amount, use_case_title, category_id, voucher_id, consumer_id, vch_type, category_name, account_name, vch_date, vch_year, vch_month, vch_day, vch_created_on, account_id;

    for (let i = 0; i < numberOfTransaction; i++) {
        voucher_id = i//faker.datatype.number({ min: min, max: max });
        consumer_id = faker.datatype.number({ min: 1, max: 100000 });

        var category = categories[Math.floor(Math.random() * categories.length)];
        var account = accounts[Math.floor(Math.random() * accounts.length)];
        // faker.date.past(2)
        vch_type = category.type
        use_case_title = category.type
        category_id = category.category_id
        category_name = category.title
        account_id = account.account_id
        account_name = account.account_name
        vch_amount = faker.datatype.number({ min: 99, max: 999999 });
        if (category.type == 'Expense') {
            vch_amount = -Math.abs(vch_amount);
        }
        vch_created_on = faker.date.past(1)
        record_created_on = vch_created_on
        vch_day = vch_created_on.getDay();          // Monday
        vch_date = vch_created_on.getDate();        // 24
        vch_month = vch_created_on.getMonth();     // 10 (Month is 0-based, so 10 means 11th Month)
        vch_year = vch_created_on.getFullYear();   // 2020

        transactions[voucher_id] = {
            voucher_id: voucher_id,
            consumer_id: consumer_id,
            vch_type: vch_type,
            use_case_title: use_case_title,
            category_id: category_id,
            category_name: category_name,
            account_id: account_id,
            account_name: account_name,
            vch_amount: vch_amount,
            vch_year: vch_year,
            vch_month: vch_month,
            vch_day: vch_day,
            vch_date: `${vch_year}-${vch_month}-${vch_day}`,
            vch_created_on: null,
            vch_active: 1,
            vch_ref_no: 1,
            fc_amount: 0,
            travel_mode: 0,
            vch_currency: 'PKR',
            event_id: 0,
            device_type: 'Android',
            record_created_on: null,
            is_sync: 0,
            vch_no: 0,
            use_case_id: 0,
            account_id_to: 0,
            vch_quarter: 1,
            is_system: 1
        }
    }
    console.log(Object.keys(transactions).length);
    return chunks(Object.values(transactions), 1000);
};

const chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

const parse = (transactionObjects) => {
    let stringifiedVals = '';
    transactionObjects.forEach(transaction => {
        stringifiedVals = `${stringifiedVals},(${transaction.voucher_id}, ${transaction.consumer_id}, '${transaction.vch_type}', '${transaction.use_case_title}', ${transaction.category_id}, '${transaction.category_name}', ${transaction.account_id}, '${transaction.account_name}', ${transaction.vch_amount}, ${transaction.vch_year}, ${transaction.vch_month}, ${transaction.vch_day}, ${transaction.vch_date}, ${transaction.vch_created_on}, ${transaction.vch_active}, ${transaction.vch_ref_no}, ${transaction.fc_amount}, ${transaction.travel_mode}, '${transaction.vch_currency}', ${transaction.event_id}, '${transaction.device_type}', ${transaction.record_created_on}, ${transaction.is_sync}, ${transaction.vch_no}, ${transaction.use_case_id}, ${transaction.account_id_to}, ${transaction.vch_quarter}, ${transaction.is_system} )`;

        //stringifiedVals = `${stringifiedVals},(${transaction.voucher_id}, ${transaction.consumer_id}, ${transaction.vch_type}, ${transaction.use_case_title}, ${transaction.category_id}, ${transaction.category_name}, ${transaction.account_id}, ${transaction.account_name}, ${transaction.vch_amount}, ${transaction.vch_year}, ${transaction.vch_month}, ${transaction.vch_day}, ${transaction.vch_date}, ${transaction.vch_created_on}, ${transaction.vch_active}, ${transaction.vch_ref_no}, ${transaction.fc_amount}, ${transaction.travel_mode}, ${transaction.vch_currency}, ${transaction.event_id}, ${transaction.device_type}, ${transaction.record_created_on}, ${transaction.is_sync}, ${transaction.vch_no}, ${transaction.use_case_id}, ${transaction.account_id_to}, ${transaction.vch_quarter}, ${transaction.is_system} )`;
    });
    return stringifiedVals.replace(',', '');
}

const addTransaction = async (data) => {
    const pool = await connectionPool;
    try {
        const request = await pool.request();
        const result = await request.query(`INSERT INTO hk_transactions (voucher_id, consumer_id, vch_type, use_case_title, category_id, category_name, account_id, account_name, vch_amount, vch_year, vch_month, vch_day, vch_date, vch_created_on, vch_active, vch_ref_no, fc_amount, travel_mode, vch_currency, event_id, device_type, record_created_on, is_sync, vch_no, use_case_id, account_id_to, vch_quarter, is_system) VALUES ${data} ;`);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
    pool.close();
}

exports.createFakeTransaction = async (numberOfTransaction) => {
    try {
        // let array_length = numberOfTransaction / 1000
        // let min = 1, max = 100
        // for (let index = 0; index < array_length; index++) {
        const fakeAccountChunks = getFakeTransaction(numberOfTransaction);
        fakeAccountChunks.forEach(async chunk => {
            // console.log(parse(chunk))
            await addTransaction(parse(chunk));
        })
        //     min = max
        //     max = max + 100
        // }
    } catch (ex) {
        console.error(ex);
    }
}
