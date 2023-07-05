const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors())
app.use(bodyParser.json());

let posts = {};
function handleEvent(type, data) {
    if (type === 'postCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }
    if (type === 'commentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const commentToBeUpdated = post.comments.find((comment) => {
            return comment.id == id;
        });
        commentToBeUpdated.content = content;
        commentToBeUpdated.status = status;
    }
}
app.get('/posts',  (req, res) => {
    try {
        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
    }
})
app.post('/events',  (req, res) => {
	try {
		console.log(`event recieved type: ${req.body.type}`);
        const { type, data } = req.body;
        handleEvent(type, data);
        console.log(JSON.stringify(posts))
		res.status(201).send({});
	} catch (error) {
        res.status(500).send({});
		console.log('erorrr===>', JSON.stringify(error), error.message);
	}
});
const port = 4002
app.listen(port, async () => {
    try {
        console.log(`listening @ http://localhost:${port}`);
        const res = await axios.get('http://localhost:4005/events');
        for(eventt of res.data){
          console.log(`processing event ----> ${eventt.type}`);
          handleEvent(eventt.type,eventt.data);
        }
        console.log(JSON.stringify(posts))
    } catch (error) {
        console.log('error_in_queryBootup',error)
    }
});


