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

const { MongoClient, ObjectId } = require("mongodb");

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("tech-bazaar");

    // 1. Find a reference account password hash for Password123
    let refAccount = await db.collection("account").findOne({ password: { $exists: true } });
    if (!refAccount) {
      console.log("No existing password hash found!");
      return;
    }

    console.log("Found reference password hash:", refAccount.password);

    // 2. Ensure demo accounts exist in `user` & `account` collections
    const demoUsers = [
      { email: "buyer@techbazaar.com", role: "buyer", name: "Demo Buyer" },
      { email: "seller@techbazaar.com", role: "seller", name: "Demo Seller" },
      { email: "admin@techbazaar.com", role: "admin", name: "Demo Admin" },
      { email: "admin@gmail.com", role: "admin", name: "System Admin" }
    ];

    for (const d of demoUsers) {
      let u = await db.collection("user").findOne({ email: d.email });
      if (!u) {
        console.log(`Creating missing user: ${d.email}`);
        const res = await db.collection("user").insertOne({
          email: d.email,
          name: d.name,
          role: d.role,
          plan: "pro",
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        u = { _id: res.insertedId, email: d.email };
      } else {
        console.log(`Found user: ${d.email}, updating role to ${d.role}...`);
        await db.collection("user").updateOne(
          { _id: u._id },
          { $set: { role: d.role, name: d.name } }
        );
      }

      // Upsert account with matching password hash
      const acc = await db.collection("account").findOne({ userId: u._id, providerId: "credential" });
      if (!acc) {
        console.log(`Creating credential account for ${d.email}...`);
        await db.collection("account").insertOne({
          userId: u._id,
          accountId: u._id.toString(),
          providerId: "credential",
          password: refAccount.password, // Set valid password hash
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        console.log(`Updating credential account password for ${d.email}...`);
        await db.collection("account").updateOne(
          { _id: acc._id },
          { $set: { password: refAccount.password } }
        );
      }
    }

    console.log("Demo users & passwords updated successfully!");
  } finally {
    await client.close();
  }
}

run();
