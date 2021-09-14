//1.  create a simple server which open in port 5000
//2. Fetch a single note resource using its id
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const Note = require('./models/note');

/**
 * this middleware here is used to show the 'static content' from the build folder
 * whenever express gets a GET req, it will first check if the 'build' file is available or not
 */
app.use(express.static('build'));

app.use(cors());
/**
 * Since we will be receiving data from outside in the form of JSON,
 * we must make sure that this JSON data is converted to a JS object
 * for the server to understand. For that we use a middleware such as
 * Express JSON parser.
 * -> To parse -- to separate into parts and into JS objects
 */
app.use(express.json());

/***** Error handlers */
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
};

app.use(requestLogger);

// let notes = [
// 	{
// 		id: 1,
// 		content: 'HTML is easy',
// 		date: '2019-05-30T17:30:31.098Z',
// 		important: true,
// 	},
// 	{
// 		id: 2,
// 		content: 'Browser can execute only JavaScript',
// 		date: '2019-05-30T18:39:34.091Z',
// 		important: false,
// 	},
// 	{
// 		id: 3,
// 		content: 'GET and POST are the most important methods of HTTP protocol',
// 		date: '2019-05-30T19:20:14.298Z',
// 		important: true,
// 	},
// ];

app.get('/', (req, res, next) => {
	// console.log(notes);
	res.send(
		'<h1>Surprised ? Yep. This is the backend for the fullstack app. YAY !</h1>'
	);
});

app.get('/api/notes', (req, res, next) => {
	Note.find({}).then((notes) => {
		res.json(notes);
	});
});

/* GET specific resource route */
app.get('/api/notes/:id', (req, res, next) => {
	// const id = Number(req.params.id);

	// const note = notes.find((note) => note.id === id);

	// if (note) {
	// 	res.json(note);
	// } else {
	// 	res.status(404).end();
	// }

	Note.findById(req.params.id)
		.then((note) => {
			if (note) {
				res.json(note);
			} else {
				res.status(404).end();
			}
		})
		// .catch((err) => {
		// 	console.log(err);
		// 	res.status(500).send({ error: 'malformatted id' });
		// });
		.catch((err) => next(err));
});

/* Delete route */
app.delete('/api/notes/:id', (req, res, next) => {
	// const id = Number(req.params.id);

	// const note = notes.find((note) => note.id === id);

	// res.status(204).end();

	Note.findByIdAndRemove(req.params.id)
		.then((res) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.post('/api/notes', (req, res, next) => {
	/**
	 * 1. create a unique id for the note and append to it.
	 * 2. concat this new note to the 'notes' array
	 * 1. access the data from the body property of the 'req' object
	 * 2. log the response
	 */

	// const generateId = () => {
	// 	const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
	// 	return maxId + 1;
	// };

	// const body = req.body;

	// if (!body.content) {
	// 	return res.status(400).json({
	// 		error: 'content missing',
	// 	});
	// }

	// const note = {
	// 	content: body.content,
	// 	important: body.important || false,
	// 	date: new Date(),
	// 	id: generateId(),
	// };

	// notes = notes.concat(note);

	// res.json(note);

	/******** MongoDB version ******* */
	const body = req.body;

	if (body.content === undefined) {
		return response.status(400).json({ error: 'content is missing' });
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note.save().then((savedNote) => {
		res.json(savedNote);
	});
	/***************************** */
});

app.put('/api/notes/:id', (request, response, next) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
});
