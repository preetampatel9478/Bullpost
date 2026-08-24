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
  TrendingUp,
  Mail,
  Check
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, users } = useApp();
  
  const [step, setStep] = useState<'signin' | 'signup' | 'forgot_password' | 'enter_otp' | 'reset_password'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields for Sign In
  const [identifier, setIdentifier] = useState('vikram_quant');
  const [password, setPassword] = useState('password123');

  // Form Fields for Sign Up (Matches screenshot media_1787583115294.png)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [traderType, setTraderType] = useState<'Options Pro' | 'Intraday Scalper' | 'Swing Trader' | 'Equity Quant'>('Options Pro');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-white/10 rounded-[36px] w-full max-w-sm max-h-[95vh] overflow-y-auto p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-fadeIn text-slate-800 dark:text-gray-100 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Logo Header */}
        <div className="text-center space-y-1 pb-2">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Bullpost
            </span>
          </div>
        </div>

        {/* SCREEN 1: SIGN IN (Matches screenshot media_1787583046381.png) */}
        {step === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 animate-fadeIn">
            
            <div className="text-left space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Sign in to your Bullpost account</p>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
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
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-5 pr-12 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setStep('forgot_password')}
                className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all"
            >
              Sign In
            </button>

            {/* Social Icons */}
            <div className="pt-2 text-center space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                <span className="bg-white dark:bg-[#0e1524] px-3 text-xs text-slate-400 dark:text-gray-400 font-medium">
                  Or
                </span>
                <div className="border-t border-slate-200 dark:border-white/10 w-full" />
              </div>

              <div className="flex items-center justify-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => { login('vikram_quant'); setIsAuthModalOpen(false); }}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] flex items-center justify-center shadow-sm"
                >
                  <span className="text-xl font-bold text-slate-900 dark:text-white"></span>
                </button>

                <button
                  type="button"
                  onClick={() => { login('vikram_quant'); setIsAuthModalOpen(false); }}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] flex items-center justify-center shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.3-.8-.4-1.7-.4-2.7s.1-1.9.4-2.7L1.6 6.4C.6 8.4 0 10.1 0 12s.6 3.6 1.6 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => { login('sneha_options'); setIsAuthModalOpen(false); }}
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] flex items-center justify-center text-[#1877F2] shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
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
                className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline"
              >
                Create account
              </button>
            </div>

          </form>
        )}

        {/* SCREEN 2: CREATE ACCOUNT (Matches screenshot media_1787583115294.png) */}
        {step === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 animate-fadeIn">
            
            <div className="text-left space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create account</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Join Bullpost as a trader</p>
            </div>

            {/* 1. Full name input pill with User Icon */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full name (e.g. Rishi Kumar)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* 2. Email address input pill with Mail Icon */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* 3. Trader handle input pill with @ symbol */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <span className="text-slate-400 absolute left-4.5 font-medium text-sm">@</span>
                <input
                  type="text"
                  placeholder="Trader handle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
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

            {/* 4. Trader Category Selection Badges (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2 pt-1 pb-0.5">
              {[
                { id: 'Options Pro', label: 'Options Pro' },
                { id: 'Intraday Scalper', label: 'Intraday Scalper' },
                { id: 'Swing Trader', label: 'Swing Trader' },
                { id: 'Equity Quant', label: 'Equity Quant' }
              ].map((item) => {
                const isSelected = traderType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTraderType(item.id as any)}
                    className={`py-2 px-3 rounded-full text-xs transition-all border text-center font-medium ${
                      isSelected
                        ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/60 dark:bg-blue-500/20 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#131c30] text-slate-600 dark:text-gray-300 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* 5. Create a password input pill */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-5 pr-12 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* 6. Confirm password input pill */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full pl-5 pr-12 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUsernameTaken}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-50 mt-1"
            >
              Create account
            </button>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-gray-400 font-medium">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => setStep('signin')}
                className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline"
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
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Forget password?</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Forgot Password? Quickly Reset Your Password</p>
            </div>

            <input
              type="text"
              placeholder="Enter your username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all"
              required
            />

            <button
              type="button"
              onClick={() => setStep('enter_otp')}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
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
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Enter OTP</h2>
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
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
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
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Reset password</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">Create your Bullpost Account Password</p>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#131c30] border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-all font-medium"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => {
                alert('Password reset successful!');
                login(identifier);
                setIsAuthModalOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
