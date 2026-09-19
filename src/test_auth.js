const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);
const fs = require("fs");
const path = require("path");

const envText = fs.readFileSync(path.join(__dirname, "../.env"), "utf8");
envText.split("\n").forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    process.env[match[1]] = match[2].trim();
  }
});

const { MongoClient } = require("mongodb");

async function run() {
  const uri = process.env.MONGODB_URI;
  console.log("Connecting to MongoDB URI:", uri.replace(/:[^:@]+@/, ":***@"));
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    const db = client.db("tech-bazaar");
    const collections = await db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));

    const users = await db.collection("user").find({}).toArray();
    console.log("Users count in 'user' collection:", users.length);
    users.forEach(u => console.log("User:", u.email, "Role:", u.role, "ID:", u._id || u.id));
  } catch (err) {
    console.error("MongoDB Error:", err);
  } finally {
    await client.close();
  }
}

run();
