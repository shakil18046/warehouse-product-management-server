const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// middlewere
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DATABSE_NAME}:${process.env.DATABASE_PASS}@cluster0.wwwi6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    await client.connect();
    const collection = client.db("grocery-product").collection("product");
    console.log("mongo connect")

    app.post("/product",async (req,res)=>{
      const addProduct = req.body;
      console.log(addProduct);
      const product = await collection.insertOne(addProduct);
      res.send(product)
    });
    app.get("/product", async (req,res)=>{
      const query = {};
      const cursor = collection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    app.delete("/product/:id", async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      console.log(query)
      const result = await collection.deleteOne(query);
      res.send(result);
    })
    app.get("/product/:id", async (req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await collection.findOne(query);
      res.send(product);

    })
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              quantity: data.quantity
          },

      };

      const result = await collection.updateOne(filter, updateDoc, options);
      res.send(result)

  })
  }finally{

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
