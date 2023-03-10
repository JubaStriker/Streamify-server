const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const { response } = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mpeq17q.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', (req, res) => {
    res.send('Streamify server is running');
})

app.listen(port, () => {
    console.log('Server is running on port', port);
})