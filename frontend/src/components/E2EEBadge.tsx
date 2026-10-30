import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Info } from 'lucide-react';

interface E2EEBadgeProps {
  fingerprint?: string;
}

export const E2EEBadge: React.FC<E2EEBadgeProps> = ({ fingerprint = 'AES-256-GCM-SHA256' }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm"
        title="Click to view End-to-End Encryption security details"
      >
        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>End-to-End Encrypted</span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
              End-to-End Encryption (E2EE)
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-5">
              Fulfills BUP academic security standards. Only you and the recipient can read sent messages. Not even the server can read your plaintext.
            </p>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Key className="w-3.5 h-3.5 text-bup-600" /> Algorithm
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  AES-GCM (256-bit)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Key Derivation</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  PBKDF2-SHA256 (100k iter)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Security Fingerprint</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {fingerprint}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Payloads are ciphered on your device using the Web Crypto API prior to transmission over the network.
              </span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors shadow-md shadow-emerald-600/20"
            >
              Close & Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};
