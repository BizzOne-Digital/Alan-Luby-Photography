import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ApiError, api, setCsrfToken } from '../../lib/api';
import { useAuth, AdminUser } from '../AdminApp';
import { TextField, btn, fieldErrors } from '../ui';

export const LoginView: React.FC = () => {
  const { admin, signIn } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (admin) return <Navigate to={from && from !== '/admin/login' ? from : '/admin/dashboard'} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setErrors({});
    try {
      // A fresh CSRF token for this browser session, then the sign-in itself.
      const pre = await api<{ data: { csrfToken: string } }>('/auth/csrf');
      setCsrfToken(pre.data.csrfToken);
      const { data } = await api<{ data: { admin: AdminUser; csrfToken: string } }>('/auth/login', { method: 'POST', body: { email, password } });
      signIn(data.admin, data.csrfToken);
      navigate(from && from !== '/admin/login' ? from : '/admin/dashboard', { replace: true });
    } catch (err) {
      setErrors(fieldErrors(err));
      setError(err instanceof ApiError && !err.details ? err.message : err instanceof ApiError ? '' : 'Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <img src="/brand/premium-v1/vector/primary.svg" alt="Alan Luby Photography" className="mx-auto h-auto w-72" />
        <form onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-xl border border-line bg-white p-6 shadow-sm">
          <div>
            <h1 className="font-sans text-xl font-semibold">Sign in to manage the website</h1>
            <p className="mt-1 text-sm text-muted">For the site owner only.</p>
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-900" role="alert">{error}</p>}
          <TextField label="Email" name="email" type="email" value={email} onChange={setEmail} error={errors.email} required />
          <TextField label="Password" name="password" type="password" value={password} onChange={setPassword} error={errors.password} required />
          <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};
