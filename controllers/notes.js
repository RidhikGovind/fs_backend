/**
 * @fileOverview contains all the event handlers of the routes
 */

const notesRouter = require('express').Router(); //using express router middleware which does all the routing functions
const Note = require('../models/note');

/* Get all the notes from DB */
notesRouter.get('/', (req, res, next) => {
	Note.find({}).then((notes) => {
		res.json(notes);
	});
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

/* Post route */
notesRouter.post('/', (req, res, next) => {
	/******** MongoDB version ******* */
	const body = req.body;
	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note
		.save()
		.then((savedNote) => {
			res.json(savedNote.toJSON());
		})
		.then((savedAndFormattedNote) => {
			res.json(savedAndFormattedNote);
		})
		.catch((error) => next(error));
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
