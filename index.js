const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v73g3gy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        //  f
        const toysCollection = client.db('craft_ease').collection('toys')

        app.get('/allToys', async (req, res) => {
            const cursor = toysCollection.find().limit(20)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/allToys', async (req, res) => {
            const newToy = req.body;
            const result = await toysCollection.insertOne(newToy);
            res.send(result)
        })

        app.get('/viewDetails/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result)
        })

        app.get('/myToys', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = toysCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.patch('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const find = { _id: new ObjectId(id) }

            const updatedToy = req.body;
            const updateDoc = {
                $set: {
                    name: updatedToy.name,
                    image: updatedToy.image,
                    price: updatedToy.price,
                    rating: updatedToy.rating,
                    subCategory: updatedToy.subCategory,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description,
                    seller: updatedToy.seller,
                    email: updatedToy.email,
                },
            };

            const result = await toysCollection.updateOne(find, updateDoc);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// for chaeak 
app.get('/', (req, res) => {
    res.send('CreaftEase  is running')
})

app.listen(port, () => {
    console.log(`CreaftEase is running on port ${port}`)
})