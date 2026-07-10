import React, { useState } from 'react';
import { X, Mail, ArrowRight, Loader2 } from 'lucide-react';

const EmailModal = ({ isOpen, onClose, onConfirm, theme, isProcessing, errorMessage }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(email);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      <div className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'
      }`}>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Sign Document
              </h3>
              <p className="text-slate-500 font-medium">
                Enter your email to initialize a secure signing session.
              </p>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-bold ml-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                Signer Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-primary-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary-500/20'
                  }`}
                  required
                  autoFocus
                />
              </div>
              {errorMessage && (
                <p className="mt-2 text-sm font-semibold text-rose-500 animate-in fade-in slide-in-from-top-1 duration-300 ml-1">
                  {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing || !email}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 ${
                isProcessing || !email
                  ? 'bg-slate-400 cursor-not-allowed text-white opacity-50'
                  : 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 hover:bg-primary-500'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  Start Secure Signing
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className={`p-4 text-center text-xs font-medium ${theme === 'dark' ? 'bg-slate-950 text-slate-600' : 'bg-slate-50 text-slate-400'}`}>
          A secure session token will be generated for your browser.
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
