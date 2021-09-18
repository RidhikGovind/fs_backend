/**
 * @fileOverview Main entry file for Node.js server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const notesRouter = require('./controllers/notes');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.get('/', (req, res, next) => {
	res.send(
		'<h1>Surprised ? Yep. This is the backend for the fullstack app. YAY !</h1>'
	);
});
app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
	logger.info(`Server is running at ${config.PORT}`);
});
