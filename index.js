const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient('mongodb://127.0.0.1:27017');
const ObjectId = require('mongodb').ObjectId;

app.use(express.json());

async function start() {
    await MongoClient.connect('mongodb://127.0.0.1:27017', (err) => {
        if (err) {
            return console.log(err);
        }
    });
    app.get('/', async (req, res) => {
        try {
            const connection = await mongoClient.connect();
            const db = await connection.db('ToDo');
            const data = await db.collection('Users').aggregate().toArray();
            res.send(data);
            connection.close();
        } catch (err) {
            console.log(err);
        }
    });

    app.get('/:id', async (req, res) => {
        try {
            connection = await mongoClient.connect();
            const db = await connection.db('ToDo');
            const data = await db
                .collection('Users')
                .findOne({ _id: new ObjectId(req.params.id) });
            res.send(data);
            connection.close();
        } catch (err) {
            console.log(err);
        }
    });

    app.post('/', async (req, res) => {
        try {
            connection = await mongoClient.connect();
            const db = await connection.db('ToDo');
            await db.collection('Users').insertOne(req.body);
            res.send(req.body);
            connection.close();
        } catch (err) {
            console.log(err);
        }
    });

    app.put('/edit/:id', async (req, res) => {
        try {
            connection = await mongoClient.connect();
            const db = await connection.db('ToDo');
            const updateResult = await db
                .collection('Users')
                .updateOne(
                    { _id: new ObjectId(req.params.id) },
                    { $set: req.body }
                );
            res.send(req.body);
            connection.close();
        } catch (err) {
            console.log(err);
        }
    });

    app.delete('/delete/:id', async (req, res) => {
        try {
            connection = await mongoClient.connect();
            const db = await connection.db('ToDo');
            await db
                .collection('Users')
                .deleteOne({ _id: new ObjectId(req.params.id) });
            res.send('done');
            connection.close();
        } catch (err) {
            console.log(err);
        }
    });

    app.listen(3012, () => {
        console.log('API app started');
    });
}
start();
