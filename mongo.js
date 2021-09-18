
/**
 * @note - NO NEED OF THIS FILE, SINCE WE HAVE MOVED ALL THE LOGIC 
 * TO note.js.
 * @usecase - this file can be used as a reference for the all the basic 
 * mongodb functionalities
 */



const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Please enter the password as an argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ridz:H6BGnox7pjvCDUpp@cluster0.dmqx8.mongodb.net/fullstackagain?retryWrites=true&w=majority`;

mongoose.connect(url);

//1. creating a scehema
const noteSchema = new mongoose.Schema({
	/* we can validate the input from the user using mongoose validator */
	content: {
		type: String,
		minlength: 5,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	important: Boolean,
});

//2. creating a model
const Note = mongoose.model('Note', noteSchema);

//3. create a new note object using the Note model
const note = new Note({
	content: 'HTML is easy',
	date: new Date(),
	important: true,
});
//4. saving to db
// note.save().then((result) => {
// 	console.log('note saved');
// 	mongoose.connection.close();
// });

//5. fetching objects from the database
Note.find({}).then(result => {
	result.forEach(note => {
		console.log(note)
	})
	mongoose.connection.close()
})