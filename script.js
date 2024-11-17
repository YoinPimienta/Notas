document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('note-list');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteContent = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    let currentNoteId = null;
  
    // Cargar todas las notas desde la API
    async function loadNotes() {
      const response = await fetch('./backend/notes.php');
      const notes = await response.json();
      noteList.innerHTML = '';
      notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.title;
        li.dataset.id = note.id;
        li.addEventListener('click', () => openNoteEditor(note));
        noteList.appendChild(li);
      });
    }
  
    // Abrir el editor de notas para ver/editar
    function openNoteEditor(note) {
      noteContent.classList.remove('hidden');
      noteContent.textContent = note.content;
      currentNoteId = note.id;
  
      saveNoteBtn.classList.remove('hidden');
      deleteNoteBtn.classList.remove('hidden');
    }
  
    // Guardar o actualizar la nota
    async function saveNote() {
      const content = noteContent.textContent;
      const title = prompt("Escribe el título de la nota:", "Nueva Nota");
  
      if (currentNoteId) {
        // Actualizar la nota existente
        const response = await fetch('./backend/notes.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: currentNoteId, content })
        });
        const result = await response.json();
        alert(result.message);
      } else {
        // Crear una nueva nota
        const response = await fetch('./backend/notes.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content })
        });
        const result = await response.json();
        alert("Nota guardada");
      }
      loadNotes();
      resetEditor();
    }
  
    // Eliminar la nota
    async function deleteNote() {
      const response = await fetch('./backend/notes.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentNoteId })
      });
      const result = await response.json();
      alert(result.message);
      loadNotes();
      resetEditor();
    }
  
    // Limpiar el editor de notas
    function resetEditor() {
      noteContent.classList.add('hidden');
      noteContent.textContent = '';
      saveNoteBtn.classList.add('hidden');
      deleteNoteBtn.classList.add('hidden');
      currentNoteId = null;
    }
  
    // Botón de nueva nota
    addNoteBtn.addEventListener('click', () => {
      resetEditor();
      saveNote();
    });
  
    // Guardar nota
    saveNoteBtn.addEventListener('click', saveNote);
  
    // Eliminar nota
    deleteNoteBtn.addEventListener('click', deleteNote);
  
    // Cargar las notas al inicio
    loadNotes();
  });
  