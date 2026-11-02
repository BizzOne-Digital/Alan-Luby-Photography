import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ExternalLink, FileText, Images, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Sparkles, X } from 'lucide-react';
import { api, apiEnabled, setCsrfToken, setUnauthorizedHandler } from '../lib/api';
import { ConfirmProvider, Spinner, ToastProvider, btn, useToast } from './ui';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { PhotosView, PhotoEditView } from './views/PhotosView';
import { ServicesView, ServiceEditView } from './views/ServicesView';
import { TestimonialsView, TestimonialEditView } from './views/TestimonialsView';
import { PagesView, PageEditView } from './views/PagesView';
import { SettingsView } from './views/SettingsView';
import { InquiriesView } from './views/InquiriesView';
import { ActivityView } from './views/ActivityView';

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  lastLoginAt?: string;
}

interface AuthState {
  admin: AdminUser | null;
  signIn: (admin: AdminUser, csrfToken: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>(null!);
export const useAuth = () => useContext(AuthContext);

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/photos', label: 'Photos', icon: Images },
  { to: '/admin/services', label: 'Services', icon: Sparkles },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/pages', label: 'Pages', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/activity', label: 'Activity log', icon: Activity },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[16rem_1fr]">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <img src="/brand/premium-v1/vector/monogram.svg" alt="Alan Luby Photography" className="h-10 w-10" />
        <button type="button" className={btn.ghost} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="admin-nav">
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />} Menu
        </button>
      </div>
      <aside id="admin-nav" className={`${open ? 'block' : 'hidden'} border-r border-line bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col`}>
        <div className="hidden border-b border-line p-5 lg:block">
          <img src="/brand/premium-v1/vector/primary.svg" alt="Alan Luby Photography" className="h-auto w-full" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">Website admin</p>
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] font-medium ${isActive ? 'bg-accent text-paper' : 'text-muted hover:bg-sand hover:text-ink'}`}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-line p-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] text-muted hover:bg-sand hover:text-ink">
            <ExternalLink className="h-[18px] w-[18px]" aria-hidden /> View website
          </a>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] text-muted hover:bg-sand hover:text-ink">
            <LogOut className="h-[18px] w-[18px]" aria-hidden /> Sign out
          </button>
          <p className="truncate px-3 pt-2 text-xs text-muted" title={admin?.email}>{admin?.email}</p>
        </div>
      </aside>
      <main id="admin-main" className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null | undefined>(undefined);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    api<{ data: { admin: AdminUser; csrfToken: string } }>('/auth/me')
      .then(({ data }) => {
        setCsrfToken(data.csrfToken);
        setAdmin(data.admin);
      })
      .catch(() => setAdmin(null));
    setUnauthorizedHandler(() => {
      setAdmin(null);
      toast.error('Your session has ended. Please sign in again.');
    });
    return () => setUnauthorizedHandler(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthState = {
    admin: admin ?? null,
    signIn: (a, token) => {
      setCsrfToken(token);
      setAdmin(a);
    },
    signOut: async () => {
      try {
        await api('/auth/logout', { method: 'POST' });
      } catch {
        /* the session is cleared locally either way */
      }
      setCsrfToken('');
      setAdmin(null);
      navigate('/admin/login');
    },
  };

  if (admin === undefined) return <div className="p-8"><Spinner label="Checking your session…" /></div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin } = useAuth();
  const location = useLocation();
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Layout>{children}</Layout>;
};

const NoBackend = () => (
  <div className="mx-auto max-w-lg px-6 py-24">
    <h1 className="font-sans text-2xl font-semibold">The admin area is not connected</h1>
    <p className="mt-3 text-muted">
      This build of the website has no backend address. Set <code className="rounded bg-sand px-1">VITE_API_URL</code> when building the site
      (see the README), then redeploy.
    </p>
    <Link to="/" className={`${btn.secondary} mt-6`}>Back to the website</Link>
  </div>
);

export default function AdminApp() {
  // Keep the admin out of search results.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = 'Admin | Alan Luby Photography';
    return () => meta.remove();
  }, []);

  if (!apiEnabled) return <NoBackend />;

  const page = (el: React.ReactNode) => <Protected>{el}</Protected>;
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <Routes>
            <Route path="login" element={<LoginView />} />
            <Route path="dashboard" element={page(<DashboardView />)} />
            <Route path="inquiries" element={page(<InquiriesView />)} />
            <Route path="photos" element={page(<PhotosView />)} />
            <Route path="photos/:id" element={page(<PhotoEditView />)} />
            <Route path="services" element={page(<ServicesView />)} />
            <Route path="services/:id" element={page(<ServiceEditView />)} />
            <Route path="testimonials" element={page(<TestimonialsView />)} />
            <Route path="testimonials/:id" element={page(<TestimonialEditView />)} />
            <Route path="pages" element={page(<PagesView />)} />
            <Route path="pages/:key" element={page(<PageEditView />)} />
            <Route path="settings" element={page(<SettingsView />)} />
            <Route path="activity" element={page(<ActivityView />)} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
