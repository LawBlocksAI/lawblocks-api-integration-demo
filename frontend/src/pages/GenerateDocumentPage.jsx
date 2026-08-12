import React, { useState, useEffect, useRef } from 'react';
import { Country, State } from 'country-state-city';
import ISO6391 from 'iso-639-1';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FileText, Wand2, Loader2, Save, ArrowRight, ChevronDown } from 'lucide-react';
import { ENDPOINTS } from '../utils/apiConstants';
import api from '../services/api';

const CustomSelect = ({ options, value, onChange, placeholder, name, theme, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          theme === 'dark' 
            ? 'bg-slate-800/50 border-slate-700 text-white' 
            : 'bg-slate-50 border-slate-200 text-slate-900'
        } ${isOpen ? 'ring-2 ring-primary-500' : ''}`}
      >
        <span className={!selectedOption ? 'text-slate-400' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && !disabled && (
        <div className={`absolute z-50 w-full mt-1 rounded-xl border shadow-xl flex flex-col ${
          theme === 'dark' 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className={`w-full p-2 text-sm rounded-lg outline-none ${
                theme === 'dark' ? 'bg-slate-700 text-white placeholder-slate-400' : 'bg-slate-100 text-slate-800 placeholder-slate-500'
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className={`p-3 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>No results found</div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt.value}
                  onClick={() => {
                    onChange({ target: { name, value: opt.value } });
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`p-3 cursor-pointer text-sm transition-colors ${
                    value === opt.value 
                      ? (theme === 'dark' ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600')
                      : (theme === 'dark' ? 'text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-100')
                  }`}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const GenerateDocumentPage = ({ theme }) => {
  const [formData, setFormData] = useState({
    promptDescription: '',
    numberOfPages: 1,
    country: '',
    state: '',
    language: 'en',
  });

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const languages = ISO6391.getAllCodes().map(code => ({
    code,
    name: ISO6391.getName(code)
  }));
  
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, state: '' })); // Reset state when country changes
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDocumentContent('');

    const langName = ISO6391.getName(formData.language) || formData.language;
    const countryName = formData.country ? Country.getCountryByCode(formData.country)?.name : '';
    const stateName = formData.state ? State.getStateByCodeAndCountry(formData.state, formData.country)?.name : '';

    const payload = {
      promptDescription: formData.promptDescription,
      numberOfPages: Number(formData.numberOfPages),
      country: countryName,
      state: stateName,
      generateThroughAi: false,
      language: langName
    };

    try {
      await api.post(ENDPOINTS.GENERATE_DOCUMENT_WITH_AI, payload, {
        onDownloadProgress: (progressEvent) => {
          const xhr = progressEvent.event.target;
          if (!xhr || !xhr.responseText) return;

          const responseText = xhr.responseText;
          const lines = responseText.split('\n').filter(line => line.trim() !== '');
          
          let newHtml = '';
          let generatedFlag = false;

          for (const line of lines) {
            try {
              let jsonStr = line;
              if (line.startsWith('data: ')) {
                jsonStr = line.substring(6);
              }
              if (!jsonStr.trim()) continue;
              
              const data = JSON.parse(jsonStr);
              if (data.type === 'chunk' && data.data) {
                newHtml += data.data;
              } else if (data.type === 'done') {
                generatedFlag = data.isAiGenerated;
              }
            } catch (err) {
              // Ignore incomplete chunks at the tail of the stream
            }
          }

          setDocumentContent(newHtml);
          if (generatedFlag) setIsAiGenerated(generatedFlag);
        }
      });
    } catch (error) {
      console.error('Error generating document:', error);
      // Fallback display for demo error
      setDocumentContent('<p class="text-red-500">Error generating document. Please check the console.</p>');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom toolbar for ReactQuill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className={`w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 transition-colors duration-500`}>
      
      {/* Left Column - Form */}
      <div className={`w-full lg:w-1/3 flex flex-col gap-6 p-6 rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary-500/20 text-primary-500 rounded-xl">
            <Wand2 size={24} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold font-heading ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              AI Generator
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Draft documents with AI
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Prompt Description */}
          <div className="flex flex-col gap-2">
            <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Prompt Description
            </label>
            <textarea
              name="promptDescription"
              value={formData.promptDescription}
              onChange={handleChange}
              placeholder="e.g. A professional service agreement between a consultant and a client..."
              rows={4}
              required
              className={`w-full p-3 rounded-xl border outline-none transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-primary-500 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 focus:border-primary-500 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Number of Pages */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Pages
              </label>
              <input
                type="number"
                name="numberOfPages"
                min="1"
                max="10"
                value={formData.numberOfPages}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border outline-none transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700 focus:border-primary-500 text-white' 
                    : 'bg-slate-50 border-slate-200 focus:border-primary-500 text-slate-900'
                }`}
              />
            </div>

            {/* Language */}
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Language
              </label>
              <CustomSelect
                name="language"
                value={formData.language}
                onChange={handleChange}
                theme={theme}
                placeholder="Select Language"
                options={languages.map(lang => ({ value: lang.code, label: lang.name }))}
              />
            </div>
          </div>

          {/* Country & State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Country
              </label>
              <CustomSelect
                name="country"
                value={formData.country}
                onChange={handleChange}
                theme={theme}
                placeholder="Select Country"
                options={countries.map(c => ({ value: c.isoCode, label: c.name }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                State
              </label>
              <CustomSelect
                name="state"
                value={formData.state}
                onChange={handleChange}
                theme={theme}
                disabled={!formData.country || states.length === 0}
                placeholder="Select State"
                options={states.map(s => ({ value: s.isoCode, label: s.name }))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.promptDescription}
            className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Document
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column - Editor */}
      <div className={`w-full lg:w-2/3 flex flex-col rounded-2xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'}`}>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-primary-500" />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Document Editor
            </h3>
            {isAiGenerated && (
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-500 border border-green-500/30">
                AI Generated
              </span>
            )}
          </div>
          
          <button 
            disabled={!documentContent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            Save Draft
          </button>
        </div>

        <div className={`flex-1 min-h-[500px] ${theme === 'dark' ? 'quill-dark' : 'quill-light'}`}>
          <ReactQuill 
            theme="snow"
            value={documentContent}
            onChange={setDocumentContent}
            modules={modules}
            className="h-full"
            placeholder="Generated content will appear here..."
          />
        </div>
      </div>
      
      {/* Required style overrides for Quill in dark mode */}
      <style dangerouslySetInnerHTML={{__html: `
        .quill-dark .ql-toolbar {
          background-color: #0f172a;
          border-color: #1e293b;
        }
        .quill-dark .ql-container {
          border-color: #1e293b;
          font-family: inherit;
          font-size: 1rem;
        }
        .quill-dark .ql-editor {
          color: #f8fafc;
          min-height: 500px;
          max-height: 70vh;
          overflow-y: auto;
        }
        .quill-dark .ql-stroke {
          stroke: #94a3b8;
        }
        .quill-dark .ql-fill {
          fill: #94a3b8;
        }
        .quill-dark .ql-picker {
          color: #94a3b8;
        }
        .quill-dark .ql-picker-options {
          background-color: #1e293b;
          border-color: #334155;
        }
        .quill-light .ql-toolbar {
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }
        .quill-light .ql-container {
          border-color: #e2e8f0;
          font-family: inherit;
          font-size: 1rem;
        }
        .quill-light .ql-editor {
          min-height: 500px;
          max-height: 70vh;
          overflow-y: auto;
        }
      `}} />
    </div>
  );
};

export default GenerateDocumentPage;
