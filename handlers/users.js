import express from "express";
import { pool } from "../db/dbConfig.js";

/**
 * Gets all users from db.
 * Must have 'admin' role to access.
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

/**
 * Edits a user's details in the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 * @param
 */
export const editUser = async (req, res, next) => {
  let client;
  try {
    const user = req.user;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      const error = new Error();
      error.status = 400;
      error.message = "No fields to update.";
      throw error;
    }

    const keys = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE users SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`;

    client = await pool.connect();
    const response = await client.query(query, [...values, user.id]);

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Edits a user's details in the db.
 * Must have 'admin' role to access.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const adminEditUser = async (req, res, next) => {
  let client;
  try {
    const user_id = parseInt(req.params.id, 10);
    if (isNaN(user_id)) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid ID format";
      throw error;
    }

    client = await pool.connect();
    const userResponse = await client.query(
      "SELECT * FROM users WHERE id = $1",
      [user_id]
    );

    if (userResponse.rows.length === 0) {
      const error = new Error();
      error.status = 404;
      error.message = `No user with id ${user_id} was found`;
      throw error;
    }

    const user = userResponse.rows[0];
    const updates = req.body;

    if (!Object.keys(updates).length) {
      const error = new Error();
      error.status = 400;
      error.message = "No fields to update.";
      throw error;
    }

    const keys = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE users SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`;

    const response = await client.query(query, [...values, user.id]);

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Deletes a user's details from the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const deleteUser = async (req, res, next) => {
  let client;
  try {
    const user_id = parseInt(req.params.id, 10);
    if (isNaN(user_id)) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid ID format";
      throw error;
    }

    client = await pool.connect();
    const userResponse = await client.query(
      "SELECT * FROM users WHERE id = $1",
      [user_id]
    );

    if (userResponse.rows.length === 0) {
      const error = new Error();
      error.status = 404;
      error.message = `No user with id ${user_id} was found`;
      throw error;
    }

    const response = await client.query("DELETE FROM users WHERE id = $1", [
      user_id,
    ]);

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
