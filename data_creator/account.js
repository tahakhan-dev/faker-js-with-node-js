// const consumer_ids = require("../data/consumer_ids")
const { sql, connectionPool } = require("../db/connection");

const getFakeAccounts = () => {
    const account = [];
    for (let i = 1; i <= 3; i++) {
        let account_type, box_color, box_icon, title, bank_name
        if (i == 1) {
            account_type = "Cash"
            box_color = "#000000"
            box_icon = "bt_1"
            title = "Cash"
            bank_name = null
        }
        if (i == 2) {
            account_type = "Savings"
            box_color = "#000000"
            box_icon = "saving_icon"
            title = "Savings"
            bank_name = null
        }
        if (i == 3) {
            account_type = "Bank"
            box_color = null
            box_icon = "hbl_bank"
            title = "Habib Bank Limited"
            bank_name = "Habib Bank Limited"
        }
        for (let index = 75001; index <= 100000; index++) {
            const consumer_id = index
            let obj = {
                account_id: i,
                consumer_id: consumer_id,
                account_type: account_type,
                active: 1,
                balance_amount: 0,
                box_color: box_color,
                box_icon: box_icon,
                title: title,
                opening_balance: 0,
                is_sync: 0,
                device_type: 'android',
                bank_name: bank_name,
                sys_defined: 1,
            }
            account.push(obj)
        }
    }

    console.log(Object.keys(account).length);
    return chunks(Object.values(account), 1000);
};

const chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

const parse = (accountObjects) => {
    let stringifiedVals = '';
    accountObjects.forEach(account => {
        stringifiedVals = `${stringifiedVals},(${account.account_id}, ${account.consumer_id}, '${account.account_type}', ${account.active}, ${account.balance_amount}, '${account.box_color}', '${account.box_icon}', '${account.title}', ${account.opening_balance}, ${account.is_sync}, '${account.device_type}', '${account.bank_name}', ${account.sys_defined} )`;
    });
    return stringifiedVals.replace(',', '');
}

const addAccounts = async (data) => {
    const pool = await connectionPool;
    try {
        const request = await pool.request();
        const result = await request.query(`INSERT INTO hk_accounts (account_id, consumer_id, account_type, active, balance_amount, box_color, box_icon, title, opening_balance, is_sync, device_type, bank_name, sys_defined) VALUES ${data} ;`);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
    pool.close();
}

exports.createFakeAccounts = async () => {
    try {
        const fakeAccountChunks = getFakeAccounts();
        fakeAccountChunks.forEach(async chunk => {
            await addAccounts(parse(chunk));
        })
    } catch (ex) {
        console.error(ex);
    }
}
