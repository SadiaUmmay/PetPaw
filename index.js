const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 4000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://petpaw:e1KrIAQHTyPCOer9@cluster0.yfrfj.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("petpaw");
    const serviceCollection = db.collection("service");
       const ordercollection=db.collection("orders");
    

    
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send({ success: true, insertedId: result.insertedId });
    });

    app.get("/service", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

   app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      
      const service = await serviceCollection.findOne({ _id: new ObjectId(id) });
      res.send(service);
    });


    app.post('/orders',async(req,res)=>{
  const data=req.body
  const result=await ordercollection.insertOne(data)
  res.status(201).send(result)
  console.log(result);
  

})

app.get("/orders", async (req, res) => {
  try {
    const result = await ordercollection.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

    app.get("/mylistings", async (req, res) => {
      const { email } = req.query;
      const query = email ? { email: email } : {};
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });


    // UPDATE service (PUT)
app.put("/mylistings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedService = req.body;

    const result = await serviceCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedService }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Service not found!" });
    }

    res.send({ success: true, message: "Service updated successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to update service" });
  }
});

// DELETE service 
app.delete("/mylistings/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await serviceCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Service not found!" });
    }

    res.send({ success: true, message: "Service deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to delete service" });
  }
});



    // Test ping
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected ✔");
  } catch (error) {
    console.error(error);
  } finally {
   
  }
}



run().catch(console.dir);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello Developer!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
