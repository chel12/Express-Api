const { prisma } = require('../prisma/prisma-client');
const PostController = {
	createPost: async (req, res) => {
		//создаём, остальное создатся динамически
		const { content } = req.body;
		//с мидл вар приходит и берем так
		const authorId = req.user.userId;
		if (!content) {
			return res.status(400).json({ error: 'Все поля обязательны' });
		} // это доступно после получения токена, поэтому на юзера нет смысла проверять

		try {
			//создание поста
			const post = await prisma.post.create({
				data: { content, authorId },
			});
			res.json(post);
		} catch (error) {
			console.error('Error Create Post', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	getAllPosts: async (req, res) => {
		try {
		} catch (error) {
			console.error('Get All Posts error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	getPostById: async (req, res) => {
		try {
		} catch (error) {
			console.error('Get Post By Id', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	deletePost: async (req, res) => {
		try {
		} catch (error) {
			console.error('delete post', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
};

module.exports = PostController;
