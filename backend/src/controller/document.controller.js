import axios from "axios";
import DocumentModel from "../models/document.model.js";

export const getDocuments = async (req, res) => {
  try {
    const docs = await DocumentModel.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const {
      fileName,
      pdfData,
      recipients,
      expirySettings,
      emailSubject,
      emailMessage,
    } = req.body;
    const apiKey = process.env.LAWBLOCK_SECRET_API_KEY;
    const lawblockApiBase =
      process.env.LAWBLOCK_API_BASE_URL || "http://localhost:3001";

    // Call LawBlock Upload API
    const response = await axios.post(
      `${lawblockApiBase}/api/v1/docsign/upload-doc`,
      {
        fileName,
        pdfData,
        recipients,
        ...(expirySettings !== undefined && { expirySettings }),
        ...(emailSubject !== undefined && { emailSubject }),
        ...(emailMessage !== undefined && { emailMessage }),
      },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    );

    const { documentId } = response.data.data || {};
    if (!documentId) {
      throw new Error("Missing documentId from LawBlock response");
    }

    // Save metadata to local MongoDB
    const newDoc = new DocumentModel({
      documentId,
      fileName,
      recipients,
    });
    await newDoc.save();

    res.json({
      message: "Document uploaded and tracked successfully",
      documentId,
    });
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

// Reusable handler for session initiation
export const handleSessionInit = async (req, res) => {
  try {
    const { documentId, email, theme } = req.body;

    if (!documentId || !email) {
      return res
        .status(400)
        .json({ error: "documentId and email are required" });
    }

    const apiKey = process.env.LAWBLOCK_SECRET_API_KEY;

    if (!apiKey || apiKey === "YOUR_LAWBLOCK_API_KEY_HERE") {
      return res.status(500).json({
        error: "LawBlock API Key is not configured in the backend .env file.",
      });
    }

    console.log(`Initializing session for doc: ${documentId}, email: ${email}`);

    // Call LawBlock Session Init API
    const lawblockApiBase =
      process.env.LAWBLOCK_API_BASE_URL || "http://localhost:3001";
    const response = await axios.post(
      `${lawblockApiBase}/api/v1/docsign/session/init`,
      { documentId, email, theme },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    );

    const { signUrl, sessionToken } = response.data.data || {};

    if (!signUrl) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve signUrl from LawBlock" });
    }

    res.json({
      signUrl,
      sessionToken,
      documentId,
    });
  } catch (error) {
    console.error(
      "Error proxying to LawBlock:",
      error.response?.data || error.message,
    );
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "Internal server error during LawBlock session init";
    res.status(status).json({ error: message });
  }
};

// Proxy to get document data by token
export const getDocByToken = async (req, res) => {
  try {
    const { id, t } = req.query;

    if (!id || !t) {
      return res.status(400).json({ error: "Missing required query parameters: id or t" });
    }

    const lawblockApiBase =
      process.env.LAWBLOCK_API_BASE_URL || "http://localhost:3001";

    const response = await axios.get(
      `${lawblockApiBase}/api/v1/docsign/token`,
      {
        params: { id, t },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error getting document by token from LawBlock:",
      error.response?.data || error.message,
    );
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "Internal server error while fetching document details";
    res.status(status).json({ error: message });
  }
};

