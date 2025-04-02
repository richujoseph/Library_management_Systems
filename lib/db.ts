
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in environment variables.");
  }
  
export const db = neon(process.env.DATABASE_URL);


const createSchema = async () => {
  try {
      await db`CREATE TABLE IF NOT EXISTS USERS (
          ID SERIAL PRIMARY KEY,
          NAME TEXT NOT NULL,
          EMAIL TEXT UNIQUE NOT NULL,
          PASSWORD TEXT NOT NULL
      )`;
      console.log("Users table checked/created successfully!");
  } catch (error) {
      console.error("Error creating table:", error);
  }
};

createSchema();