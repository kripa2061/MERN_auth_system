const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");   // <- don't forget to import
require("dotenv").config();
const connectDB = require("./connection");
const authRouter = require("./Routes/authRoutes");
const userRouter = require("./Routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173'];

app.use(cookieParser()); 
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running and database connected!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
