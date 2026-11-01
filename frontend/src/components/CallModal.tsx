import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Share2,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Sparkles,
  Wifi,
} from 'lucide-react';

export interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'audio' | 'video';
  recipient: {
    id?: string;
    name: string;
    avatar?: string;
    department?: string;
    role?: string;
  };
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  callType: initialCallType,
  recipient,
}) => {
  const [callType, setCallType] = useState<'audio' | 'video'>(initialCallType);
  const [status, setStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(initialCallType === 'audio');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setCallType(initialCallType);
    setIsVideoOff(initialCallType === 'audio');
  }, [initialCallType]);

  // Web Audio Ringtone Synthesizer
  useEffect(() => {
    if (!isOpen) {
      setStatus('ringing');
      setDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setStatus('ringing');
    setDuration(0);

    let ringOscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let ringInterval: any = null;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        const ctx = audioCtxRef.current;

        const playChime = () => {
          if (!ctx || ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
          osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.3);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.9);
        };

        playChime();
        ringInterval = setInterval(playChime, 2000);
      }
    } catch (e) {
      // AudioContext might be blocked until user gesture, graceful fallback
    }

    // Automatically transition to Connected after 2.6 seconds
    const connectTimer = setTimeout(() => {
      if (ringInterval) clearInterval(ringInterval);
      setStatus('connected');
    }, 2600);

    return () => {
      if (ringInterval) clearInterval(ringInterval);
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  // Duration timer when connected
  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleHangup = () => {
    setStatus('ended');
    try {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {}

    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? 'fixed inset-2 max-w-none h-[calc(100vh-1rem)]' : 'max-h-[90vh]'
        }`}
      >
        {/* Call Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wide">BUP Secured WebRTC • End-to-End Encrypted</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>HD Voice</span>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Call Viewport Content */}
        <div className="relative flex-1 min-h-[380px] p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)]" />

          {/* Main Participant Display */}
          {callType === 'video' && !isVideoOff ? (
            <div className="relative w-full h-full max-h-[360px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group">
              <img
                src={recipient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                alt={recipient.name}
                className="w-full h-full object-cover opacity-85 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 text-left">
                <p className="text-base font-bold text-white drop-shadow-md">{recipient.name}</p>
                <p className="text-xs text-blue-200">{recipient.department || 'BUP Campus'}</p>
              </div>

              {/* Self Video PiP Thumbnail */}
              <div className="absolute bottom-4 right-4 w-28 h-36 sm:w-36 sm:h-44 rounded-xl overflow-hidden bg-slate-900 border-2 border-bup-500 shadow-xl flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                  alt="You"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                  You (Live)
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="relative">
                {status === 'ringing' && (
                  <span className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping" />
                )}
                {status === 'connected' && (
                  <span className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-pulse" />
                )}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-bup-500/80 shadow-2xl relative">
                  <img
                    src={recipient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={recipient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">{recipient.name}</h3>
                <p className="text-xs text-slate-400">{recipient.department || 'BUP ICT'}</p>
              </div>

              {/* Status or Live Duration */}
              <div className="pt-2">
                {status === 'ringing' ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ringing campus peer...</span>
                  </div>
                ) : status === 'connected' ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-1 h-5 px-1">
                      <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_100ms] h-3" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_300ms] h-5" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms] h-2" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_400ms] h-4" />
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                      {formatDuration(duration)}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-red-400 font-semibold">Call Ended</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Controls Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
          {/* Mic Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-md active:scale-95 ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => {
              if (callType === 'audio') {
                setCallType('video');
                setIsVideoOff(false);
              } else {
                setIsVideoOff(!isVideoOff);
              }
            }}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-md active:scale-95 ${
              isVideoOff
                ? 'bg-slate-800 text-slate-400 hover:text-white'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'
            }`}
            title={isVideoOff ? 'Start Video' : 'Stop Video'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share Toggle */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-md active:scale-95 ${
              isScreenSharing
                ? 'bg-purple-600 text-white shadow-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-md active:scale-95 ${
              !isSpeakerOn
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleHangup}
            className="p-3.5 sm:p-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-lg shadow-rose-600/40 active:scale-95 flex items-center gap-2"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xs sm:text-sm">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
