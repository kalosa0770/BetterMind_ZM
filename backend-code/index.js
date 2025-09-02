const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const dbName = "bettermind_zm";
const client = new MongoClient(uri);

// This function connects to the database first, then starts the server.
async function startServer() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Successfully connected to MongoDB.");

    // The Express app will start listening only after the database connection is established.
    app.listen(port, () => {
      console.log(`Express app listening at http://localhost:${port}`);
      console.log("Visit the signup form in your browser and submit the form.");
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB. Server will not start.", err);
    process.exit(1);
  }
}

// The signup route handler is now simplified, as the connection is handled outside.
app.post('/api/users/signup', async (req, res) => {
  // --- DEBUGGING: Add a log at the very beginning of the route handler ---
  console.log('Received signup request.');

  const { firstName, lastName, email, password } = req.body;

  // --- DEBUGGING: Log the received data ---
  console.log('Request body:', req.body);


  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = client.db(dbName);
    const collection = db.collection('registers');

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      registrationDate: new Date(),
      status: "active"
    };

    const result = await collection.insertOne(newUser);
    
    res.status(201).json({ msg: 'Sign-up successful!', userId: result.insertedId });

  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during registration.");
  }
});

// Start the server
startServer();
