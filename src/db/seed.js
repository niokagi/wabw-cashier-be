import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./client.js";

dotenv.config();

const adminUser = {
  id: crypto.randomUUID(),
  username: "admin",
  email: "admin@gmail.com",
  plainPassword: "admin12345678",
  role: "ADMIN",
};

async function seed() {
  try {
    console.log(`Hashing password for user: ${adminUser.username}...`);
    const hashedPassword = await bcrypt.hash(adminUser.plainPassword, 10);

    console.log(`Checking if user ${adminUser.email} exists...`);
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [adminUser.email]
    );

    if (existingUser.rows.length > 0) {
      console.log("User exists. Updating data to ensure consistency...");
      await pool.query(
        "UPDATE users SET password = $1, role = $2, username = $3 WHERE email = $4",
        [hashedPassword, adminUser.role, adminUser.username, adminUser.email]
      );
      console.log("User admin has been updated successfully.");
    } else {
      console.log("User does not exist. Creating new admin user...");
      await pool.query(
        "INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)",
        [
          adminUser.id,
          adminUser.username,
          adminUser.email,
          hashedPassword,
          adminUser.role,
        ]
      );
      console.log("User admin has been created successfully.");
    }
  } catch (error) {
    console.error("An error occurred during the seeding process:", error);
  } finally {
    console.log("Seeder finished. Closing database connection.");
    await pool.end();
  }
}

seed();
