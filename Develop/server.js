const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json');
const uuid = require('./helpers/uuid.js');
const utils = require('./helpers/fsUtils.js');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    utils.readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
});


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


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`));


