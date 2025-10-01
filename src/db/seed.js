// src/db/seed.js
import "dotenv/config";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./client.js";

dotenv.config();

const adminUser = {
  id: crypto.randomUUID(),
  username: "adhim",
  email: "adhim@admin.com",
  plainPassword: "omkegams666",
  role: "ADMIN",
};

const productsToSeed = [
  { name: "Nasi Goreng Spesial", price: 25000, category: "FOOD", stock: 50 },
  { name: "Mie Goreng Seafood", price: 28000, category: "FOOD", stock: 40 },
  { name: "Ayam Bakar Madu", price: 35000, category: "FOOD", stock: 30 },
  { name: "Sate Ayam (10 tusuk)", price: 22000, category: "FOOD", stock: 60 },
  //
  { name: "Es Teh Manis", price: 5000, category: "BEVERAGE", stock: 100 },
  { name: "Jus Alpukat", price: 15000, category: "BEVERAGE", stock: 25 },
  { name: "Kopi Hitam", price: 8000, category: "BEVERAGE", stock: 80 },
  //
  { name: "Kentang Goreng", price: 12000, category: "SNACK", stock: 70 },
  { name: "Pisang Goreng Keju", price: 15000, category: "DESSERT", stock: 35 },
];

async function seedAdminUser(client) {
  console.log("Seeding admin user...");
  const hashedPassword = await bcrypt.hash(adminUser.plainPassword, 10);
  const existingUser = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [adminUser.email]
  );

  if (existingUser.rows.length > 0) {
    await client.query(
      "UPDATE users SET password = $1, role = $2, username = $3 WHERE email = $4",
      [hashedPassword, adminUser.role, adminUser.username, adminUser.email]
    );
    console.log(`User "${adminUser.username}" updated.`);
  } else {
    await client.query(
      "INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)",
      [
        adminUser.id,
        adminUser.username,
        adminUser.email,
        hashedPassword,
        adminUser.role,
      ]
    );
    console.log(`User "${adminUser.username}" created.`);
  }
  console.log("Admin user seeding finished.");
}

async function seedProducts(client) {
  console.log("Seeding products...");
  for (const product of productsToSeed) {
    const existingProduct = await client.query(
      "SELECT * FROM products WHERE name = $1",
      [product.name]
    );

    if (existingProduct.rows.length === 0) {
      await client.query(
        "INSERT INTO products (name, price, category, stock) VALUES ($1, $2, $3, $4)",
        [product.name, product.price, product.category, product.stock]
      );
      console.log(`Created product: "${product.name}"`);
    } else {
      console.log(`Product "${product.name}" already exists, skipping.`);
    }
  }
  console.log("Product seeding finished.");
}

async function main() {
  const client = await pool.connect();
  try {
    console.log("Starting database seeding process...");
    await client.query("BEGIN");
    await seedAdminUser(client);
    await seedProducts(client);
    await client.query("COMMIT");
    console.log("Seeding completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seeding failed. Rolling back changes:", error);
  } finally {
    client.release();
    await pool.end();
    console.log("db connection closed.");
  }
}

main();
