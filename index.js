const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
// const mongoose = require("mongoose");
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// user : Lets-Drive
// pass: AZGJXqTX2Vzke8T

const uri =
  "mongodb+srv://Lets-Drive:AZGJXqTX2Vzke8T@cluster0.csq51.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("LetsDrive");
    const usersCollection = database.collection("riderCase");

    // GET API
    app.get("/riderCase", async (req, res) => {
      const cursor = usersCollection.find({});
      const rider = await cursor.toArray();
      res.send(rider);
    });

    // get with license number

    app.get("/riderCase/:licenseNumber", async (req, res) => {
      const licenseNumber = req.params.licenseNumber;
      const cursor = usersCollection.find({licenseNumber});
      const rider = await cursor.toArray();
      res.send(rider);
    })

    // post api
    app.post("/riderCase", async (req, res) => {
      const newCase = req.body;
      const result = await usersCollection.insertOne(newCase);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });

    // update Api
    app.put('/riderCase/:licenseNumber', async (req, res) => {
      const id = req.params.licenseNumber;
      const updateUser = req.body;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          casePurpose : updateUser.casePurpose,
          fine : updateUser.fine,
          date : updateUser.date
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })



    // delete api
    app.delete('/riderCase/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.deleteOne(query);

      console.log("deleted user with id", result);
      res.json(1);
    })

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my db yaa");
});

app.get("/welcome/:name", (req, res) => {
  const name = req.params.name;
  res.send("hello " + name);
});

app.listen(port, () => {
  console.log("Running server on", port);
});
