const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
let db = require('./db/db.json');
const { response } = require('express');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      
      res.json(JSON.parse(data))
    }
  })
  
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uuid()
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
        res.status(201).json('Success');
      }
    });
    
  } else {
    res.status(500).json('Error in posting review');
  } 

});


app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      let deleteMe;
      parsedNotes.forEach(function callback(value, index) {
        if (value.id == req.params.id) {
          deleteMe = index;
        }
      });
      console.log(deleteMe);
      parsedNotes.splice(deleteMe, 1);
      // Write updated notes back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
      res.status(201).json('Success');
    }
  });
  
} 
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);