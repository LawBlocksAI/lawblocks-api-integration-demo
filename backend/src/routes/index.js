import express from "express";
import documentRoutes from "./document.routes.js";
import healthRoutes from "./health.routes.js";

const router = express.Router();

router.use("/", healthRoutes);

router.use("/api", documentRoutes);

export default router;
