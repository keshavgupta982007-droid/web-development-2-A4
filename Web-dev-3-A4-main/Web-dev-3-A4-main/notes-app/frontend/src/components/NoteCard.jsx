import { Pin, Trash2 } from 'lucide-react';
import { COLORS } from '../constants';

export default function NoteCard({ note, onOpen, onPin, onDelete }) {
  const date = new Date(note.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return (
    <article className="note" style={{ background: COLORS[note.color] }} onClick={() => onOpen(note)}>
      <div className="note-top">
        {note.title ? <h3>{note.title}</h3> : <span />}
        <button
          className={`icon ${note.pinned ? 'on' : ''}`}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
          onClick={(e) => { e.stopPropagation(); onPin(note); }}
        >
          <Pin size={16} />
        </button>
      </div>
      {note.content && <p>{note.content}</p>}
      {note.tags.length > 0 && (
        <div className="tags">{note.tags.map((t) => <span key={t}>#{t}</span>)}</div>
      )}
      <footer>
        <small>{date}</small>
        <button className="icon danger" title="Delete note" onClick={(e) => { e.stopPropagation(); onDelete(note); }}>
          <Trash2 size={16} />
        </button>
      </footer>
    </article>
  );
}
