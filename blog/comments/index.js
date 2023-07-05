const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors())
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {

    console.log('post start')
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
  
    const comments = commentsByPostId[req.params.id] || [];
  
    comments.push({ id: commentId, content, status: 'pending' });
  
    commentsByPostId[req.params.id] = comments;
  
    try {
      console.log('hereeee1')
      const eventResp = await axios.post('http://localhost:4005/events',{
        type: 'CommentCreated',
        data: {
          id: commentId, 
          content,
          postId: req.params.id,
          status: 'pending'
        }
      })
      console.log('hereeee2',eventResp.data)
    } catch (error) {
      console.log(error)
    }

    res.status(201).send(comments);
 
});
app.post('/events', async (req, res) => {
	try {
		console.log(`event recieved type: ${req.body.type}`);
    const {type,data} = req.body;
    if(type == 'commentModerated'){
      const {id,postId,status,content} = data;
      const allCommentsOfPost = commentsByPostId[postId];
      const commentToUpdate = allCommentsOfPost.find((comment)=>{
        return comment.id == id;
      })
      commentToUpdate.status = status;
      await axios.post('http://localhost:4005/events',{
        type: 'commentUpdated',
        data: {
          id,postId,status,content
        }
      })
    }
		res.status(201).send({});
	} catch (error) {
		console.log('erorrr===>', JSON.stringify(error), error.message);
	}
});
const PORT = 4001
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
