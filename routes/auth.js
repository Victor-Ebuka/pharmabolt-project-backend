import { createUserSchema } from "../validationSchemas/users.js";
import validateSchema from "../middlewares/validateSchema.js";
import { registerUser, loginUser } from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/register", validateSchema(createUserSchema), registerUser);
router.post("/login", loginUser);

export default router;
