import express from "express";
import { pool } from "../db/dbConfig.js";

/**
 * Gets all users from db. Must have 'admin' role to access.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 * @param
 */
export const getUsers = async (req, res, next) => {
  let client;
  try {
    client = await pool.connect();
    const response = await client.query("SELECT * FROM users");

    return res.status(200).json({ error: null, data: response.rows });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
