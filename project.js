function newNote() {
    const newTitle = document.querySelector('#addTitle').value
    const newDate = document.querySelector('#addDate').value
    const newTime = document.querySelector('#addTime').value
    const newTask = document.querySelector('#addTask').value

    const note = {
        id: Date.now(),
        title: newTitle,
        date: newDate,
        time: newTime,
        task: newTask
    }

    const notes = JSON.parse(localStorage.getItem('notes')) || []
    notes.unshift(note)
    localStorage.setItem('notes', JSON.stringify(notes))

    // document.querySelector('#myForm').reset()
    savedNotes()
}

function savedNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || []
    let allCardsHtml = ''

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i]
        allCardsHtml += `
            <div class="card" style="width: 18rem;" data-id="${note.id}">
                <div class="card-body">
                    <button class="close" onclick="deleteNote(${note.id})">❌</button>
                    <h2 class="card-title">${note.title}</h2>
                    <div class="scrollText">
                    <h5 class="cardText">${note.task}</h5>
                    </div>
                    <div class="time">
                        <p>תאריך: ${note.date}</p>
                        <p>שעה: ${note.time}</p>
                    </div>
                </div>
            </div>`
    }

    document.querySelector('#notes').innerHTML = allCardsHtml
}


function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || []
    notes = notes.filter(note => note.id !== id)
    localStorage.setItem('notes', JSON.stringify(notes))
    savedNotes()
}

savedNotes()
