const homeView = document.getElementById("homeView");
const editorView = document.getElementById("editorView");
const newNoteBtn = document.getElementById("newNoteBtn");
const homeBtn = document.getElementById("homeBtn");
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");
const focusBtn = document.getElementById("focusBtn");
const fontSelect = document.getElementById("fontSelect");
const newTagInput = document.getElementById("newTagInput");
const tagColorInput = document.getElementById("tagColorInput");
const addTagBtn = document.getElementById("addTagBtn");
const tagContainer = document.getElementById("tagContainer");
const tagFilters = document.getElementById("tagFilters");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let tags = JSON.parse(localStorage.getItem("tags")) || {};
let currentNoteIndex = null;
let focusMode = false;

// Fonts
const fonts = ["Barlow", "Arial", "Courier New", "Georgia", "Times New Roman"];
fonts.forEach(f => {
  const option = document.createElement("option");
  option.value = f;
  option.textContent = f;
  fontSelect.appendChild(option);
});

fontSelect.addEventListener("change", () => {
  noteInput.style.fontFamily = fontSelect.value;
});

// Home navigation
newNoteBtn.addEventListener("click", () => {
  editorView.classList.remove("hidden");
  homeView.classList.add("hidden");
  currentNoteIndex = null;
  noteInput.value = "";
});

homeBtn.addEventListener("click", () => {
  editorView.classList.add("hidden");
  homeView.classList.remove("hidden");
  renderNotes();
  renderTagFilters();
});

// Auto-save
noteInput.addEventListener("input", () => {
  if (currentNoteIndex === null) {
    notes.push({ text: noteInput.value, font: fontSelect.value, tags: [] });
    currentNoteIndex = notes.length - 1;
  } else {
    notes[currentNoteIndex].text = noteInput.value;
    notes[currentNoteIndex].font = fontSelect.value;
  }
  localStorage.setItem("notes", JSON.stringify(notes));
});

// Tags
addTagBtn.addEventListener("click", () => {
  const tag = newTagInput.value.trim();
  if (tag && !tags[tag]) {
    tags[tag] = tagColorInput.value;
    localStorage.setItem("tags", JSON.stringify(tags));
    renderTags();
    renderTagFilters();
    newTagInput.value = "";
  }
});

function renderTags() {
  tagContainer.innerHTML = "";
  Object.keys(tags).forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    span.className = "tag";
    span.style.backgroundColor = tags[tag];
    span.onclick = () => toggleTag(tag);
    tagContainer.appendChild(span);
  });
}

function renderTagFilters() {
  tagFilters.innerHTML = "";
  Object.keys(tags).forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    span.className = "tag";
    span.style.backgroundColor = tags[tag];
    span.onclick = () => filterNotes(tag);
    tagFilters.appendChild(span);
  });
}

function toggleTag(tag) {
  if (currentNoteIndex !== null) {
    const note = notes[currentNoteIndex];
    if (!note.tags.includes(tag)) {
      note.tags.push(tag);
    } else {
      note.tags = note.tags.filter(t => t !== tag);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

function filterNotes(tag) {
  renderNotes(tag);
}

function renderNotes(filter = null) {
  notesList.innerHTML = "";
  notes.forEach((note, idx) => {
    if (!filter || note.tags.includes(filter)) {
      const div = document.createElement("div");
      div.textContent = note.text.slice(0, 50) + "...";
      div.style.fontFamily = note.font;
      div.className = "note-preview";
      div.onclick = () => openNote(idx);
      notesList.appendChild(div);
    }
  });
}

function openNote(idx) {
  currentNoteIndex = idx;
  const note = notes[idx];
  noteInput.value = note.text;
  fontSelect.value = note.font;
  noteInput.style.fontFamily = note.font;
  editorView.classList.remove("hidden");
  homeView.classList.add("hidden");
}

// Focus mode
focusBtn.addEventListener("click", () => {
  focusMode = !focusMode;
  if (focusMode) {
    document.querySelector(".editor-controls").style.display = "none";
    noteInput.style.fontSize = "1.5rem";
  } else {
    document.querySelector(".editor-controls").style.display = "flex";
    noteInput.style.fontSize = "1.2rem";
  }
});

// Initialize
renderNotes();
renderTags();
renderTagFilters();
