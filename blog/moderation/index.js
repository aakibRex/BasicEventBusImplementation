import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();

app.use(bodyParser.json());

app.post('/events',  async (req, res) => {
	try {
		console.log(`event recieved type: ${req.body.type}`);
        const { type, data } = req.body;
        if(type === 'CommentCreated'){
            const {id,content,postId} = data;
            const status = content.includes('orange')? 'rejected' : 'accepted';
            await axios.post('http://localhost:4005/events', {
                type: 'commentModerated',
                data: {
                    id,content,postId,status
                }
            })
        }
        console.log('success')
		res.status(201).send({});
	} catch (error) {
        res.status(500).send({});
		console.log('erorrr===>', JSON.stringify(error), error.message);
	}
});

const PORT = 4003
app.listen(PORT,()=>{
    console.log(`listening on http://localhost:${PORT}`);
});