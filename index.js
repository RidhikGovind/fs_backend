//1.  create a simple server which open in port 5000
//2. Fetch a single note resource using its id
const express = require('express');
const cors = require('cors');
const app = express();

/**
 * Since we will be receiving data from outside in the form of JSON,
 * we must make sure that this JSON data is converted to a JS object
 * for the server to understand. For that we use a middleware such as
 * Express JSON parser.
 * -> To parse -- to separate into parts and into JS objects
 */

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 5000;
let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		date: '2019-05-30T17:30:31.098Z',
		important: true,
	},
	{
		id: 2,
		content: 'Browser can execute only JavaScript',
		date: '2019-05-30T18:39:34.091Z',
		important: false,
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		date: '2019-05-30T19:20:14.298Z',
		important: true,
	},
];

app.get('/', (req, res) => {
	console.log(notes);
	res.send(
		'<h1>Surprised ? Yep. This is the backend for the fullstack app. YAY !</h1>'
	);
});

app.get('/api/notes', (request, response) => {
	response.json(notes);
});

/* GET specific resource route */
app.get('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);

	const note = notes.find((note) => note.id === id);

	if (note) {
		res.json(note);
	} else {
		res.status(404).end();
	}
});

/* Delete route */
app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);

	const note = notes.find((note) => note.id === id);

	res.status(204).end();
});

app.post('/api/notes', (req, res) => {
	/**
	 * 1. create a unique id for the note and append to it.
	 * 2. concat this new note to the 'notes' array
	 * 1. access the data from the body property of the 'req' object
	 * 2. log the response
	 */

	const generateId = () => {
		const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
		return maxId + 1;
	};

	const body = req.body;

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing',
		});
	}

	const note = {
		content: body.content,
		important: body.important || false,
		date: new Date(),
		id: generateId(),
	};

	notes = notes.concat(note);

	res.json(note);
});

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
});
