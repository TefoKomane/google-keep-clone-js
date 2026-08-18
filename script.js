const STORAGE_KEY = 'keepCloneNotes';
const ARCHIVE_KEY = 'keepCloneArchived';
const notePalette = ['#fef7a8', '#f8d1d1', '#d1f1d9', '#dce7ff', '#ffffff'];

let notes = [];
let archivedNotes = [];
let selectedColor = '#fef7a8';
let currentEditId = null;
let currentEditColor = '#fef7a8';

const noteTitleInput = document.getElementById('noteTitle');
const noteTextInput = document.getElementById('noteText');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const archivedList = document.getElementById('archivedList');
const searchInput = document.getElementById('searchInput');
const editModal = document.getElementById('editModal');
const editTitleInput = document.getElementById('editTitle');
const editTextInput = document.getElementById('editText');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

function setSelectedColor(color) {
  selectedColor = color;

  document.querySelectorAll('.color-swatch').forEach((swatch) => {
    if (swatch.dataset.color === color) {
      swatch.classList.add('active');
    } else {
      swatch.classList.remove('active');
    }
  });
}

function getDefaultNotes() {
  return [
    {
      id: Date.now() + 1,
      title: 'Welcome',
      text: 'This is a simple Google Keep clone. Start by adding your first note.',
      color: '#fef7a8'
    },
    {
      id: Date.now() + 2,
      title: 'Ideas',
      text: 'Buy milk\nCall mom\nFinish assignment',
      color: '#d1f1d9'
    }
  ];
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archivedNotes));
}

function loadData() {
  const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const savedArchived = JSON.parse(localStorage.getItem(ARCHIVE_KEY));

  notes = Array.isArray(savedNotes) && savedNotes.length ? savedNotes : getDefaultNotes();
  archivedNotes = Array.isArray(savedArchived) ? savedArchived : [];

  saveData();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createNoteCard(note, archived = false) {
  const title = note.title || 'Untitled';
  const text = note.text || '';
  const tagText = archived ? 'Archived' : 'Note';
  const action = archived ? 'unarchive' : 'archive';

  return `
    <article class="note-card" data-id="${note.id}" style="background:${note.color || '#ffffff'};">
      <div class="note-card-header">
        <h3>${escapeHtml(title)}</h3>
        <span class="note-tag ${archived ? 'archived' : ''}">${tagText}</span>
      </div>

      <p>${escapeHtml(text)}</p>

      <div class="card-actions">
        <button type="button" data-id="${note.id}" data-action="edit">Edit</button>
        <button type="button" data-id="${note.id}" data-action="color">Color</button>
        <button type="button" data-id="${note.id}" data-action="${action}">${archived ? 'Restore' : 'Archive'}</button>
        <button type="button" data-id="${note.id}" data-action="delete">Delete</button>
      </div>
    </article>
  `;
}

function renderNotes() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter((note) => {
    const title = note.title ? note.title.toLowerCase() : '';
    const text = note.text ? note.text.toLowerCase() : '';
    return title.includes(searchTerm) || text.includes(searchTerm);
  });

  const filteredArchived = archivedNotes.filter((note) => {
    const title = note.title ? note.title.toLowerCase() : '';
    const text = note.text ? note.text.toLowerCase() : '';
    return title.includes(searchTerm) || text.includes(searchTerm);
  });

  notesList.innerHTML = filteredNotes.length
    ? filteredNotes.map((note) => createNoteCard(note)).join('')
    : '<div class="empty-state">No notes yet. Add one above.</div>';

  archivedList.innerHTML = filteredArchived.length
    ? filteredArchived.map((note) => createNoteCard(note, true)).join('')
    : '<div class="empty-state">No archived notes.</div>';
}

function addNewNote() {
  const title = noteTitleInput.value.trim();
  const text = noteTextInput.value.trim();

  if (!title && !text) {
    alert('Please add a title or some text before saving.');
    return;
  }

  const newNote = {
    id: Date.now(),
    title,
    text,
    color: selectedColor
  };

  notes.unshift(newNote);
  saveData();
  renderNotes();

  noteTitleInput.value = '';
  noteTextInput.value = '';
  setSelectedColor('#fef7a8');
}

