import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('Dayush849@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setError('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        // Verify admin authorization in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', data.session.user.id)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          throw new Error('Access denied. This account is not authorized as an administrator.');
        }

        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] border border-[#263449] rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Ayush Dutta — Secure Admin</h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">SUPABASE AUTHENTICATED CONSOLE</p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3.5 rounded-lg mb-6 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold block mb-1">Supabase Setup Required</span>
              <span>Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable secure login.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151F2E] border border-[#263449] focus:border-[#2563EB] rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#151F2E] border border-[#263449] focus:border-[#2563EB] rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-50 text-[#F8FAFC] font-medium py-2.5 rounded-lg text-xs transition-colors shadow-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#263449] text-center">
          <a href="/" className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            ← Return to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};
