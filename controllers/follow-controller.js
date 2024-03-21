const { prisma } = require('../prisma/prisma-client');

const FollowController = {
	followUser: async (req, res) => {
		//на кого подписываемся
		const { followingId } = req.body;
		//кто подписыается
		const userId = req.user.userId;
		//проверка на самого себя
		if (followingId === userId) {
			return res
				.status(500)
				.json({ error: 'Вы не можете подписаться на самого себя' });
		}
		try {
			//проверка подписаны ли мы на этого юзера
			const existingFollow = await prisma.follows.findFirst({
				where: {
					//followerId это мы, followingId на кого
					AND: [{ followerId: userId }, { followingId }],
				},
			});
			if (existingFollow) {
				return res
					.status(400)
					.json({ error: 'Подписка уже существует' });
			}
			await prisma.follows.create({
				data: {
					//и нужно соединение
					follower: { connect: { id: userId } },
					following: { connect: { id: followingId } },
				},
			});
			res.status(201).json({ message: 'Подписка успешно создана' });
		} catch (error) {
			console.error('Follow  error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	unfollowUser: async (req, res) => {
		//на кого подписаны, чтобы отписаться
		const { followingId } = req.body;
		//мы userId
		const userId = req.user.userId;
		try {
			//проверка есть ли дизлайк
			const follows = await prisma.follows.findFirst({
				where: {
					//мы followerId отписываемся, от followingId
					AND: [
						{ followerId: userId },
						{
							followingId,
						},
					],
				},
			});
			//проверка есть ли вообще подписка

			if (!follows) {
				return res
					.status(404)
					.json({ error: 'Вы не подписаны на этого пользователя' });
			}
			await prisma.follows.delete({
				where: { id: follows.id },
			});

			return res
				.status(201)
				.json({ message: 'Вы отписались от пользователя' });
		} catch (error) {
			console.error('Unfollow  error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
};
module.exports = FollowController;
