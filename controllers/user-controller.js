const { prisma } = require('../prisma/prisma-client');
const bcypt = require('bcryptjs');
const Jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');

const UserController = {
	register: async (req, res) => {
		const { email, password, name } = req.body;
		if (!email || !password || !name) {
			return res.status(400).json({ err: 'Все поля обязательны' });
		}

		//существует ли пользователь?
		try {
			const existingUser = await prisma.user.findUnique({
				where: { email },
			});
			if (existingUser) {
				return res
					.status(400)
					.json({ error: 'Пользователь уже существует' });
			}
			//хеш текущего пароля
			const hashedPassword = await bcypt.hash(password, 10);
			//добавление рандом аватарки
			const png = Jdenticon.toPng(name, 200);
			//имя на основе пользователя и даты
			const avatarName = `${name}_${Date.now()}.png`;
			//путь для картинки и имя картинки
			const avatarPath = path.join(__dirname, '../uploads', avatarName);

			//добавить в папку uploads/путь/что
			fs.writeFileSync(avatarPath, png);
			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					avatarUrl: `/uploads/${avatarPath}`,
				},
			});
			res.json(user);
		} catch (error) {
			console.error('Error in register', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	login: async (req, res) => {
		const { email, password } = req.body;
		if(!email || !password){
			
		}
	},
	getUserById: async (req, res) => {
		res.send('getUserById');
	},
	updateUser: async (req, res) => {
		res.send('updateUser');
	},
	current: async (req, res) => {
		res.send('current');
	},
};

module.exports = UserController;
