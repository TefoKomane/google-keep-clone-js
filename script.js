const STORAGE_KEY = 'keepCloneNotes';
const ARCHIVE_KEY = 'keepCloneArchived';
const TRASH_KEY = 'keepCloneTrash';
const LABELS_KEY = 'keepCloneLabels';
const notePalette = ['#fef7a8', '#f8d1d1', '#d1f1d9', '#dce7ff', '#ffffff'];

let notes = [];
let archivedNotes = [];
let trashedNotes = [];
let labels = ['Personal', 'Work', 'Shopping'];
let selectedColor = '#fef7a8';
let currentEditId = null;
let currentEditColor = '#fef7a8';
let currentView = 'notes';

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
const reminderToggle = document.getElementById('reminderToggle');
const labelsList = document.getElementById('labelsList');
const newLabelInput = document.getElementById('newLabelInput');
const addLabelBtn = document.getElementById('addLabelBtn');
const labelsPanel = document.getElementById('labelsPanel');
const activeSectionTitle = document.getElementById('activeSectionTitle');
const archiveSectionTitle = document.getElementById('archiveSectionTitle');
const navButtons = document.querySelectorAll('.nav-item');

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
  localStorage.setItem(TRASH_KEY, JSON.stringify(trashedNotes));
  localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

function loadData() {
  const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const savedArchived = JSON.parse(localStorage.getItem(ARCHIVE_KEY));
  const savedTrashed = JSON.parse(localStorage.getItem(TRASH_KEY));
  const savedLabels = JSON.parse(localStorage.getItem(LABELS_KEY));

  notes = Array.isArray(savedNotes) && savedNotes.length ? savedNotes : getDefaultNotes();
  archivedNotes = Array.isArray(savedArchived) ? savedArchived : [];
  trashedNotes = Array.isArray(savedTrashed) ? savedTrashed : [];
  labels = Array.isArray(savedLabels) && savedLabels.length ? savedLabels : ['Personal', 'Work', 'Shopping'];

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

function createNoteCard(note, archived = false, trashed = false) {
  const title = note.title || 'Untitled';
  const text = note.text || '';
  const reminderText = note.reminder ? `<div class="note-reminder">⏰ ${note.reminder}</div>` : '';
  const tagText = archived ? 'Archived' : trashed ? 'Trashed' : note.reminder ? 'Reminder' : 'Note';
  const primaryAction = archived ? 'unarchive' : trashed ? 'restore' : 'archive';
  const primaryLabel = archived ? 'Restore' : trashed ? 'Restore' : 'Archive';

  return `
    <article class="note-card" data-id="${note.id}" style="background:${note.color || '#ffffff'};">
      <div class="note-card-header">
        <h3>${escapeHtml(title)}</h3>
        <span class="note-tag ${archived ? 'archived' : trashed ? 'trashed' : ''}">${tagText}</span>
      </div>

      <p>${escapeHtml(text)}</p>
      ${reminderText}

      <div class="card-actions">
        <button type="button" data-id="${note.id}" data-action="edit">Edit</button>
        <button type="button" data-id="${note.id}" data-action="color">Color</button>
        <button type="button" data-id="${note.id}" data-action="${primaryAction}">${primaryLabel}</button>
        <button type="button" data-id="${note.id}" data-action="trash">${trashed ? 'Delete' : 'Trash'}</button>
      </div>
    </article>
  `;
}

function getFilteredNotes(sourceList) {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return sourceList.filter((note) => {
    const title = note.title ? note.title.toLowerCase() : '';
    const text = note.text ? note.text.toLowerCase() : '';
    const reminder = note.reminder ? note.reminder.toLowerCase() : '';
    return title.includes(searchTerm) || text.includes(searchTerm) || reminder.includes(searchTerm);
  });
}

function renderNotes() {
  const filteredNotes = getFilteredNotes(notes);
  const filteredArchived = getFilteredNotes(archivedNotes);
  const filteredTrashed = getFilteredNotes(trashedNotes);

  if (currentView === 'archive') {
    notesList.innerHTML = '<div class="empty-state">Archive view is active.</div>';
    archivedList.innerHTML = filteredArchived.length ? filteredArchived.map((note) => createNoteCard(note, true)).join('') : '<div class="empty-state">No archived notes.</div>';
    return;
  }

  if (currentView === 'trash') {
    notesList.innerHTML = filteredTrashed.length ? filteredTrashed.map((note) => createNoteCard(note, false, true)).join('') : '<div class="empty-state">Trash is empty.</div>';
    archivedList.innerHTML = '';
    return;
  }

  if (currentView === 'reminders') {
    const filteredReminders = filteredNotes.filter((note) => note.reminder);
    notesList.innerHTML = filteredReminders.length ? filteredReminders.map((note) => createNoteCard(note)).join('') : '<div class="empty-state">No reminders yet.</div>';
    archivedList.innerHTML = '';
    return;
  }

  if (currentView === 'labels') {
    notesList.innerHTML = '<div class="empty-state">Use labels to organize your notes.</div>';
    archivedList.innerHTML = '';
    renderLabels();
    return;
  }

  notesList.innerHTML = filteredNotes.length ? filteredNotes.map((note) => createNoteCard(note)).join('') : '<div class="empty-state">No notes yet. Add one above.</div>';
  archivedList.innerHTML = filteredArchived.length ? filteredArchived.map((note) => createNoteCard(note, true)).join('') : '<div class="empty-state">No archived notes.</div>';
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
    color: selectedColor,
    reminder: reminderToggle.checked ? new Date().toLocaleString() : ''
  };

  notes.unshift(newNote);
  saveData();
  renderNotes();

  noteTitleInput.value = '';
  noteTextInput.value = '';
  reminderToggle.checked = false;
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

function trashNote(id) {
  const noteId = Number(id);
  const fromNotes = notes.find((note) => note.id === noteId);
  const fromArchived = archivedNotes.find((note) => note.id === noteId);
  const target = fromNotes || fromArchived;

  if (!target) return;

  if (fromNotes) {
    notes = notes.filter((note) => note.id !== noteId);
  }

  if (fromArchived) {
    archivedNotes = archivedNotes.filter((note) => note.id !== noteId);
  }

  trashedNotes.unshift({ ...target });
  saveData();
  renderNotes();
}

function restoreNote(id) {
  const noteIndex = trashedNotes.findIndex((note) => note.id === Number(id));

  if (noteIndex === -1) return;

  const [note] = trashedNotes.splice(noteIndex, 1);
  notes.unshift(note);
  saveData();
  renderNotes();
}

function deleteNote(id) {
  const noteId = Number(id);
  const shouldDelete = confirm('Delete this note permanently?');

  if (!shouldDelete) return;

  notes = notes.filter((note) => note.id !== noteId);
  archivedNotes = archivedNotes.filter((note) => note.id !== noteId);
  trashedNotes = trashedNotes.filter((note) => note.id !== noteId);
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
  const noteInTrash = trashedNotes.find((note) => note.id === currentEditId);

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

  if (noteInTrash) {
    noteInTrash.title = updatedTitle;
    noteInTrash.text = updatedText;
    noteInTrash.color = currentEditColor;
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
  const note = [...notes, ...archivedNotes, ...trashedNotes].find((item) => item.id === noteId);

  if (!note) return;

  const currentIndex = notePalette.indexOf(note.color || '#ffffff');
  const nextIndex = currentIndex === -1 || currentIndex === notePalette.length - 1 ? 0 : currentIndex + 1;
  const newColor = notePalette[nextIndex];

  note.color = newColor;
  saveData();
  renderNotes();
}

function renderLabels() {
  if (!labels.length) {
    labelsList.innerHTML = '<div class="empty-state">No labels yet. Add one to organize your notes.</div>';
    return;
  }

  labelsList.innerHTML = labels.map((label) => `
    <div class="label-item">
      <span># ${label}</span>
      <button type="button" data-label="${label}" class="delete-label-btn">Delete</button>
    </div>
  `).join('');

  document.querySelectorAll('.delete-label-btn').forEach((button) => {
    button.addEventListener('click', () => {
      labels = labels.filter((label) => label !== button.dataset.label);
      saveData();
      renderLabels();
    });
  });
}

function addLabel() {
  const value = newLabelInput.value.trim();

  if (!value) {
    alert('Please enter a label name.');
    return;
  }

  if (!labels.includes(value)) {
    labels.push(value);
    saveData();
    renderLabels();
  }

  newLabelInput.value = '';
}

function setActiveView(view) {
  currentView = view;
  navButtons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle('active', isActive);
  });

  const isArchiveView = view === 'archive';
  const isTrashView = view === 'trash';
  const isLabelsView = view === 'labels';
  const isReminderView = view === 'reminders';

  document.querySelector('.archive-section').classList.toggle('hidden', !isArchiveView);
  labelsPanel.classList.toggle('hidden', !isLabelsView);

  activeSectionTitle.textContent = isReminderView ? 'Reminders' : isArchiveView ? 'Archive' : isTrashView ? 'Trash' : isLabelsView ? 'Labels' : 'Notes';
  archiveSectionTitle.textContent = 'Archived';

  if (view === 'notes' || view === 'reminders' || view === 'trash') {
    document.querySelector('.archive-section').classList.add('hidden');
  }

  if (view === 'archive') {
    notesList.innerHTML = '';
  }

  renderNotes();
}

addNoteBtn.addEventListener('click', addNewNote);
searchInput.addEventListener('input', renderNotes);
addLabelBtn.addEventListener('click', addLabel);
newLabelInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addLabel();
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveView(button.dataset.view));
});

notesList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'archive') archiveNote(id);
  if (action === 'trash') {
    if (currentView === 'trash') {
      deleteNote(id);
    } else {
      trashNote(id);
    }
  }
  if (action === 'restore') restoreNote(id);
  if (action === 'delete') deleteNote(id);
  if (action === 'edit') openEditModal(id);
  if (action === 'color') cycleColorForNote(id);
  if (action === 'unarchive') unarchiveNote(id);
});

archivedList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'unarchive') unarchiveNote(id);
  if (action === 'trash') trashNote(id);
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
renderLabels();
setActiveView('notes');
