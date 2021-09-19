/**
 * @fileOverview contains all the event handlers of the routes
 */

const notesRouter = require('express').Router(); //using express router middleware which does all the routing functions
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
	const authorization = request.get('authorization');
	console.log(authorization);
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}

	return null;
};

/* Get all the notes from DB */
notesRouter.get('/', async (req, res, next) => {
	try {
		const notes = await Note.find({}).populate('user', {
			username: 1,
			name: 1,
		});

		res.json(notes);
	} catch (error) {
		next(error);
	}
});

/* Get a specific resource note */
notesRouter.get('/:id', (req, res, next) => {
	Note.findById(req.params.id)
		.then((note) => {
			if (note) {
				res.json(note);
			} else {
				res.status(404).end();
			}
		})

		.catch((err) => next(err));
});

/* creating a new note */
notesRouter.post('/', async (req, res, next) => {
	/******** MongoDB version ******* */

	try {
		const body = req.body;

		const token = getTokenFrom(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);
		if (!token || !decodedToken.id) {
			return res.status(401).json({ error: 'token missing or invalid' });
		}
		const user = await User.findById(decodedToken.id);

		const note = new Note({
			content: body.content,
			important: body.important === undefined ? false : body.important,
			date: new Date(),
			user: user._id,
		});

		const savedNote = await note.save();
		user.notes = user.notes.concat(savedNote._id);
		await user.save();

		res.json(savedNote);
	} catch (error) {
		next(error);
	}

	/***************************** */
});

/* Delete route */
notesRouter.delete('/:id', (req, res, next) => {
	Note.findByIdAndRemove(req.params.id)
		.then((res) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

/* Update route */
notesRouter.put('/:id', (request, response, next) => {
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

module.exports = notesRouter;
