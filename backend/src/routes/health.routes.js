import express from "express";
import { getHealth, getTest } from "../controller/health.controller.js";

const router = express.Router();

router.get("/api/health", getHealth);
router.get("/api/test", getTest);

export default router;
