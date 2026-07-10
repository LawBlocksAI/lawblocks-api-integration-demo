export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const ENDPOINTS = {
  DOCUMENTS: "/api/documents",
  UPLOAD_DOCUMENT: "/api/docsign/upload-doc",
  SESSION_INIT: "/api/docsign/session/init",
  GET_DOC_BY_TOKEN: "/api/docsign/token"
};
