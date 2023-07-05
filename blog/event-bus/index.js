const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyParser.json());
const events = [];
app.post('/events', async (req, res) => {
	try {
		const event = req.body;
		events.push(event);
		await axios.post('http://localhost:4000/events', event); // posts service
		await axios.post('http://localhost:4001/events', event); // comments service
		await axios.post('http://localhost:4003/events', event); // query service
		await axios.post('http://localhost:4002/events', event); // moderation service
		res.send({ status: 'OK' });
	} catch (error) {
		console.log('error_in_eventBus',error.message)
	}
});
app.get('/events', (req,res)=>{
	res.send(events); 
})
const PORT = 4005
app.listen(PORT,() => {
    console.log(`listening on http://localhost:${PORT}`);
})