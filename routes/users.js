import express from "express";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import { pool } from "../db/dbConfig.js";
import { getUsers } from "../handlers/users.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeRole("admin"), getUsers);

export default router;
