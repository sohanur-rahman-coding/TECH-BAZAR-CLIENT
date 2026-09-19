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
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("tech-bazaar");
    
    console.log("--- ACCOUNTS ---");
    const accounts = await db.collection("account").find({}).toArray();
    accounts.forEach(a => console.log("Account for userId:", a.userId, "providerId:", a.providerId));

    console.log("--- SESSIONS ---");
    const sessions = await db.collection("session").find({}).toArray();
    sessions.forEach(s => console.log("Session token:", s.token, "userId:", s.userId, "expiresAt:", s.expiresAt));

  } finally {
    await client.close();
  }
}

run();
