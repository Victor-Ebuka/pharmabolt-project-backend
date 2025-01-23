import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../db/dbConfig.js";
/**
 * Registers a new user.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 * @returns {void|Array<Object>}
 */
export const registerUser = async (req, res, next) => {
  let client;
  try {
    const { full_name, email, phone_no, password, address, city, state } =
      req.body;
    const role = req.body.role || "user";

    client = await pool.connect();

    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      const error = new Error();
      error.status = 400;
      error.message = `User already exists. Please login.`;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await client.query(
      "INSERT INTO users (full_name, email, phone_no, password, address, city, state, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [full_name, email, phone_no, hashedPassword, address, city, state, role]
    );
    return res.status(201).json({ error: null, data: response.rows });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Logs in a user.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 * @returns {void}
 */
export const loginUser = async (req, res, next) => {
  let client;
  try {
    const { email, password } = req.body;
    client = await pool.connect();
    const response = await client.query(
      "SELECT id, password, role FROM users WHERE email = $1",
      [email]
    );

    if (response.rows.length === 0) {
      const error = new Error();
      error.status = 400;
      error.message = `Invalid Credentials`;
      throw error;
    }

    const user = response.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      const error = new Error();
      error.status = 400;
      error.message = `Invalid Credentials`;
      throw error;
    }

    console.log(user);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Middleware to authenticate a user by verifying their JWT token.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 * @returns {void|express.Response} Sends a 401 response if authentication fails.
 */
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

/**
 * Middleware to authorize a user based on their role.
 * @param {string} role - The required role for access (e.g., "admin").
 * @returns {Function} Middleware function to enforce role-based access control.
 */
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
    }
    next();
  };
};
