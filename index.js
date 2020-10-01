const express = require('express')
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8hyt.mongodb.net/emaJhonDb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: 1 });

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 7000

app.get('/', (req, res) => {
  res.send('Hello Ema!')
})

client.connect(err => {
  const productCollection = client.db("emaJhonDb").collection("products");
  const orderCollection = client.db("emaJhonDb").collection("order");
  // perform actions on the collection object
  //client.close();
    app.post('/addProduct', (req, res) => {
        const product = req.body 
        //console.log(product);
        productCollection.insertOne(product)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount)
            //res.redirect('/')
            // console.log(result)
            // res.send(result)
        })
    })

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:key', (req, res) => {
        productCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body
        productCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body 
        //console.log(product);
        orderCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
            //res.redirect('/')
            // console.log(result)
            // res.send(result)
        })
    })

});









app.listen(port)