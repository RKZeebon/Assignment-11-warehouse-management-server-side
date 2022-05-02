const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401).send('Unauthorized access')
    }
    jwt.verify(authorization, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send('Forbidden access')
        }
        req.decoded = decoded
    })
    next()
}



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@rkzcomputercity.twgfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("computerCity").collection("products");


        // Add data to DB(post method);

        app.post('/product', async (req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.send(result)
        })


        // Get all data from DB(get method);

        app.get("/products", async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })


        // Get limited data from DB(get method);
        app.get("/sixproducts", async (req, res) => {
            const result = await productsCollection.find().limit(6).toArray()
            res.send(result)
        })
        // Get single data from DB by id(get method);

        app.get("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query);
            res.send(result)
        })

        // Get data from DB by email(get method);

        app.get("/userProducts", verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email === decodedEmail) {
                const q = { email: email }
                const result = await productsCollection.find(q).toArray();
                res.send(result)
            }
            else {
                res.status(403).send('Forbidden access')
            }
        })




        // update data of DB(put method);

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

        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })


        app.post('/login', async (req, res) => {
            const email = req.body
            const token = jwt.sign(email, process.env.ACCESS_TOKEN);

            res.send({ token })
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send('server is runing')
})

