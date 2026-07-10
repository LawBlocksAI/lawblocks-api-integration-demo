import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../utils/apiConstants";
import {
  Files,
  Search,
  Calendar,
  Users,
  ChevronRight,
  FileText,
  PenTool,
  Loader2,
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import EmailModal from "../components/EmailModal";

const DocumentsPage = ({ theme }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewLoadingId, setViewLoadingId] = useState(null);

  // Modal State
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.DOCUMENTS);
      setDocuments(response.data);
    } catch (err) {
      console.error("Fetch docs failed:", err);
      setError(
        "Failed to load documents. Please check if the server is running.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSignClick = (docId) => {
    setSelectedDocId(docId);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleViewClick = async (doc) => {
    try {
      setViewLoadingId(doc.documentId);
      const firstRecipient = doc.recipients && doc.recipients[0];
      if (!firstRecipient || !firstRecipient.email) {
        alert("No recipients found in document signature list.");
        return;
      }
      
      const response = await api.post(ENDPOINTS.SESSION_INIT, {
        documentId: doc.documentId,
        email: firstRecipient.email,
        theme: theme,
      });

      const { signUrl } = response.data;
      if (signUrl) {
        window.open(signUrl, "_blank");
      } else {
        alert("Failed to retrieve the view URL.");
      }
    } catch (err) {
      console.error("Failed to view document:", err);
      alert(err.response?.data?.error || "Failed to initialize viewing session.");
    } finally {
      setViewLoadingId(null);
    }
  };

  const handleConfirmEmail = async (email) => {
    try {
      setIsProcessing(true);

      // Step 2: Call Session API
      const response = await api.post(ENDPOINTS.SESSION_INIT, {
        documentId: selectedDocId,
        email: email,
        theme: theme,
      });

      const { sessionToken } = response.data;

      // Step 3: Redirect to /sign/:docId?token=xyz&email=abc
      navigate(
        `/sign/${selectedDocId}?token=${sessionToken}&email=${encodeURIComponent(email)}`,
      );
    } catch (err) {

      console.error("Session init failed:", err);
      setModalError(
        err.response?.data?.error ||
          "Recipient not found in document signature list",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1
            className={`text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Documents <span className="text-primary-500">Repository</span>
          </h1>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-medium`}
          >
            Manage and track all your secure signing documents in one place.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-white focus:ring-2 focus:ring-primary-500"
                : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary-500/20 shadow-sm"
            }`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">
            Loading vault collection...
          </p>
        </div>
      ) : error ? (
        <div
          className={`p-10 rounded-[2.5rem] border text-center space-y-6 ${
            theme === "dark"
              ? "bg-slate-900/50 border-rose-500/20"
              : "bg-rose-50 border-rose-100"
          }`}
        >
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h3
              className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Something went wrong
            </h3>
            <p className="text-slate-500">{error}</p>
          </div>
          <button
            onClick={fetchDocuments}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div
          className={`p-20 rounded-[3rem] border-2 border-dashed text-center space-y-6 ${
            theme === "dark"
              ? "border-slate-800 bg-slate-900/20"
              : "border-slate-200 bg-slate-50/50"
          }`}
        >
          <div className="w-20 h-20 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
            <Files size={32} />
          </div>
          <div className="space-y-2">
            <h3
              className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              No documents found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Start by uploading your first PDF document to the secure DocSignApp
              protocol.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20"
          >
            Create New Document
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.documentId}
              className={`group p-6 rounded-[2rem] border transition-all duration-500 hover:scale-[1.01] ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80 hover:border-primary-500/30"
                  : "bg-white border-slate-100 hover:border-primary-500/20 shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                      theme === "dark"
                        ? "bg-slate-950 text-indigo-400"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    <FileText size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3
                      className={`text-xl font-bold truncate max-w-[200px] sm:max-w-md ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      {doc.fileName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 border-l pl-4 border-slate-200 dark:border-slate-800">
                        <Users size={14} />
                        {doc.recipients?.length || 0} Recipients
                      </span>
                      <span className="flex items-center gap-1.5 border-l pl-4 border-slate-200 dark:border-slate-800">
                        <Clock size={14} />
                        {doc.status ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewClick(doc)}
                    disabled={viewLoadingId === doc.documentId}
                    className={`px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all transform ${
                      theme === "dark"
                        ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                        : "bg-white text-slate-850 hover:bg-slate-50 border border-slate-200 shadow-sm"
                    }`}
                  >
                    {viewLoadingId === doc.documentId ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Eye size={18} />
                    )}
                    View
                  </button>
                  <button
                    onClick={() => handleSignClick(doc.documentId)}
                    className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all transform group-hover:-translate-x-1 ${
                      theme === "dark"
                        ? "bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/20"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                    }`}
                  >
                    <PenTool size={18} />
                    Sign
                    <ChevronRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Signing Email Modal */}
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmEmail}
        theme={theme}
        isProcessing={isProcessing}
        errorMessage={modalError}
      />
    </div>
  );
};

export default DocumentsPage;
