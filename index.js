const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@rkzcomputercity.twgfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("computerCity").collection("products");
        console.log("connected to db");



        // Add data to DB(post method);
        // https://guarded-gorge-33419.herokuapp.com/product
        app.post('/product', async (req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.send(result)
        })


        // Get all data from DB(get method);
        // https://guarded-gorge-33419.herokuapp.com/products
        app.get("/products", async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })


        // Get limited data from DB(get method);
        // https://guarded-gorge-33419.herokuapp.com/sixproducts
        app.get("/sixproducts", async (req, res) => {
            const result = await productsCollection.find().limit(6).toArray()
            res.send(result)
        })



        // Get single data from DB by id(get method);
        // https://guarded-gorge-33419.herokuapp.com/product/${id}
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query);
            res.send(result)
        })


        // Get single data from DB by email(get method);
        // https://guarded-gorge-33419.herokuapp.com/product
        app.get("/product", async (req, res) => {
            const email = req.body.email
            const query = { email }
            const result = await productsCollection.findOne(query);
            res.send(result)
        })




        // update data of DB(put method);
        // https://guarded-gorge-33419.herokuapp.com/product/${id}
        app.put("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const data = req.body;
            const updateData = { $set: data };
            const option = { upsert: true }
            const result = await productsCollection.updateOne(query, updateData, option);
            res.send(result)
        })




        // delete data from DB(delete method);
        // https://guarded-gorge-33419.herokuapp.com/product/${id}
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log("server connected");
//     // perform actions on the collection object
//     //   client.close();
// });






app.get("/", (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log("listening to", port);
})