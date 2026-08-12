import express from 'express';
import { generateDocument } from '../controller/ai.controller.js';

const router = express.Router();

router.post('/generate-document', generateDocument);

export default router;
