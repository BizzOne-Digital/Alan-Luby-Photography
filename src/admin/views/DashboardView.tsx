import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, ImagePlus, Inbox, Settings } from 'lucide-react';
import { useAuth } from '../AdminApp';
import { Badge, ErrorState, PageHeader, Spinner, btn, card, formatBytes, formatDate, useApi } from '../ui';

interface Stats {
  photos: { total: number; inWork: number; featured: number };
  services: { total: number; visible: number };
  testimonials: { total: number; shown: number };
  pages: { total: number; published: number };
  inquiries: { total: number; unread: number; last30Days: number };
  uploads: { total: number; bytes: number };
  recentActivity: { _id: string; action: string; summary: string; adminEmail: string; createdAt: string }[];
  recentInquiries: { _id: string; name: string; service: string; read: boolean; createdAt: string }[];
}

const Stat: React.FC<{ label: string; value: number | string; detail: string; to: string; alert?: boolean }> = ({ label, value, detail, to, alert }) => (
  <Link to={to} className={`${card} block p-5 transition-colors hover:border-accent/50 ${alert ? 'border-amber-300 bg-amber-50' : ''}`}>
    <p className="text-sm font-semibold text-muted">{label}</p>
    <p className="mt-2 font-display text-4xl">{value}</p>
    <p className="mt-1 text-sm text-muted">{detail}</p>
  </Link>
);

export const DashboardView: React.FC = () => {
  const { admin } = useAuth();
  const { data, error, loading, reload } = useApi<{ data: Stats }>('/dashboard/stats');
  const s = data?.data;

  return (
    <>
      <PageHeader title={`Welcome back${admin?.name && admin.name !== 'Administrator' ? `, ${admin.name}` : ''}`} text="An overview of the website and what needs your attention." />

      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !s ? <Spinner /> : s && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Stat label="New inquiries" value={s.inquiries.unread} detail={`${s.inquiries.last30Days} in the last 30 days · ${s.inquiries.total} total`} to="/admin/inquiries" alert={s.inquiries.unread > 0} />
            <Stat label="Photos" value={s.photos.total} detail={`${s.photos.inWork} in the Work gallery · ${s.photos.featured} on the homepage`} to="/admin/photos" />
            <Stat label="Services" value={s.services.total} detail={`${s.services.visible} visible on the site`} to="/admin/services" />
            <Stat label="Testimonials" value={s.testimonials.total} detail={`${s.testimonials.shown} on the Testimonials page`} to="/admin/testimonials" />
            <Stat label="Pages" value={s.pages.total} detail={`${s.pages.published} published`} to="/admin/pages" />
            <Stat label="Uploaded images" value={s.uploads.total} detail={`${formatBytes(s.uploads.bytes)} stored in the database`} to="/admin/photos" />
          </div>

          <section aria-labelledby="quick" className="mt-8">
            <h2 id="quick" className="mb-3 font-sans text-lg font-semibold">Quick actions</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/photos/new" className={btn.primary}><ImagePlus className="h-4 w-4" aria-hidden /> Add a photo</Link>
              <Link to="/admin/pages/home" className={btn.secondary}><FileText className="h-4 w-4" aria-hidden /> Edit the homepage</Link>
              <Link to="/admin/inquiries" className={btn.secondary}><Inbox className="h-4 w-4" aria-hidden /> Read inquiries</Link>
              <Link to="/admin/settings" className={btn.secondary}><Settings className="h-4 w-4" aria-hidden /> Contact details</Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className={btn.secondary}><ExternalLink className="h-4 w-4" aria-hidden /> View the website</a>
            </div>
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <section aria-labelledby="recent-inquiries" className={`${card} p-5`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 id="recent-inquiries" className="font-sans text-lg font-semibold">Latest inquiries</h2>
                <Link to="/admin/inquiries" className="text-link text-sm">View all</Link>
              </div>
              {s.recentInquiries.length === 0 ? <p className="text-muted">No inquiries yet. Messages sent through the contact form will appear here.</p> : (
                <ul className="divide-y divide-line">
                  {s.recentInquiries.map((q) => (
                    <li key={q._id} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="min-w-0">
                        <span className="font-medium">{q.name}</span>
                        <span className="block truncate text-sm text-muted">{q.service || 'No service chosen'} · {formatDate(q.createdAt)}</span>
                      </span>
                      {!q.read && <Badge tone="warn">New</Badge>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="recent-activity" className={`${card} p-5`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 id="recent-activity" className="font-sans text-lg font-semibold">Recent activity</h2>
                <Link to="/admin/activity" className="text-link text-sm">Full log</Link>
              </div>
              {s.recentActivity.length === 0 ? <p className="text-muted">No activity yet.</p> : (
                <ul className="divide-y divide-line">
                  {s.recentActivity.map((a) => (
                    <li key={a._id} className="py-2.5">
                      <span className="font-medium">{a.summary}</span>
                      <span className="block text-sm text-muted">{a.adminEmail} · {formatDate(a.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
};
