const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let posts = {};
app.get('/posts', (req, res) => {
	res.send(posts);
});
app.post('/posts', async (req, res) => {
	try {
		const id = randomBytes(4).toString('hex');
		const { title } = req.body;
		posts[id] = {
			id,
			title,
		};
		const eventResp = await axios.post('http://localhost:4005/events', {
			type: 'postCreated',
			data: {
				id,
				title,
			},
		});
		res.status(201).send(posts[id]);
	} catch (error) {
		console.log('erorrr===>', JSON.stringify(error), error.message);
	}
});
app.post('/events', async (req, res) => {
	try {
		console.log(`event recieved type: ${req.body.type}`);
		res.status(201).send({});
	} catch (error) {
		console.log('erorrr===>', JSON.stringify(error), error.message);
	}
});
const port = 4000;
app.listen(port, () => {
	console.log('listening@', port);
});
