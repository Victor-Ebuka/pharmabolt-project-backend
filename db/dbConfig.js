import pg from "pg";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const sslCertificate = readFileSync("db/us-east-1-bundle.pem");

export const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: sslCertificate,
  },
});
