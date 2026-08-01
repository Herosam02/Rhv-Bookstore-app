import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit3, ImageUp, Loader2, RotateCcw, Send, ShieldCheck, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { classNames } from '../utils/format';

interface EditableTextProps {
  k: string;
  fallback: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  multiline?: boolean;
}

/** Renders the published value for normal users; for admins shows the draft
 *  (or fallback) plus an inline edit affordance and save/publish controls. */
export function EditableText({ k, fallback, as = 'p', className, multiline }: EditableTextProps) {
  const { isAdmin, resolveValue, overrides, saveDraft, publish, revert } = useAdmin();
  const value = resolveValue(k, fallback);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  if (!isAdmin) {
    const Tag = as as any;
    return <Tag className={className}>{value}</Tag>;
  }

  const ov = overrides[k];
  const hasDraft = !!ov && ov.draft_value != null && ov.draft_value !== (ov.published_value ?? fallback);
  const isPublished = !!ov && ov.published_value != null;

  const save = async () => {
    setBusy(true);
    try {
      await saveDraft(k, 'text', draft);
    } finally {
      setBusy(false);
      setEditing(false);
    }
  };

  const Tag = as as any;

  return (
    <span className="group/edit relative inline-block w-full">
      {editing ? (
        <span className="block">
          {multiline ? (
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              className={classNames('w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2 text-sm outline-none ring-2 ring-brand-400', className)}
            />
          ) : (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className={classNames('w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2 text-sm outline-none ring-2 ring-brand-400', className)}
            />
          )}
          <span className="mt-1 flex items-center gap-1">
            <button onClick={save} disabled={busy} className="inline-flex items-center gap-1 rounded-md bg-brand-500 text-white px-2 py-1 text-[11px] font-semibold">
              {busy ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save draft
            </button>
            <button onClick={() => { setEditing(false); setDraft(value); }} className="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-2 py-1 text-[11px] font-medium">
              <X size={11} /> Cancel
            </button>
          </span>
        </span>
      ) : (
        <span className="block">
          <Tag className={className}>{value}</Tag>
          <span className="mt-1 flex items-center gap-1">
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 rounded-md bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 px-2 py-1 text-[11px] font-semibold opacity-0 group-hover/edit:opacity-100 transition-opacity">
              <Edit3 size={11} /> Edit
            </button>
            {hasDraft && (
              <button onClick={() => publish(k)} className="inline-flex items-center gap-1 rounded-md bg-emerald-500 text-white px-2 py-1 text-[11px] font-semibold">
                <Send size={11} /> Publish
              </button>
            )}
            {isPublished && (
              <button onClick={() => revert(k)} className="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-2 py-1 text-[11px] font-medium">
                <RotateCcw size={11} /> Revert
              </button>
            )}
          </span>
        </span>
      )}
    </span>
  );
}

interface EditableImageProps {
  k: string;
  fallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/** Renders the published image for normal users; for admins shows the draft
 *  image (or fallback) plus upload/publish/revert controls. */
export function EditableImage({ k, fallback, alt, className, imgClassName }: EditableImageProps) {
  const { isAdmin, resolveValue, overrides, saveDraft, publish, revert, uploadImage } = useAdmin();
  const value = resolveValue(k, fallback);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className={className}>
        <img src={value} alt={alt} className={imgClassName} />
      </div>
    );
  }

  const ov = overrides[k];
  const hasDraft = !!ov && ov.draft_value != null && ov.draft_value !== (ov.published_value ?? fallback);
  const isPublished = !!ov && ov.published_value != null;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file, k);
      if (url) await saveDraft(k, 'image', url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={classNames('group/edit-img relative', className)}>
      <img src={value} alt={alt} className={imgClassName} />
      <div className="absolute inset-0 rounded-[inherit] bg-black/0 group-hover/edit-img:bg-black/20 transition-colors" />
      <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover/edit-img:opacity-100 transition-opacity">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md bg-brand-500 text-white px-2 py-1 text-[11px] font-semibold shadow"
        >
          {busy ? <Loader2 size={11} className="animate-spin" /> : <ImageUp size={11} />} Upload
        </button>
        {hasDraft && (
          <button onClick={() => publish(k)} className="inline-flex items-center gap-1 rounded-md bg-emerald-500 text-white px-2 py-1 text-[11px] font-semibold shadow">
            <Send size={11} /> Publish
          </button>
        )}
        {isPublished && (
          <button onClick={() => revert(k)} className="inline-flex items-center gap-1 rounded-md bg-black/60 text-white px-2 py-1 text-[11px] font-medium shadow">
            <RotateCcw size={11} /> Revert
          </button>
        )}
      </div>
      {hasDraft && (
        <span className="absolute bottom-2 left-2 rounded-md bg-amber-500 text-white px-2 py-0.5 text-[10px] font-semibold shadow">
          Draft
        </span>
      )}
    </div>
  );
}

/** Floating toolbar shown only to admins: a quick indicator that admin mode is on. */
export function AdminModeBadge() {
  const { isAdmin } = useAdmin();
  return (
    <AnimatePresence>
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 left-24 z-[65] inline-flex items-center gap-1.5 rounded-full bg-brand-500 text-white px-3 py-1.5 text-xs font-semibold shadow-lg shadow-brand-500/30 pointer-events-none"
        >
          <ShieldCheck size={13} /> Admin mode
        </motion.div>
      )}
    </AnimatePresence>
  );
}
