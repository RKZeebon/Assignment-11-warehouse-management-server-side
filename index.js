const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log("listening to", port);
})