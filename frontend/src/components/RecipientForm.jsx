import React from 'react';
import { User, Mail, Trash2 } from 'lucide-react';

const RecipientForm = ({ recipient, index, updateRecipient, removeRecipient, theme }) => {
  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-800/50 border-slate-700 hover:border-primary-500/50 hover:bg-slate-800' 
        : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/50'
    }`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className={`block text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Recipient Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={recipient.recipientName}
              onChange={(e) => updateRecipient(index, 'recipientName', e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-primary-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary-500/20'
              }`}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <label className={`block text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={recipient.email}
              onChange={(e) => updateRecipient(index, 'email', e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-primary-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary-500/20'
              }`}
              required
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeRecipient(index)}
        className={`absolute -right-3 -top-3 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 ${
          theme === 'dark'
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-white text-rose-500 border border-rose-100 hover:bg-rose-50'
        }`}
        title="Remove Recipient"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default RecipientForm;
