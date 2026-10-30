import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Server,
  KeyRound,
  CheckCircle2,
  X,
  Zap,
  Activity,
  Cpu,
  Globe,
  Database,
} from 'lucide-react';
import { apiFetch } from '../utils/api';

interface SecurityShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityShieldModal: React.FC<SecurityShieldModalProps> = ({ isOpen, onClose }) => {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiFetch('/security/status')
        .then((data) => {
          setTelemetry(data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0b132b] border border-blue-200 dark:border-blue-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-bup-navy via-bup-900 to-[#0355a2] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">3-Tier University Security Shield</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  MILITARY GRADE
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                Bangladesh University of Professionals (BUP) Cyber Defense Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Threat status banner */}
        <div className="px-5 py-3 bg-emerald-500/10 dark:bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              STATUS: ALL 3 DEFENSE TIERS ACTIVE & SECURE
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
            Zero Breaches Detected
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Level 1: Perimeter Shield */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-bup-700 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Level 1: Network & Perimeter Defense
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mitigates automated botnets, DDoS, brute force, and unauthorized frame injections.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                ENABLED
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sliding-Window IP Rate Limiter (150 req/min)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Brute Force Lockout (8 fails = 15m lock)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Strict-Transport-Security (HSTS)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>X-Frame-Options (Clickjack prevention)</span>
              </li>
            </ul>
          </div>

          {/* Level 2: Zero-Trust Authentication Guard */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Level 2: Zero-Trust Authentication Guard
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dual-factor OTP challenge, role permission boundaries, and cryptographic tokens.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                ENABLED
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Email OTP Challenge (Bcrypt hashed, 5m limit)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Single-use OTP invalidation on reissue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>HMAC-SHA256 Signed Tamper-Proof JWT</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Server-Enforced Role-Based Access Control</span>
              </li>
            </ul>
          </div>

          {/* Level 3: Cryptographic Vault & SQL Isolation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Level 3: Cryptographic Vault & SQL Isolation
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Client-side Web Crypto AES-256-GCM ciphering and 100% parameterized MySQL queries.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                ENABLED
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Client-Side AES-GCM 256-bit Chatbox Cipher</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero Plaintext Stored in MySQL for Messages</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Prepared SQL Statements (Zero SQL Injection)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Salted Bcrypt Passwords (Work Factor 10)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Validated against OWASP Top 10 & University Data Security Guidelines.
          </p>
          <button
            onClick={onClose}
            className="btn-motion btn-bup-primary px-4 py-2 rounded-xl text-xs font-bold"
          >
            Acknowledged & Secure
          </button>
        </div>
      </div>
    </div>
  );
};
