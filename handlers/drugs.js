import express from "express";
import { pool } from "../db/dbConfig.js";

/**
 * Fetches all drugs from the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const getDrugs = async (req, res, next) => {
  let client;
  try {
    client = await pool.connect();

    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const response = await client.query(
      "SELECT * FROM drugs ORDER BY name ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    return res.status(200).json({ error: null, data: response.rows });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Fetches one drug from the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const getDrug = async (req, res, next) => {
  let client;
  try {
    const d_id = parseInt(req.params.id, 10);
    if (isNaN(d_id)) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid ID format";
      throw error;
    }

    client = await pool.connect();
    const response = await client.query("SELECT * FROM drugs WHERE id = $1", [
      d_id,
    ]);

    if (response.rows.length === 0) {
      const error = new Error(`No drug with id ${d_id} was found`);
      error.status = 404;
      throw error;
    }

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Adds a drug to the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const addDrug = async (req, res, next) => {
  let client;
  try {
    const { name, description, price, stock } = req.body;
    client = await pool.connect();
    const drugResponse = await client.query(
      "SELECT * FROM drugs WHERE name ILIKE $1",
      [name]
    );

    if (drugResponse.rows.length !== 0) {
      const error = new Error();
      error.status = 400;
      error.message = `Drug with name ${name} already exists.`;
      throw error;
    }

    const response = await client.query(
      "INSERT INTO drugs (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, stock]
    );

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Updates a drug in the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const updateDrug = async (req, res, next) => {
  let client;
  try {
    const d_id = parseInt(req.params.id, 10);
    if (isNaN(d_id)) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid ID format";
      throw error;
    }

    client = await pool.connect();
    const drugResponse = await client.query(
      "SELECT * FROM drugs WHERE id = $1",
      [d_id]
    );

    if (drugResponse.rows.length === 0) {
      const error = new Error();
      error.status = 404;
      error.message = `No drug with id ${d_id} was found`;
      throw error;
    }

    const drug = drugResponse.rows[0];
    const updates = req.body;

    if (!Object.keys(updates).length) {
      const error = new Error();
      error.status = 400;
      error.message = "No fields to update.";
      throw error;
    }

    if (updates.hasOwnProperty("name")) {
      const drugNameResponse = await client.query(
        "SELECT * FROM drugs WHERE name ILIKE $1",
        [updates.name]
      );

      if (drugNameResponse.rows.length !== 0) {
        const error = new Error();
        error.status = 400;
        error.message = `Drug with name ${updates.name} already exists.`;
        throw error;
      }
    }

    const keys = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE drugs SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`;

    const response = await client.query(query, [...values, drug.id]);

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

/**
 * Deletes a drug from the db.
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @param {express.NextFunction} next - The callback to the next middleware function.
 */
export const deleteDrug = async (req, res, next) => {
  let client;
  try {
    const d_id = parseInt(req.params.id, 10);
    if (isNaN(d_id)) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid ID format";
      throw error;
    }

    client = await pool.connect();
    const drugResponse = await client.query(
      "SELECT * FROM drugs WHERE id = $1",
      [d_id]
    );

    if (drugResponse.rows.length === 0) {
      const error = new Error(`No drug with id ${d_id} was found`);
      error.status = 404;
      throw error;
    }

    const drug = drugResponse.rows[0];
    const response = await client.query(
      "DELETE FROM drugs WHERE id = $1 RETURNING *",
      [drug.id]
    );

    return res.status(200).json({ error: null, data: response.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};
