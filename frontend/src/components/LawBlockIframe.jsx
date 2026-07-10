import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { ENDPOINTS } from "../utils/apiConstants";

const LawBlockIframe = ({
  documentId,
  email,
  sessionToken,
  theme = "dark",
  redirectUrl,
}) => {
  const [signUrl, setSignUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    // need to fetch session first
    const fetchSignUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(ENDPOINTS.SESSION_INIT, {
          documentId,
          email,
          theme,
        });

        if (response.data.signUrl) {
          setSignUrl(response.data.signUrl);
        } else {
          throw new Error("No sign URL received from proxy");
        }
      } catch (err) {
        console.error("Failed to initialize LawBlock session:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to initialize session",
        );
      } finally {
        setLoading(false);
      }
    };

    if (documentId && email) {
      fetchSignUrl();
    }
  }, [documentId, email, sessionToken]);

  // Dynamic theme changes
  useEffect(() => {
    if (iframeRef.current && !iframeLoading) {
      iframeRef.current.contentWindow.postMessage(
        { type: "LAWBLOCK_SET_THEME", payload: { theme } },
        "*",
      );
    }
  }, [theme, iframeLoading]);

  useEffect(() => {
    const handleMessage = (event) => {
      // Security check for origins
      if (
        event.origin !== "https://market.lawblocks.io" &&
        event.origin !== "http://localhost:3000" &&
        !event.origin.includes("lawblock.ai") &&
        !event.origin.includes("localhost")
      ) {
        return;
      }

      // Handle both 'data' and 'payload' conventions
      const type = event.data?.type;
      const data = event.data?.data || event.data?.payload;

      if (!type) return;

      switch (type) {
        case "LAWBLOCK_SIGN_LOADED":
          console.log("LawBlock Iframe Loaded");
          setIframeLoading(false);
          break;

        case "LAWBLOCK_SIGN_SUCCESS":
          console.log("LawBlock Signing Success:", data.documentId);
          setSuccess(true);

          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          }
          break;

        case "LAWBLOCK_SIGN_ERROR":
          console.error("LawBlock Signing Error:", data.message);
          setError(
            data.message || "An error occurred during the signing process.",
          );
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [redirectUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-heading font-bold text-slate-800">
            Initializing Secure Session
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Connecting to LawBlock protocol...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-error mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto mb-8">{error}</p>
        <button
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          onClick={() => window.location.reload()}
        >
          Check Settings & Retry
        </button>
      </div>
    );
  }

  if (success && !redirectUrl) {
    return (
      <div className="p-16 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-success mx-auto mb-8 shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-heading font-bold text-slate-800 mb-3 text-gradient">
          Success!
        </h3>
        <p className="text-slate-500 text-lg">
          The document has been securely signed.
        </p>
        <div className="mt-10 pt-10 border-t border-slate-100 italic text-slate-400 text-sm">
          A copy of the signed document will be sent to your email.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[80vh] relative bg-slate-50 flex flex-col group">
      {iframeLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 space-y-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <span className="text-slate-400 font-medium animate-pulse">
            Establishing secure connection...
          </span>
        </div>
      )}
      {signUrl && (
        <iframe
          ref={iframeRef}
          src={signUrl}
          title="LawBlock Digital Signature"
          className={`w-full h-[80vh] border-none transition-all duration-700 ease-out transform ${iframeLoading ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
          allow="geolocation; microphone; camera"
        />
      )}
    </div>
  );
};

export default LawBlockIframe;
