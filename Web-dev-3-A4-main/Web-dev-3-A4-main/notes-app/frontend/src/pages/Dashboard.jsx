import { useEffect, useMemo, useState } from 'react';
import { LogOut, Plus, Search, NotebookPen } from 'lucide-react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const sortNotes = (list) =>
  [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt) - new Date(a.updatedAt));

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new note

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get('/notes', { params: { q } });
        setNotes(data);
        setError('');
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const save = async (form) => {
    const { data } = form._id ? await api.put(`/notes/${form._id}`, form) : await api.post('/notes', form);
    setNotes((n) => sortNotes(form._id ? n.map((x) => (x._id === data._id ? data : x)) : [data, ...n]));
    setEditing(null);
  };

  const togglePin = async (note) => {
    const { data } = await api.put(`/notes/${note._id}`, { pinned: !note.pinned });
    setNotes((n) => sortNotes(n.map((x) => (x._id === data._id ? data : x))));
  };

  const remove = async (note) => {
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    await api.delete(`/notes/${note._id}`);
    setNotes((n) => n.filter((x) => x._id !== note._id));
  };

  const shown = useMemo(() => (tab === 'pinned' ? notes.filter((n) => n.pinned) : notes), [notes, tab]);
  const pinnedCount = notes.filter((n) => n.pinned).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dash">
      <header className="topbar">
        <div className="brand brand-sm">Jotter</div>
        <label className="search">
          <Search size={16} />
          <input placeholder="Search notes, tags…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="who">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <button className="btn ghost" onClick={logout}><LogOut size={16} /> Sign out</button>
        </div>
      </header>

      <main className="content">
        <section className="hello">
          <div>
            <h1>{greeting}, {user.name.split(' ')[0]}</h1>
            <p className="muted">{notes.length} {notes.length === 1 ? 'note' : 'notes'} · {pinnedCount} pinned</p>
          </div>
          <button className="btn primary" onClick={() => setEditing({})}><Plus size={18} /> New note</button>
        </section>

        <div className="tabs">
          <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All notes</button>
          <button className={tab === 'pinned' ? 'active' : ''} onClick={() => setTab('pinned')}>Pinned</button>
        </div>

        {error && <div className="alert">{error}</div>}

        {loading ? (
          <p className="muted">Loading your notes…</p>
        ) : shown.length === 0 ? (
          <div className="empty">
            <NotebookPen size={36} />
            <h3>{q ? 'No notes match your search' : tab === 'pinned' ? 'Nothing pinned yet' : 'No notes yet'}</h3>
            <p className="muted">{q ? 'Try a different word or tag.' : tab === 'pinned' ? 'Pin a note to keep it at the top.' : 'Write your first note to get started.'}</p>
            {!q && tab === 'all' && <button className="btn primary" onClick={() => setEditing({})}>Write a note</button>}
          </div>
        ) : (
          <div className="grid">
            {shown.map((n) => (
              <NoteCard key={n._id} note={n} onOpen={setEditing} onPin={togglePin} onDelete={remove} />
            ))}
          </div>
        )}
      </main>

      {editing && <NoteModal note={editing._id ? editing : null} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
