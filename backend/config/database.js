// // backend/config/database.js
// // MongoDB connection configuration

// import { MongoClient } from "mongodb";
// import dns from "dns";
// import dotenv from "dotenv";

// // Load .env file
// dotenv.config();

// let db = null;
// let client = null;

// dns.setDefaultResultOrder("ipv4first");

// export async function connectDB() {
//   try {
//     const dnsPromises = await import("dns/promises");
//     dnsPromises.setServers(["8.8.8.8", "1.1.1.1"]);

//     if (!process.env.MONGODB_URI) {
//       throw new Error("MONGODB_URI missing in .env file!");
//     }

//     client = new MongoClient(process.env.MONGODB_URI, {
//       family: 4,
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//       maxPoolSize: 10,
//       minPoolSize: 2,
//       tls: true,
//       retryWrites: true,
//     });

//     await client.connect();
//     db = client.db("assis_auth");

//     console.log("✅ CONNECTED:", db.databaseName);
//     const collections = await db.listCollections().toArray();
//     console.log("📦 Collections:", collections.map((c) => c.name));

//     return db;
//   } catch (err) {
//     console.error("❌ DB CONNECT FAILED:", err.message);
//     process.exit(1);
//   }
// }

// export function getDB() {
//   if (!db) {
//     throw new Error("Database not initialized. Call connectDB first.");
//   }
//   return db;
// }

// export { db, client };


// backend/config/database.js
// MongoDB connection configuration

import { MongoClient } from "mongodb";
import dns from "dns";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

let db = null;
let client = null;

dns.setDefaultResultOrder("ipv4first");

export async function connectDB() {
  try {
    const dnsPromises = await import("dns/promises");
    dnsPromises.setServers(["8.8.8.8", "1.1.1.1"]);

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing in .env file!");
    }

    client = new MongoClient(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      tls: true,
      retryWrites: true,
    });

    await client.connect();
    db = client.db("assis_auth");

    console.log("✅ CONNECTED:", db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log("📦 Collections:", collections.map((c) => c.name));

    return db;
  } catch (err) {
    console.error("❌ DB CONNECT FAILED:", err.message);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

export { db, client };