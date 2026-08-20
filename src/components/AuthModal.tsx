import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Lock, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  Check, 
  Zap, 
  TrendingUp,
  Mail,
  Briefcase,
  Link as LinkIcon
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, users } = useApp();
  
  const [step, setStep] = useState<'signin' | 'signup' | 'forgot_password' | 'enter_otp' | 'reset_password'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);

  // Form Fields
  const [identifier, setIdentifier] = useState('vikram_quant');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  
  // Comprehensive Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [traderType, setTraderType] = useState<'Options Pro' | 'Intraday Scalper' | 'Swing Trader' | 'Equity Quant'>('Options Pro');

  // Trader Avatars Presets (Golden Bull, Research Quant, Intraday Scalper, Swing Trader, etc.)
  const traderAvatarOptions: { id: string; label: string; url: string; fallbackUrl: string }[] = [
    {
      id: 'bull',
      label: '🐂 Golden Bull',
      url: '/avatars/bull.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'research',
      label: '📈 Research Quant',
      url: '/avatars/research.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'scalper',
      label: '🚀 Intraday Scalper',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'swing',
      label: '📊 Swing Trader',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'risk',
      label: '🛡️ Macro Strategist',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'options',
      label: '💎 Options Specialist',
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    }
  ];

  const [selectedAvatar, setSelectedAvatar] = useState<string>(traderAvatarOptions[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');

  // OTP Fields (5 Digits)
  const [otp, setOtp] = useState<string[]>(['2', '8', '9', '', '']);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  if (!isAuthModalOpen) return null;

  const isUsernameTaken = username.trim() ? users.some(u => u.username.toLowerCase() === username.toLowerCase().replace('@', '')) : false;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login(identifier);
    setIsAuthModalOpen(false);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email) return;

    signup({
      name,
      username: username.replace('@', '').trim(),
      traderType,
      avatar: customAvatarUrl.trim() || selectedAvatar,
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-[32px] w-full max-w-sm max-h-[95vh] overflow-y-auto p-6 sm:p-7 shadow-[0_20px_50px_rgba(37,99,235,0.12)] animate-fadeIn text-slate-800 dark:text-gray-100 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Logo Header */}
        <div className="text-center space-y-1 pb-3">
          <div className="inline-flex items-center gap-2">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-md shadow-blue-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Bullpost
            </span>
          </div>
        </div>

        {/* SCREEN 1: SIGN IN */}
        {step === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 animate-fadeIn">
            
            <div className="text-left space-y-0.5">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Sign in to your Bullpost account</p>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setStep('forgot_password')}
                className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all"
            >
              Sign In
            </button>

            {/* Social Icons */}
            <div className="pt-2 text-center space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                <span className="bg-white dark:bg-[#0e1524] px-3 text-[11px] text-slate-400 dark:text-gray-400 font-medium">
                  Or
                </span>
                <div className="border-t border-slate-200 dark:border-white/10 w-full" />
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => { login('vikram_quant'); setIsAuthModalOpen(false); }}
                  className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] flex items-center justify-center shadow-sm"
                >
                  <span className="text-lg font-bold text-slate-900 dark:text-white"></span>
                </button>

                <button
                  type="button"
                  onClick={() => { login('vikram_quant'); setIsAuthModalOpen(false); }}
                  className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] flex items-center justify-center shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.3-.8-.4-1.7-.4-2.7s.1-1.9.4-2.7L1.6 6.4C.6 8.4 0 10.1 0 12s.6 3.6 1.6 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => { login('sneha_options'); setIsAuthModalOpen(false); }}
                  className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] flex items-center justify-center text-[#1877F2] shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-gray-400 font-medium">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => setStep('signup')}
                className="text-[#2563EB] dark:text-[#60A5FA] font-extrabold hover:underline"
              >
                Create account
              </button>
            </div>

          </form>
        )}

        {/* SCREEN 2: COMPREHENSIVE CREATE ACCOUNT WITH TRADER AVATARS */}
        {step === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 animate-fadeIn">
            
            <div className="text-left space-y-0.5">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create account</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Choose your trader avatar & profile setup</p>
            </div>

            {/* 1. Trader Avatar Selection Grid */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#131c30] border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-gray-300">Select Trader Avatar</label>
                <button
                  type="button"
                  onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                  className="text-[10px] text-[#2563EB] dark:text-[#60A5FA] font-bold flex items-center gap-1 hover:underline"
                >
                  <LinkIcon className="w-3 h-3" /> Custom Image URL
                </button>
              </div>

              {!showCustomUrlInput ? (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {traderAvatarOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(item.url);
                        setCustomAvatarUrl('');
                      }}
                      className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                        selectedAvatar === item.url 
                          ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-500/20 text-[#2563EB] dark:text-[#60A5FA] font-bold shadow-sm' 
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1524] text-slate-600 dark:text-gray-400 hover:border-slate-300'
                      }`}
                    >
                      <img 
                        src={item.url} 
                        onError={(e) => { (e.target as HTMLImageElement).src = item.fallbackUrl; }}
                        alt={item.label} 
                        className="w-11 h-11 rounded-full object-cover border border-white/20 mb-1 shadow-sm" 
                      />
                      <span className="text-[9px] font-extrabold leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pt-1 space-y-1">
                  <input
                    type="url"
                    placeholder="Paste Custom Avatar Image URL..."
                    value={customAvatarUrl}
                    onChange={(e) => {
                      setCustomAvatarUrl(e.target.value);
                      setSelectedAvatar(e.target.value);
                    }}
                    className="w-full bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}
            </div>

            {/* 2. Full Profile Name */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full Profile Name (e.g. Rishi Kumar)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* 3. Email Address */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email Address (e.g. rishi@trader.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* 4. Unique Trader Handle (@username) */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <span className="text-slate-400 absolute left-4 font-mono text-xs">@</span>
                <input
                  type="text"
                  placeholder="Trader Handle (@username)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-8 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-mono"
                  required
                />
                {username && (
                  <span className="absolute right-4">
                    {isUsernameTaken ? (
                      <span className="text-red-500 text-xs font-bold">Taken</span>
                    ) : (
                      <Check className="w-4 h-4 text-emerald-500" />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* 5. Trader Category Picker */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <select
                  value={traderType}
                  onChange={(e) => setTraderType(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium appearance-none"
                >
                  <option value="Options Pro">Options Pro (CE/PE Setup)</option>
                  <option value="Intraday Scalper">Intraday Scalper (Nifty/BankNifty)</option>
                  <option value="Swing Trader">Swing Trader (Breakout Calls)</option>
                  <option value="Equity Quant">Equity Quant (Long-term Investor)</option>
                </select>
              </div>
            </div>

            {/* 6. Password Input Pill */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 7. Confirm Password Input Pill */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Retype your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUsernameTaken}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-50 mt-1"
            >
              Create account
            </button>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-gray-400 font-medium">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => setStep('signin')}
                className="text-[#2563EB] dark:text-[#60A5FA] font-extrabold hover:underline"
              >
                Log in
              </button>
            </div>

          </form>
        )}

        {/* SCREEN 3: FORGET PASSWORD */}
        {step === 'forgot_password' && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Forget password?</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Forgot Password? Quickly Reset Your Password</p>
            </div>

            <input
              type="text"
              placeholder="Enter your username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
              required
            />

            <button
              type="button"
              onClick={() => setStep('enter_otp')}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* SCREEN 4: ENTER OTP */}
        {step === 'enter_otp' && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Key className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Enter OTP</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Enter the 5-Digit Code Sent to You</p>
            </div>

            <div className="flex justify-center gap-2 py-1">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-11 text-center font-bold text-lg rounded-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-300 dark:border-white/10 focus:border-[#2563EB] text-slate-900 dark:text-white focus:outline-none transition-all"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep('reset_password')}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* SCREEN 5: RESET PASSWORD */}
        {step === 'reset_password' && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Reset password</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Create your Bullpost Account Password</p>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => {
                alert('Password successfully reset!');
                login(identifier);
                setIsAuthModalOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all"
            >
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
