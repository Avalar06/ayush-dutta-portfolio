import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ResetPasswordProps {
  onSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionChecked(true);
      if (!session) {
        setError('Password reset link has expired or is invalid. Please request a new password reset from the admin login page.');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionChecked(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. The link may have expired.');
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
          <h1 className="text-xl font-bold text-[#F8FAFC]">Set New Password</h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">SECURE ADMIN RECOVERY</p>
        </div>

        {success ? (
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-4 rounded-lg text-xs space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#10B981]" />
            <p className="font-semibold">Password updated successfully!</p>
            <p className="text-[#94A3B8]">Redirecting you to the admin console...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                  New Password
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

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#151F2E] border border-[#263449] focus:border-[#2563EB] rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !sessionChecked}
                className="w-full flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-50 text-[#F8FAFC] font-medium py-2.5 rounded-lg text-xs transition-colors shadow-sm"
              >
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-[#263449] text-center">
          <a href="/admin" className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            ← Back to Admin Login
          </a>
        </div>
      </div>
    </div>
  );
};
