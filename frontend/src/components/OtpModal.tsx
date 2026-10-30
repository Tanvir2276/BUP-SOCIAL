import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RefreshCw, KeyRound, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OtpModalProps {
  email: string;
  demoOtpCode?: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<string | undefined>;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  email,
  demoOtpCode,
  isOpen,
  onClose,
  onVerify,
  onResend,
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [currentDemoCode, setCurrentDemoCode] = useState(demoOtpCode || '');

  useEffect(() => {
    if (demoOtpCode) {
      setCurrentDemoCode(demoOtpCode);
    }
  }, [demoOtpCode]);

  useEffect(() => {
    if (!isOpen) return;
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAutoFill = () => {
    if (currentDemoCode && currentDemoCode.length === 6) {
      setDigits(currentDemoCode.split(''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onVerify(code);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const newCode = await onResend();
      if (newCode) {
        setCurrentDemoCode(newCode);
      }
      setTimer(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-bup-100 dark:bg-bup-900/40 flex items-center justify-center text-bup-700 dark:text-bup-300 mx-auto mb-4 shadow-inner">
          <KeyRound className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">
          Two-Factor OTP Verification
        </h3>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-5">
          A 6-digit BUP authentication code was dispatched to:
          <br />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
        </p>

        {/* Demo Simulated Banner */}
        {currentDemoCode && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                Simulated BUP SMS Code: <strong className="font-mono text-sm tracking-wider">{currentDemoCode}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-lg hover:bg-amber-300 transition-colors"
            >
              Auto Fill
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-between gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-13 text-center text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-bup-600 focus:border-transparent outline-none shadow-sm transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="p-3 text-xs rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-bup-700 hover:bg-bup-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-bup-700/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Code...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Verify & Access Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            disabled={timer > 0 || loading}
            onClick={handleResend}
            className="text-xs font-medium text-slate-500 hover:text-bup-700 dark:hover:text-bup-400 disabled:opacity-50 transition-colors"
          >
            {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Click to resend"}
          </button>
        </div>
      </div>
    </div>
  );
};
