const { MongoClient } = require('mongodb');

describe('insert', () => {
    let connection;
    let db;

    beforeAll(async() => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
        });
        db = await connection.db(global.__MONGO_DB_NAME__);
    });

    afterAll(async() => {
        await connection.close();
        await db.close();
    });

    it('should insert a doc into collection', async() => {
        const users = db.collection('users');

        const mockUser = { _id: 'some-user-id', name: 'John' };
        await users.insertOne(mockUser);

        const insertedUser = await users.findOne({ _id: 'some-user-id' });
        expect(insertedUser).toEqual(mockUser);
    });
});

// const MongoDB = require("mongodb").MongoClient,
//  dbURL = "mongodb://localhost:27017",
//  dbName = "recipe_db";
// MongoDB.connect(dbURL, (error, client) => {
//  if (error) throw error;
//  let db = client.db(dbName);
//  db.collection("contacts")
//  .find()
//  .toArray((error, data) => {
// if (error) throw error;
// console.log(data);
//  });
// });
// db.collection("contacts")
//  .insert({
//  name: "Freddie Mercury",
//  email: "fred@queen.com"
//  }, (error, db) => {
//  if (error) throw error;
//  console.log(db);
//  });