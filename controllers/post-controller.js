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
		const userId = req.user.userId;
		try {
			//верни все посты и включи в них лайки, автора, комментарии
			const posts = await prisma.post.findMany({
				include: {
					likes: true,
					author: true,
					comments: true,
				},
				//отсортируй, по созданию, по убыванию
				orderBy: {
					createdAt: 'desc',
				},
			});
			//текущий пользователь лайкнул пост или нет
			const postWithLikeInfo = posts.map((post) => ({
				//распаковывает
				...post,
				//добавляет likedByUser и в нем смотрит
				/*
				post.likes.some((like) => like.userId === userId): 
				Метод some проверяет, удовлетворяет ли хотя бы один элемент массива 
				(в данном случае, элементы массива likes в объекте post) 
				определённому условию. В данном случае, он проверяет, есть ли хотя бы один "лайк", где userId совпадает с userId, 
				который предположительно представляет текущего пользователя.
				Таким образом, в результате каждый объект post в массиве posts будет скопирован, 
				а к нему будет добавлено новое свойство likedByUser, которое будет равно true,
				если текущий пользователь поставил "лайк" этому посту, и false в противном случае.
				*/
				likedByUser: post.likes.some((like) => like.userId === userId),
			}));
			res.json(postWithLikeInfo);
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
