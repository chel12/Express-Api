//экспорт всех
const UserController = require('./user-controller.js');
const PostController = require('./post-controller.js');
const CommentController = require('./comment-controller.js');
const LikeController = require('./like-controller.js');

module.exports = {
	UserController,
	PostController,
	CommentController,
	LikeController,
};
