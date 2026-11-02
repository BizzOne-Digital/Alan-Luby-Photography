import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { telHref } from '../../site/content';
import { Badge, EmptyState, ErrorState, PageHeader, Pager, Pagination, Spinner, btn, card, formatDate, inputClass, qs, useApi, useConfirm, useDebounced, useToast } from '../ui';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  location: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const InquiriesView: React.FC = () => {
  const [q, setQ] = useState('');
  const [read, setRead] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const search = useDebounced(q);
  useEffect(() => setPage(1), [search, read]);
  const { data, error, loading, reload } = useApi<{ data: Inquiry[]; pagination: Pagination }>(`/contact${qs({ q: search, read, page, limit: 20 })}`);
  const [items, setItems] = useState<Inquiry[]>([]);
  useEffect(() => setItems(data?.data ?? []), [data]);
  const confirm = useConfirm();
  const toast = useToast();

  const setReadState = async (item: Inquiry, value: boolean, quiet = false) => {
    try {
      await api(`/contact/${item._id}`, { method: 'PATCH', body: { read: value } });
      setItems((all) => all.map((x) => (x._id === item._id ? { ...x, read: value } : x)));
      if (!quiet) toast.success(value ? 'Marked as read.' : 'Marked as unread.');
    } catch (err) {
      toast.error(err);
    }
  };

  const open = (item: Inquiry) => {
    const next = openId === item._id ? null : item._id;
    setOpenId(next);
    if (next && !item.read) setReadState(item, true, true);
  };

  const remove = async (item: Inquiry) => {
    if (!(await confirm({ title: `Delete the inquiry from ${item.name}?`, text: 'It will be permanently removed. This cannot be undone.', confirmLabel: 'Delete inquiry', danger: true }))) return;
    try {
      await api(`/contact/${item._id}`, { method: 'DELETE' });
      toast.success('Inquiry deleted.');
      reload();
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader title="Inquiries" text="Messages sent through the website’s contact form. Opening one marks it as read." />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message or service" aria-label="Search inquiries" className={`${inputClass} mt-0`} />
        <select value={read} onChange={(e) => setRead(e.target.value)} aria-label="Filter by status" className={`${inputClass} mt-0`}>
          <option value="">All inquiries</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <Spinner /> : items.length === 0 ? (
        <EmptyState title={q || read ? 'No inquiries match' : 'No inquiries yet'} text={q || read ? 'Try a different search or filter.' : 'When someone sends the contact form, their message will appear here.'} />
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((item) => {
              const isOpen = openId === item._id;
              return (
                <li key={item._id} className={`${card} ${item.read ? '' : 'border-l-4 border-l-accent'}`}>
                  <button type="button" onClick={() => open(item)} aria-expanded={isOpen} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left">
                    {item.read ? <MailOpen className="h-4 w-4 text-muted" aria-hidden /> : <Mail className="h-4 w-4 text-accent" aria-hidden />}
                    <span className={`min-w-[10rem] ${item.read ? '' : 'font-semibold'}`}>{item.name}</span>
                    <span className="text-sm text-muted">{item.service || 'No service chosen'}</span>
                    {!item.read && <Badge tone="warn">New</Badge>}
                    <span className="ml-auto text-sm text-muted">{formatDate(item.createdAt)}</span>
                    {!isOpen && <span className="basis-full truncate pl-8 text-sm text-muted">{item.message}</span>}
                  </button>
                  {isOpen && (
                    <div className="space-y-4 border-t border-line p-4 sm:pl-12">
                      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                        <div><dt className="font-semibold">Email</dt><dd><a className="text-link" href={`mailto:${item.email}`}>{item.email}</a></dd></div>
                        {item.phone && <div><dt className="font-semibold">Phone</dt><dd><a className="text-link" href={telHref(item.phone)}>{item.phone}</a></dd></div>}
                        {item.date && <div><dt className="font-semibold">Date</dt><dd>{item.date}</dd></div>}
                        {item.location && <div><dt className="font-semibold">Location</dt><dd>{item.location}</dd></div>}
                      </dl>
                      <p className="whitespace-pre-wrap rounded-md bg-paper p-4">{item.message}</p>
                      <div className="flex flex-wrap gap-2">
                        <a className={btn.primary} href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: your photography inquiry${item.service ? ` (${item.service})` : ''}`)}`}><Reply className="h-4 w-4" aria-hidden /> Reply by email</a>
                        {item.phone && <a className={btn.secondary} href={telHref(item.phone)}><Phone className="h-4 w-4" aria-hidden /> Call</a>}
                        <button type="button" className={btn.secondary} onClick={() => setReadState(item, !item.read)}>{item.read ? 'Mark as unread' : 'Mark as read'}</button>
                        <button type="button" className={btn.ghost} onClick={() => remove(item)}><Trash2 className="h-4 w-4" aria-hidden /> Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Pager pagination={data?.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
};
