const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uuid = require('./helpers/uuid.js');
const utils = require('./helpers/fsUtils.js');
const { json } = require('express');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    utils.readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
});

// adds a new note to list
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);


    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        utils.readFromFile('./db/db.json')
            .then((data) => {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                utils.writeToFile('./db/db.json', JSON.stringify(parsedNotes))
            });


        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in creating note');
    }
});

// deletes a specific note
app.delete('/api/notes/:id', (req, res) => {
    utils.readFromFile('./db/db.json')
        .then((data) => {
            let notes = JSON.parse(data);

            for (let i = 0; i < notes.length; i++) {
                let currentNote = notes[i];
                if (currentNote.id === req.params.id) {
                    notes.splice(i, 1);
                    utils.writeToFile('./db/db.json', JSON.stringify(notes))
                    return res.status(200).json(`${currentNote} was deleted!`);

                }
            }

            return res.status(500).json('Oops, something went wrong!');

        })
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`));


