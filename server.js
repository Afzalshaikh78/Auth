require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");

(async () => {
  try {
    await connectDB(); // Wait for DB to connect

    app.use(express.json());
    app.use("/api/auth", authRoutes);
    app.use("/api/home", homeRoutes);
    app.use("/api/admin", adminRoutes);


    app.get("/", (req, res) => {
      res.send("Server is workinggggg!");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🚨 Server startup error:", err.message);
    process.exit(1);
  }
})();
