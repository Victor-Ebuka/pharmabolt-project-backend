import dotenv from "dotenv";
import express from "express";
import drugsRouter from "./routes/drugs.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/drugs", drugsRouter);
app.use("/api/users", usersRouter);
const PORT = process.env.PORT || 8000;

app.get("/api", (req, res) => {
  res.send(
    "Welcome to the Pharmabolt API \n\n Visit: \n '/auth/register' to register \n '/auth/login' to login and get a token. "
  );
});

// Default 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: { message: "Resource not found" } });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500; // Default to 500 if no status code is set
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      details: err.details || null,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}....`);
});
