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



        // Get data from DB(get method);




        // update data of DB(put method);





        // delete data from DB(delete method);




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