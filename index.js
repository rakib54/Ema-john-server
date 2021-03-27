const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000
app.use(bodyParser.json())
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnstore").collection("products");
    const ordersCollection = client.db("emaJohnstore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        console.log(product);
        productCollection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/product/:key', (req, res) => {
        productCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body
        productCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

});


app.listen(port)
