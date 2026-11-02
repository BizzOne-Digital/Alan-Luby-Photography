import React, { useEffect, useState } from 'react';
import { EmptyState, ErrorState, PageHeader, Pager, Pagination, Spinner, card, formatDate, inputClass, qs, useApi, useDebounced } from '../ui';

interface LogEntry {
  _id: string;
  action: string;
  entity: string;
  summary: string;
  adminEmail: string;
  ip: string;
  createdAt: string;
}

const ENTITIES = ['admin', 'Photo', 'Service', 'Testimonial', 'Page', 'Settings', 'Upload', 'Inquiry'];

export const ActivityView: React.FC = () => {
  const [q, setQ] = useState('');
  const [entity, setEntity] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebounced(q);
  useEffect(() => setPage(1), [search, entity]);
  const { data, error, loading, reload } = useApi<{ data: LogEntry[]; pagination: Pagination }>(`/activity${qs({ q: search, entity, page, limit: 50 })}`);

  return (
    <>
      <PageHeader title="Activity log" text="Every sign-in and change made in the admin, newest first." />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activity" aria-label="Search activity" className={`${inputClass} mt-0`} />
        <select value={entity} onChange={(e) => setEntity(e.target.value)} aria-label="Filter by type" className={`${inputClass} mt-0`}>
          <option value="">Everything</option>
          {ENTITIES.map((e) => <option key={e} value={e}>{e === 'admin' ? 'Sign-ins' : `${e}s`}</option>)}
        </select>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <Spinner /> : data?.data.length === 0 ? (
        <EmptyState title="No activity found" />
      ) : (
        <>
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-sand/50 text-xs uppercase tracking-wide text-muted">
                <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">What</th><th className="px-4 py-3">Who</th><th className="px-4 py-3">IP address</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data?.data.map((a) => (
                  <tr key={a._id} className={a.action === 'auth.login_failed' ? 'bg-amber-50' : ''}>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3">{a.summary}</td>
                    <td className="px-4 py-3 text-muted">{a.adminEmail}</td>
                    <td className="px-4 py-3 text-muted">{a.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager pagination={data?.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
};
