import React from 'react';

const CommentList = ({ comments }) => {
	console.log(comments, 'heyyyy');
	const renderedComments = comments.map((comment) => {
		// TODO: render comment based on comment status
		let content = '';
		switch (comment.status) {
			case 'pending':
				content = 'This comment is pending for approval';
				break;
			case 'rejected':
				content = 'This comment is rejected';
				break;
			case 'accepted':
				content = comment.content;
				break;
			default:
				content = '';
		}
		return <li key={comment.id}>{content}</li>;
	});

	return <ul>{renderedComments}</ul>;
};

export default CommentList;
