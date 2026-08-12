import express from "express";
import documentRoutes from "./document.routes.js";
import healthRoutes from "./health.routes.js";
import aiRoutes from "./ai.routes.js";

const router = express.Router();

router.use("/", healthRoutes);

router.use("/api", documentRoutes);
router.use("/api/ai", aiRoutes);

export default router;
