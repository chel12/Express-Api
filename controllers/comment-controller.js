const { prisma } = require('../prisma/prisma-client');

const CommentController = {
	createComment: async (req, res) => {
		//с боди берем
		const { postId, content } = req.body;
		//чтоб вообще за юзер смотрим
		const userId = req.user.userId;

		if (!postId || !content) {
			return res.status(400).json({ error: 'Все поля обязательны' });
		}

		try {
			const comment = await prisma.comment.create({
				data: {
					postId,
					userId,
					content,
				},
			});
			res.json(comment);
		} catch (error) {
			console.error('Create comment error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	deleteComment: async (req, res) => {
		try {
		} catch (error) {
			console.error('Delete comment error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
};
module.exports = CommentController;
