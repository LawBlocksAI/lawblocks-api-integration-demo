import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../utils/apiConstants";
import {
  Upload,
  Plus,
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  CalendarClock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import RecipientForm from "../components/RecipientForm";

const UploadPage = ({ theme }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [recipients, setRecipients] = useState([{ recipientName: "", email: "" }]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [expirySettings, setExpirySettings] = useState({
    expiryEnabled: false,
    contractExpiresAt: "",
  });

  // PDF -> Base64 Conversion (as requested)
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });

  const addRecipient = () => {
    setRecipients([...recipients, { recipientName: "", email: "" }]);
  };

  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index, field, value) => {
    const newRecipients = [...recipients];
    newRecipients[index][field] = value;
    setRecipients(newRecipients);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid PDF file.");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("A PDF file is required.");
    if (recipients.some((r) => !r.email || !r.recipientName))
      return setError("All recipient fields are required.");

    // Expiry client-side validation
    if (expirySettings.expiryEnabled && !expirySettings.contractExpiresAt) {
      return setError("Please provide the contract expiry date.");
    }

    try {
      setIsUploading(true);
      setError(null);

      const base64 = await toBase64(file);

      const payload = {
        fileName: file.name,
        pdfData: base64,
        recipients: recipients.map((r) => ({
          email: r.email,
          recipientName: r.recipientName,
          status: false,
        })),
        expirySettings: {
          expiryEnabled: expirySettings.expiryEnabled,
          ...(expirySettings.expiryEnabled && {
            contractExpiresAt: new Date(expirySettings.contractExpiresAt).toISOString(),
          }),
        },
      };

      // Call our proxy server
      await api.post(ENDPOINTS.UPLOAD_DOCUMENT, payload);

      // Success! Redirect to documents list
      navigate("/documents");
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err.response?.data?.error ||
          "Failed to upload document. Please check your connection.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="text-center space-y-4">
        <h1
          className={`text-5xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          Secure <span className="text-primary-500">Document Upload</span>
        </h1>
        <p
          className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
        >
          Upload your PDF and define recipients. We'll handle the secure protocol
          integration for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Dropzone */}
        <div
          className={`group relative rounded-[2.5rem] p-12 text-center border-2 border-dashed transition-all duration-300 ${
            file
              ? "border-emerald-500/50 bg-emerald-500/5"
              : theme === "dark"
                ? "border-slate-800 bg-slate-900/50 hover:border-primary-500/50 hover:bg-slate-900"
                : "border-slate-200 bg-white hover:border-primary-500/30 hover:bg-slate-50"
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                file
                  ? "bg-emerald-500 text-white"
                  : "bg-primary-500 text-white shadow-xl shadow-primary-500/20"
              }`}
            >
              {file ? <CheckCircle2 size={40} /> : <Upload size={40} />}
            </div>
            {file ? (
              <div className="space-y-1">
                <p
                  className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {file.name}
                </p>
                <p className="text-emerald-500 font-medium flex items-center justify-center gap-2">
                  <FileText size={16} /> Ready to process (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p
                  className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Click or drag to upload document
                </p>
                <p className="text-slate-500">
                  Only PDF files are supported for secure signing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recipients Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div className="space-y-1">
              <h2
                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}
              >
                Recipients
              </h2>
              <p className="text-slate-500">
                Add the people who need to sign this document
              </p>
            </div>
            <button
              type="button"
              onClick={addRecipient}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 ${
                theme === "dark"
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-white text-slate-800 border border-slate-200 hover:shadow-lg"
              }`}
            >
              <Plus size={18} /> Add Recipient
            </button>
          </div>

          <div className="grid gap-4">
            {recipients.map((recipient, index) => (
              <RecipientForm
                key={index}
                index={index}
                recipient={recipient}
                updateRecipient={updateRecipient}
                removeRecipient={removeRecipient}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Expiry Settings Section */}
        <div
          className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${
            theme === "dark"
              ? "bg-slate-900/60 border-slate-700"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Header / Toggle Row */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  expirySettings.expiryEnabled
                    ? "bg-amber-500/10 text-amber-500"
                    : theme === "dark"
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                <Clock size={22} />
              </div>
              <div>
                <h2
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-slate-800"
                  }`}
                >
                  Contract Expiry
                </h2>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Set an expiry date for the signed contract
                </p>
              </div>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() =>
                setExpirySettings((prev) => ({
                  ...prev,
                  expiryEnabled: !prev.expiryEnabled,
                  contractExpiresAt: !prev.expiryEnabled ? prev.contractExpiresAt : "",
                }))
              }
              className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                expirySettings.expiryEnabled
                  ? "bg-amber-500 focus:ring-amber-500"
                  : theme === "dark"
                    ? "bg-slate-700 focus:ring-slate-500"
                    : "bg-slate-200 focus:ring-slate-400"
              }`}
              aria-label="Toggle contract expiry"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  expirySettings.expiryEnabled ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Expanded: Date Picker */}
          {expirySettings.expiryEnabled && (
            <div
              className={`px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300`}
            >
              <div
                className={`h-px mb-6 ${
                  theme === "dark" ? "bg-slate-800" : "bg-slate-100"
                }`}
              />
              <div className="space-y-2">
                <label
                  htmlFor="contractExpiresAt"
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <CalendarClock size={14} />
                  Contract Expires At
                </label>
                <div className="relative">
                  <input
                    id="contractExpiresAt"
                    type="datetime-local"
                    value={expirySettings.contractExpiresAt}
                    min={new Date(Date.now() + 60 * 1000).toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setExpirySettings((prev) => ({
                        ...prev,
                        contractExpiresAt: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-amber-500/50 [color-scheme:dark]"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                    }`}
                    required={expirySettings.expiryEnabled}
                  />
                </div>
                <p
                  className={`text-xs flex items-start gap-1.5 pt-1 ${
                    theme === "dark" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  <AlertCircle
                    size={12}
                    className="mt-0.5 flex-shrink-0 text-amber-500"
                  />
                  Must be after the signing deadline configured in your account's Contract
                  Settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-10 flex flex-col items-center gap-6">
          {error && (
            <div className="w-full p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 animate-in shake duration-500">
              <AlertCircle size={20} />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full max-w-md py-5 rounded-[2rem] font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 ${
              isUploading || !file
                ? "bg-slate-400 cursor-not-allowed opacity-50"
                : "bg-primary-600 text-white shadow-2xl shadow-primary-500/40 hover:bg-primary-500"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Uploading Document...
              </>
            ) : (
              <>
                <Send size={24} />
                Submit for Signing
              </>
            )}
          </button>
          <p className="text-slate-500 text-sm italic">
            By submitting, you agree to secure the document via DocSignApp Protocol.
          </p>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
