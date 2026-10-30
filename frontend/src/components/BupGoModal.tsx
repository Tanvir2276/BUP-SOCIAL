import React, { useState } from 'react';
import { ExternalLink, Car, Compass, ArrowRight, ShieldCheck, Settings, X } from 'lucide-react';

interface BupGoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BupGoModal: React.FC<BupGoModalProps> = ({ isOpen, onClose }) => {
  const [bupGoUrl, setBupGoUrl] = useState(() => {
    return localStorage.getItem('bupgo_custom_url') || 'https://bup-go-project-8njl.vercel.app/';
  });
  const [showConfig, setShowConfig] = useState(false);

  if (!isOpen) return null;

  const handleLaunch = () => {
    localStorage.setItem('bupgo_custom_url', bupGoUrl);
    window.open(bupGoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">BUP-GO Connect</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ACTIVE BRIDGE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seamlessly link and launch the dedicated BUP-GO ride sharing platform.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Target Application Endpoint</span>
            <span className="font-mono font-semibold text-bup-700 dark:text-bup-300">{bupGoUrl}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Campus Route Coverage</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Mirpur, Uttara, Dhanmondi, Mohakhali</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Authentication Single Sign-On</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> BUP Verified
            </span>
          </div>
        </div>

        {/* Quick Launch Button */}
        <button
          type="button"
          onClick={handleLaunch}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 group"
        >
          <span>Launch BUP-GO Application</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        {/* Config Option */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Hide Port Settings' : 'Configure BUP-GO Port'}</span>
          </button>
          <span className="text-[11px] text-slate-400">Opens in new tab</span>
        </div>

        {showConfig && (
          <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2 text-xs">
            <label className="block text-slate-600 dark:text-slate-300 font-medium">BUP-GO URL / Port:</label>
            <input
              type="text"
              value={bupGoUrl}
              onChange={(e) => setBupGoUrl(e.target.value)}
              placeholder="https://bup-go-project-8njl.vercel.app/"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-none"
            />
            <p className="text-[10px] text-slate-500">
              Set this to whichever port your BUP-GO dev server or deployed URL is listening on.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
