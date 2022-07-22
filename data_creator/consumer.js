const faker = require("faker");
const { sql, connectionPool } = require("../db/connection");

const getFakeUsers = (numberOfUsers) => {

    const users = {}; let user_id;
    for (let i = 0; i < numberOfUsers; i++) {
        user_id = i// faker.datatype.number({ min: 100, max: numberOfUsers });
        users[user_id] = {
            consumer_id: user_id,
            consumer_name: faker.name.findName().replace(/[~%&\\;:"',<>?#-.\s]/g, ""),
        }
    }
    console.log(Object.keys(users).length);
    return chunks(Object.values(users), 1000);
};

const chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

const parse = (userObjects) => {
    let stringifiedVals = '';
    userObjects.forEach(user => {
        stringifiedVals = `${stringifiedVals},(${user.consumer_id}, '${user.consumer_name}' )`;
    });
    return stringifiedVals.replace(',', '');
}

const addUsers = async (data) => {
    const pool = await connectionPool;
    try {
        const request = await pool.request();
        const result = await request.query(`INSERT INTO consumer_profile (consumer_id, consumer_name) VALUES ${data} ;`);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
    pool.close();
}

exports.createFakeUsers = async (numberOfUsers) => {
    try {
        const fakeUserChunks = getFakeUsers(numberOfUsers);
        fakeUserChunks.forEach(async chunk => {
            await addUsers(parse(chunk));
        })
    } catch (ex) {
        console.error(ex);
    }
}
