import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";

import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";

import { connectDB } from "./lib/db.js";

job.start();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})