import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LawBlockIframe from "../components/LawBlockIframe";

const SignPage = ({ theme }) => {
  const { docId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div
        className={`flex flex-wrap justify-between items-center p-5 rounded-3xl shadow-soft border gap-4 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-100"
        }`}
      >
        <Link
          to="/documents"
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            theme === "dark"
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <ChevronLeft size={20} />
          Back to Documents
        </Link>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              Session ID
            </span>
            <span
              className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-700"}`}
            >
              {docId}
            </span>
          </div>
          <div className="hidden sm:flex flex-col border-l border-slate-200 dark:border-slate-800 pl-6">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              Protocol
            </span>
            <span
              className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-700"}`}
            >
              DocSignApp Secure
            </span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-3xl shadow-premium border overflow-hidden ${
          theme === "dark"
            ? "bg-slate-950 border-slate-800"
            : "bg-white border-slate-100"
        }`}
      >
        <LawBlockIframe
          documentId={docId}
          email={email}
          sessionToken={token}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default SignPage;