function archiveNote(id) {
  const noteIndex = notes.findIndex((note) => note.id === Number(id));

  if (noteIndex === -1) return;

  const [note] = notes.splice(noteIndex, 1);
  archivedNotes.unshift(note);
  saveData();
  renderNotes();
}

function unarchiveNote(id) {
  const noteIndex = archivedNotes.findIndex((note) => note.id === Number(id));

  if (noteIndex === -1) return;

  const [note] = archivedNotes.splice(noteIndex, 1);
  notes.unshift(note);
  saveData();
  renderNotes();
}

function deleteNote(id) {
  const noteId = Number(id);
  const shouldDelete = confirm('Delete this note?');

  if (!shouldDelete) return;

  notes = notes.filter((note) => note.id !== noteId);
  archivedNotes = archivedNotes.filter((note) => note.id !== noteId);
  saveData();
  renderNotes();
}

function openEditModal(id) {
  const noteId = Number(id);
  const foundNote = [...notes, ...archivedNotes].find((note) => note.id === noteId);

  if (!foundNote) return;

  currentEditId = noteId;
  currentEditColor = foundNote.color || '#fef7a8';

  editTitleInput.value = foundNote.title;
  editTextInput.value = foundNote.text;
  setEditColor(currentEditColor);
  editModal.classList.remove('hidden');
}

function setEditColor(color) {
  currentEditColor = color;

  document.querySelectorAll('.modal-swatch').forEach((swatch) => {
    if (swatch.dataset.color === color) {
      swatch.classList.add('active');
    } else {
      swatch.classList.remove('active');
    }
  });
}

function saveEditedNote() {
  if (currentEditId === null) return;

  const updatedTitle = editTitleInput.value.trim();
  const updatedText = editTextInput.value.trim();

  if (!updatedTitle && !updatedText) {
    alert('Please add some content before saving.');
    return;
  }

  const noteInNotes = notes.find((note) => note.id === currentEditId);
  const noteInArchive = archivedNotes.find((note) => note.id === currentEditId);

  if (noteInNotes) {
    noteInNotes.title = updatedTitle;
    noteInNotes.text = updatedText;
    noteInNotes.color = currentEditColor;
  }

  if (noteInArchive) {
    noteInArchive.title = updatedTitle;
    noteInArchive.text = updatedText;
    noteInArchive.color = currentEditColor;
  }

  saveData();
  renderNotes();
  closeEditModal();
}

function closeEditModal() {
  editModal.classList.add('hidden');
  currentEditId = null;
}

function cycleColorForNote(id) {
  const noteId = Number(id);
  const note = [...notes, ...archivedNotes].find((item) => item.id === noteId);

  if (!note) return;

  const currentIndex = notePalette.indexOf(note.color || '#ffffff');
  const nextIndex = currentIndex === -1 || currentIndex === notePalette.length - 1 ? 0 : currentIndex + 1;
  const newColor = notePalette[nextIndex];

  note.color = newColor;
  saveData();
  renderNotes();
}

addNoteBtn.addEventListener('click', addNewNote);
searchInput.addEventListener('input', renderNotes);

notesList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'archive') archiveNote(id);
  if (action === 'delete') deleteNote(id);
  if (action === 'edit') openEditModal(id);
  if (action === 'color') cycleColorForNote(id);
});

archivedList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'unarchive') unarchiveNote(id);
  if (action === 'delete') deleteNote(id);
  if (action === 'edit') openEditModal(id);
  if (action === 'color') cycleColorForNote(id);
});

document.querySelectorAll('.color-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    const color = swatch.dataset.color;
    setSelectedColor(color);
  });
});

document.querySelectorAll('.modal-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    const color = swatch.dataset.color;
    setEditColor(color);
  });
});

saveEditBtn.addEventListener('click', saveEditedNote);
cancelEditBtn.addEventListener('click', closeEditModal);

editModal.addEventListener('click', (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

loadData();
setSelectedColor(selectedColor);
renderNotes();
