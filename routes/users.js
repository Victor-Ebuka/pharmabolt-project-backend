import express from "express";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import {
  adminEditUser,
  editUser,
  getUsers,
  deleteUser,
} from "../handlers/users.js";
import validateSchema from "../middlewares/validateSchema.js";
import { updateUserSchema } from "../validationSchemas/users.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeRole("admin"), getUsers);

router.put(
  "/update",
  authenticateUser,
  validateSchema(updateUserSchema),
  editUser
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  validateSchema(updateUserSchema),
  adminEditUser
);

router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteUser);

export default router;
