import express from "express";
import { pool } from "../db/dbConfig.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
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
    next({
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    });
  } finally {
    if (client) client.release();
  }
});

router.get("/:id", async (req, res, next) => {
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

    return res.status(200).json({ error: null, data: response.rows });
  } catch (err) {
    next({
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    });
  } finally {
    if (client) client.release();
  }
});

export default router;
