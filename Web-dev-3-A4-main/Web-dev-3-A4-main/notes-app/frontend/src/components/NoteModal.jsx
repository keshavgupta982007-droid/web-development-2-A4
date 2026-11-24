import { useState } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../constants';
import { errMsg } from '../api';

export default function NoteModal({ note, onSave, onClose }) {
  const [form, setForm] = useState({
    _id: note?._id,
    title: note?.title || '',
    content: note?.content || '',
    color: note?.color || 'yellow',
    pinned: note?.pinned || false,
    tags: (note?.tags || []).join(', '),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
      await onSave({ ...form, tags });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="modal" style={{ background: COLORS[form.color] }} onMouseDown={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="icon close" onClick={onClose} title="Close"><X size={18} /></button>
        <input className="m-title" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} autoFocus />
        <textarea className="m-body" placeholder="Start writing…" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={5000} />
        <input className="m-tags" placeholder="Tags, separated by commas" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        {error && <div className="alert">{error}</div>}
        <div className="m-actions">
          <div className="swatches">
            {Object.entries(COLORS).map(([key, hex]) => (
              <button type="button" key={key} aria-label={key} title={key}
                className={`swatch ${form.color === key ? 'sel' : ''}`} style={{ background: hex }}
                onClick={() => setForm({ ...form, color: key })} />
            ))}
          </div>
          <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save note'}</button>
        </div>
      </form>
    </div>
  );
}
