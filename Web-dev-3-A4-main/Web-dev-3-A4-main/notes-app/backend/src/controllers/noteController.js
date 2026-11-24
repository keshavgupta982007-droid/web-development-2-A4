const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = ({ title, content, color, tags, pinned }) => ({ title, content, color, tags, pinned });

const findOwned = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  return note;
};

// GET /api/notes?q=
exports.getNotes = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ title: rx }, { content: rx }, { tags: rx }];
  }
  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// POST /api/notes
exports.createNote = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  if (!data.title && !data.content) {
    res.status(400);
    throw new Error('Add a title or some content');
  }
  const note = await Note.create({ ...data, user: req.user._id });
  res.status(201).json(note);
});

// PUT /api/notes/:id
exports.updateNote = asyncHandler(async (req, res) => {
  const note = await findOwned(req, res);
  const data = pick(req.body);
  Object.keys(data).forEach((k) => data[k] !== undefined && (note[k] = data[k]));
  await note.save();
  res.json(note);
});

// DELETE /api/notes/:id
exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await findOwned(req, res);
  await note.deleteOne();
  res.json({ message: 'Note deleted' });
});
