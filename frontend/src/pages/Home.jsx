import { Link } from 'react-router-dom';
import { FilePlus, Wand2, ShieldCheck, Code, Server, Smartphone, ExternalLink } from 'lucide-react';
import { ROUTES } from '../utils/routeConstants';
import useTheme from '../hooks/useTheme';

export default function Home() {
  const { theme } = useTheme();

  const features = [
    {
      icon: <Wand2 className="w-8 h-8 text-indigo-500" />,
      title: "AI Document Generation",
      description: "Leverage advanced AI to dynamically draft custom legal agreements and templates using the AI generation API endpoint with live Server-Sent Events streaming."
    },
    {
      icon: <FilePlus className="w-8 h-8 text-emerald-500" />,
      title: "Document Upload Flow",
      description: "Seamlessly push and store your custom PDF documents to the Marketplace via secure proxy integration."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-rose-500" />,
      title: "Secure Signing Sessions",
      description: "Initialize legally binding document signing sessions and securely handle tokenized signing links sent directly to recipients."
    }
  ];

  const techStack = [
    { name: "React 19", icon: <Smartphone className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-500" },
    { name: "Tailwind CSS v4", icon: <Code className="w-5 h-5" />, color: "bg-cyan-500/10 text-cyan-500" },
    { name: "Express.js Proxy", icon: <Server className="w-5 h-5" />, color: "bg-green-500/10 text-green-500" },
    { name: "Marketplace APIs", icon: <ExternalLink className="w-5 h-5" />, color: "bg-primary-500/10 text-primary-500" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-2xl mb-4">
          <Code className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className={`text-4xl md:text-6xl font-heading font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Marketplace API <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Integration Demo</span>
        </h1>
        <p className={`max-w-3xl mx-auto text-lg md:text-xl leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          A complete reference implementation showcasing how developers can seamlessly build applications using the LawBlocks Marketplace APIs. Explore document upload, management, AI drafting, and signing session integrations in real-time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Link to={ROUTES.UPLOAD} className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 flex items-center gap-2">
            <FilePlus size={20} />
            Test Upload API
          </Link>
          <Link to={ROUTES.GENERATE} className={`px-8 py-4 rounded-xl font-bold transition-all border-2 flex items-center gap-2 hover:-translate-y-1 ${theme === 'dark' ? 'border-slate-700 hover:border-slate-600 text-white bg-slate-800' : 'border-slate-200 hover:border-slate-300 text-slate-800 bg-white'}`}>
            <Wand2 size={20} />
            Try AI Generator
          </Link>
          <a href={ROUTES.API_DOCS} target="_blank" rel="noopener noreferrer" className={`px-8 py-4 rounded-xl font-bold transition-all border-2 flex items-center gap-2 hover:-translate-y-1 ${theme === 'dark' ? 'border-slate-700 hover:border-slate-600 text-slate-300 bg-transparent' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-transparent'}`}>
            <ExternalLink size={20} />
            API Documentation
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className={`text-2xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Key Demonstration Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className={`p-8 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80' : 'bg-white border-slate-200 hover:bg-slate-50'} shadow-sm`}>
              <div className="mb-6 inline-block p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {feature.title}
              </h3>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* API Endpoints Info */}
      <section className={`p-8 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          <Server className="text-primary-500" />
          Exposed Proxy Endpoints
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { method: "POST", path: "/api/docsign/upload-doc", desc: "Push new document to Marketplace" },
            { method: "POST", path: "/api/docsign/session/init", desc: "Initialize signing session" },
            { method: "GET", path: "/api/docsign/token", desc: "Validate signing token" },
            { method: "POST", path: "/api/v1/ai/generate-document", desc: "Stream AI document generation" },
          ].map((api, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-100'} shadow-sm`}>
              <span className={`px-2 py-1 text-xs font-bold rounded ${api.method === 'GET' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                {api.method}
              </span>
              <div>
                <code className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{api.path}</code>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{api.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
