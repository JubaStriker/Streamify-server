const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
require('dotenv').config();

//implement jwt token
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(express.json());

const multer = require("multer");
const firebase = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { query } = require('express');

const firebaseConfig = {
    apiKey: "AIzaSyAZ-WwrEgEy2CvzA_sEgJCOaB65NygeVhk",
    authDomain: "streamify-eb7bf.firebaseapp.com",
    projectId: "streamify-eb7bf",
    storageBucket: "streamify-eb7bf.appspot.com",
    messagingSenderId: "736524230575",
    appId: "1:736524230575:web:aa68be6aef03b0259b195a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = getStorage()
const upload = multer({ storage: multer.memoryStorage() });

const uri = "mongodb+srv://JubaStriker:Jubair12345@cluster0.wdwswcc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// --------- Upload videos to Firebase ------------ //

app.post('/uploadVideo', upload.single("filename"), (req, res) => {
    if (!req.file) {
        // No file was uploaded with the request
        res.status(400).send("No file uploaded.");
        return;
    }
    const storageRef = ref(storage, req.file.originalname);
    const metadata = {
        contentType: 'video/mp4'
    };
    uploadBytes(storageRef, req.file.buffer, metadata)
        .then(() => {
            getDownloadURL(storageRef).then(url => {
                res.send({ url });
            });
        })
        .catch(error => {
            console.error(error);
            console.log("Error uploading video")
            res.status(500).send(error);
        });
});

async function run() {
    try {
        const postsCollection = client.db('streamify').collection('posts');


        app.post('/saveVideo', async (req, res) => {
            const post = req.body;
            const result = await postsCollection.insertOne(post)
            res.send(result);
        });

        app.get('/videos', async (req, res) => {
            const query = {}
            const result = await postsCollection.find(query).toArray();
            res.send(result);
        })
    }
    finally {

    }

}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('API running');
})

app.listen(port, () => {
    console.log(`listening on ${port}`);
})