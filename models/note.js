const mongoose = require('mongoose');
const config = require('../utils/config');
const logger = require('../utils/logger');

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB');
	})
	.catch((err) => {
		logger.error('error connecting to MongoDB:', err.message);
	});

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minlength: 5,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	  }
});

// const Note = mongoose.model('Note', noteSchema);

//removing the V__ that comes with mongodb JSON
noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Note', noteSchema);
