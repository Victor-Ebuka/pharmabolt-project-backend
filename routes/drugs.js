import express from "express";
import {
  addDrug,
  getDrug,
  getDrugs,
  updateDrug,
  deleteDrug,
} from "../handlers/drugs.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
  createDrugSchema,
  updateDrugSchema,
} from "../validationSchemas/drugs.js";

const router = express.Router();

router.get("/", getDrugs);

router.get("/:id", getDrug);

router.post(
  "/",
  authenticateUser,
  authorizeRole("admin"),
  validateSchema(createDrugSchema),
  addDrug
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  validateSchema(updateDrugSchema),
  updateDrug
);

router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteDrug);

export default router;
