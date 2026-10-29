'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleQuickFill = () => {
    setEmail('admin@meraindia.co.uk');
    setPassword('Admin@12345');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!email.trim()) {
      setError('Please enter your admin email');
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password');
      }

      setSuccess('Logged in successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 700);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f0521] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative gradient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center space-x-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 p-[2px] shadow-xl group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#1f0521] rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300 text-lg">
                MI
              </span>
            </div>
          </div>
          <span className="font-bold text-2xl text-pink-500">
            Mera<span className="text-amber-400">India</span>
          </span>
        </Link>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Protected Admin Portal</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
          Admin Sign In
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-400">
          Manage UK events, ticket variants, dates, and Cloudinary media.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#29082c]/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-purple-800/60">
          
          {/* Quick Demo Credentials Notice */}
          <div className="mb-6 p-3.5 rounded-2xl bg-purple-950/70 border border-purple-700/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-pink-300">Default Admin Credentials:</p>
              <p className="text-stone-300 mt-0.5">admin@meraindia.co.uk</p>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1.5 rounded-lg bg-pink-600/30 hover:bg-pink-600 border border-pink-500/40 text-pink-200 hover:text-white text-[11px] font-semibold transition-colors"
            >
              Auto Fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-purple-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@meraindia.co.uk"
                  className="block w-full pl-10 pr-3 py-2.5 bg-purple-950/60 border border-purple-800 rounded-xl text-sm text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-purple-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-purple-950/60 border border-purple-800 rounded-xl text-sm text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-900/60 text-center">
            <Link
              href="/"
              className="text-xs text-purple-300 hover:text-pink-400 transition-colors"
            >
              ← Return to MeraIndia Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
