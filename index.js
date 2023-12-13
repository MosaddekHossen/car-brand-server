const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());

// CRUD Operations 
const uri = `mongodb+srv://${process.env.BRAND_USER}:${process.env.BRAND_PASS}@atlascluster.nqtfzbx.mongodb.net/?retryWrites=true&w=majority`;

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

        const brandCollection = client.db('brandDB').collection('brand');
        const cartCollection = client.db('brandDB').collection('cart')

        // Create
        app.post('/brand', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await brandCollection.insertOne(newBrand);
            res.send(result);
        })

        // Read
        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Get Name
        app.get('/brandName/:name', async (req, res) => {
            const name = req.params.name;
            const query = { name: name };
            const result = await brandCollection.find(query).toArray();
            res.send(result);
        });

        // Get Details 
        app.get('/brand/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandCollection.findOne(query);
            res.send(result);
        })

        // Update
        app.put('/brand/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const upDatedBrand = req.body;
            const product = {
                $set: {
                    name: upDatedBrand.name,
                    brandName: upDatedBrand.brandName,
                    type: upDatedBrand.type,
                    price: upDatedBrand.price,
                    des: upDatedBrand.des,
                    rating: upDatedBrand.rating,
                    image: upDatedBrand.image

                }
            }
            const result = await brandCollection.updateOne(filter, product, options);
            res.send(result);
        })

        // Create Cart route
        app.post('/brands', async (req, res) => {
            const cart = req.body;
            // console.log(cart);
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        })

        // Get cart route
        app.get('/brands/:email', async (req, res) => {
            const userEmail = req.params.email;
            const result = await cartCollection.find({ email: userEmail }).toArray();
            res.send(result);
        })

        // Delete
        app.delete('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Brand making server is running!');
})

app.listen(port, () => {
    console.log(`Brand server is running on port: ${port}`)
})