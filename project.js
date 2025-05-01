const translations = {
    English: {
        title: "My notes",
        save: "Save",
        reset: "Reset",
        cancelEdit: "Cancel Edit",
        updateNote: "Update Note",
        expired: "Expired notes",
        placeholderTitle: "Write your title",
        placeholderTask: "Write your note",
        confirmDelete: "Are you sure you want to delete this note?",
        dateLabel: "Date",
        timeLabel: "Time"
    },
    עברית: {
        title: "הפתקים שלי",
        save: "שמור",
        reset: "איפוס",
        cancelEdit: "בטל עריכה",
        updateNote: "עדכן פתק",
        expired: "פתקים שפג תוקפם",
        placeholderTitle: "כתוב את הכותרת שלך",
        placeholderTask: "כתוב את הפתק שלך",
        confirmDelete: "האם אתה בטוח שברצונך למחוק את הפתק?",
        dateLabel: "תאריך",
        timeLabel: "שעה"
    }
};

let currentLang = localStorage.getItem('lang') || 'עברית';


function applyLanguage(lang) {
    const t = translations[lang];
    document.querySelector(".title").textContent = t.title;
    document.querySelector("#myForm button[type='submit']").textContent =
        document.querySelector('#myForm').dataset.editingId ? t.updateNote : t.save;
    document.querySelector("#cancelEdit").textContent = t.cancelEdit;
    document.querySelector("#myForm button[type='reset']").textContent = t.reset;
    document.querySelector("#addTitle").placeholder = t.placeholderTitle;
    document.querySelector("#addTask").placeholder = t.placeholderTask;
    document.querySelector(".expired-title").textContent = t.expired;
    document.querySelector("#toggleLanguage").textContent = lang === "עברית" ? "English" : "עברית";

    localStorage.setItem('lang', lang);
    currentLang = lang;

    savedNotes()
}

document.querySelector("#toggleLanguage").addEventListener("click", () => {
    const newLang = currentLang === 'עברית' ? 'English' : 'עברית';
    applyLanguage(newLang);
});

// הפעל את השפה הנכונה בטעינה ראשונית
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
});


function newNote(event) {
    event.preventDefault();

    const newTitle = document.querySelector('#addTitle').value;
    const newDate = document.querySelector('#addDate').value;
    const newTime = document.querySelector('#addTime').value;
    const newTask = document.querySelector('#addTask').value;

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    const editingId = document.querySelector('#myForm').dataset.editingId;

    if (editingId) {
        const index = notes.findIndex(note => note.id == editingId);
        if (index !== -1) {
            notes[index].title = newTitle;
            notes[index].date = newDate;
            notes[index].time = newTime;
            notes[index].task = newTask;
        }
        delete document.querySelector('#myForm').dataset.editingId;

        // החזר את טקסט הכפתור ל-"שמור"
        const t = translations[currentLang];
        document.querySelector('#myForm button[type="submit"]').textContent = t.save;
    } else {
        const note = {
            id: Date.now(),
            title: newTitle,
            date: newDate,
            time: newTime,
            task: newTask
        };
        notes.unshift(note);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    document.querySelector('#myForm').reset();
    savedNotes();
}


function savedNotes() {
    const t = translations[currentLang]
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    let validNotesHtml = '';
    let expiredNotesHtml = '';

    const now = new Date();

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const noteDateTime = new Date(`${note.date}T${note.time}`);

        const noteHtml = `
            <div class="card ${noteDateTime < now ? 'expired' : ''}" data-id="${note.id}">
                <div class="card-body">
                    <button class="close" onclick="deleteNote(${note.id})">❌</button>
                    <button class="edit" onclick="editNote(${note.id})">✏️</button>
                    <h2 class="cardTitle">${note.title}</h2>
                    <div class="scrollText">
                        <h5 class="cardText">${note.task}</h5>
                    </div>
                    <div class="time">
                        <p>${t.dateLabel}: ${formatDate(note.date)}</p>
                        <p>${t.timeLabel}: ${note.time}</p>
                    </div>
                </div>
            </div>`;

        if (noteDateTime < now) {
            expiredNotesHtml += noteHtml;
        } else {
            validNotesHtml += noteHtml;
        }
    }

    document.querySelector('#notes').innerHTML = validNotesHtml;
    document.querySelector('#expired-notes').innerHTML = expiredNotesHtml;

    const expiredTitle = document.querySelector('.expired-title');
    expiredTitle.style.display = expiredNotesHtml.trim() === '' ? 'none' : 'block';
}


function formatDate(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}


function editNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id === id);
    if (!noteToEdit) return;

    document.querySelector('#addTitle').value = noteToEdit.title;
    document.querySelector('#addDate').value = noteToEdit.date;
    document.querySelector('#addTime').value = noteToEdit.time;
    document.querySelector('#addTask').value = noteToEdit.task;

    document.querySelector('#myForm').dataset.editingId = id;

    // שנה את טקסט הכפתור ל-"עדכן פתק"
    const t = translations[currentLang];
    document.querySelector('#myForm button[type="submit"]').textContent = t.updateNote;
    document.querySelector('#cancelEdit').textContent = t.cancelEdit;
    document.querySelector('#cancelEdit').style.display = "inline-block";

    // גלול לראש הדף בצורה חלקה
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function cancelEdit() {
    delete document.querySelector('#myForm').dataset.editingId;
    document.querySelector('#myForm').reset();
    
    const t = translations[currentLang];
    document.querySelector('#myForm button[type="submit"]').textContent = t.save;    
    document.querySelector('#cancelEdit').style.display = "none"; // הסתר את הכפתור
}

document.addEventListener("DOMContentLoaded", function () {
    savedNotes();

    const cancelBtn = document.getElementById("cancelEdit");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", cancelEdit);
    }
});


function deleteNote(id) {
    const t = translations[currentLang];
    const isConfirmed = window.confirm(t.confirmDelete);
    if (!isConfirmed) {
        return;
    }

    let notes = JSON.parse(localStorage.getItem('notes')) || []
    notes = notes.filter(note => note.id !== id)
    localStorage.setItem('notes', JSON.stringify(notes))
    savedNotes()
}

document.addEventListener("DOMContentLoaded", savedNotes);
window.cancelEdit = cancelEdit;
