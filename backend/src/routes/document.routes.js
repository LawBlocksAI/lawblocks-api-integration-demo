import express from "express";
import {
  getDocuments,
  uploadDocument,
  handleSessionInit,
  getDocByToken,
} from "../controller/document.controller.js";

const router = express.Router();

router.get("/documents", getDocuments);
router.post("/docsign/upload-doc", uploadDocument);
router.post("/docsign/session/init", handleSessionInit);
router.get("/docsign/token", getDocByToken);


export default router;
