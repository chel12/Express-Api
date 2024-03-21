const { prisma } = require('../prisma/prisma-client');
//для хеширования паролей
const bcypt = require('bcryptjs');
//генерация картинок рандом
const Jdenticon = require('jdenticon');
const path = require('path');
//работа с файлами
const fs = require('fs');
//токен
const jwt = require('jsonwebtoken');

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
			const png = Jdenticon.toPng(`${name}${Date.now()}`, 200);
			//имя на основе пользователя и даты
			const avatarName = `${name}_${Date.now()}.png`;
			//путь для картинки и имя картинки
			const avatarPath = path.join(__dirname, '/../uploads', avatarName);

			//добавить в папку uploads/путь/что
			fs.writeFileSync(avatarPath, png);
			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					avatarUrl: `/uploads/${avatarName}`,
				},
			});
			res.json(user);
		} catch (error) {
			console.error('Error in register', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	login: async (req, res) => {
		//откуда
		const { email, password } = req.body;
		//проверка полей
		if (!email || !password) {
			return res.status(400).json({ error: 'Все поля обязательны' });
		}
		//запрос user
		try {
			//ищем user в бд по уникальному полю email
			const user = await prisma.user.findUnique({ where: { email } });
			//если нет пользователя
			if (!user) {
				return res
					.status(400)
					.json({ error: 'Неверный логин или пароль' });
			}
			//если все ок проверяем
			//перевод пароля в хеш и проверка с юзер хеш паролем
			const valid = await bcypt.compare(password, user.password);
			if (!valid) {
				return res.status(400).json('Неверный логин или пароль');
			}
			//теперь нужно сгенерировать ему JWT token
			//в токене шифруем id пользователя
			//jwt.подпиши(юзерИД как юзер.ИД) и в токене будет юзер
			//и закрыть токен секретным ключом
			//но нужно ещё что express мог обращться к env, где секрет кей лежит
			//ставим npm i dotenv
			////доступ к env
			//require('dotenv').config;
			const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
			res.json({ token });
		} catch (error) {
			//если ошибка
			console.error('Login Error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	getUserById: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;
		try {
			//ищем по уникальному id который берем из params
			const user = await prisma.user.findUnique({
				where: { id },
				//и пришли вснх подписчиков и подписки
				include: {
					followers: true,
					following: true,
				},
			});
			if (!user) {
				return res
					.status(404)
					.json({ error: 'Пользователь с таким id не найден' });
			}
			//узнать подписан ли на этого юзера тот, кто сейчас смотрит его профиль
			/* найти запись пользователя, который следует за другим пользователем 
			(followerId равен userId), и который также следует за определённым пользователем (followingId равен id) */
			const isFollowing = await prisma.follows.findFirst({
				where: {
					AND: [{ followerId: userId }, { followingId: id }],
				},
			});
			res.json({ ...user, isFollowing: Boolean(isFollowing) });
		} catch (error) {
			console.error('Get Current Error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	updateUser: async (req, res) => {
		const { id } = req.params;
		//поля из боди запроса
		const { email, name, dateOfBirth, bio, location } = req.body;
		//путь
		let filePath;
		//проверка малтера
		if (req.file && req.file.path) {
			filePath = req.file.path;
		}
		//типо не того меняешь
		if (id !== req.user.userId) {
			return res.status(403).json({ error: 'Нет доступа' });
		}
		try {
			if (email) {
				//есть ли пользователь котоырй использует такой емайл?
				const existingUser = await prisma.user.findFirst({
					where: { email },
				});
				//если есть такой почта и id этой почты не равен id user, значит почта занята
				if (existingUser && existingUser.id !== id) {
					return res
						.status(400)
						.json({ error: 'Почта уже используется' });
				}
			}
			//обновить юзера
			const user = await prisma.user.update({
				where: { id },
				data: {
					email: email || undefined,
					name: name || undefined,
					avatarUrl: filePath ? `/${filePath}` : undefined,
					dateOfBirth: dateOfBirth || undefined,
					bio: bio || undefined,
					location: location || undefined,
				},
			});
			res.json(user);
		} catch (error) {
			console.error('Update user error', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
	current: async (req, res) => {
		//кто зашёл
		try {
			const user = await prisma.user.findUnique({
				//найди пользователя из запроса
				where: { id: req.user.userId },
				//найди
				include: {
					//подписчики
					followers: {
						//найди
						include: {
							//верни всех у кого будет true на мой id
							follower: true,
						},
					},
					//на кого подписан
					following: {
						//они содержат true
						include: {
							following: true,
						},
					},
				},
			});
			if (!user) {
				return res
					.status(400)
					.json({ error: 'Не удалось найти пользователя' });
			}
			res.json(user);
		} catch (error) {
			console.error('Get Current Error', error);
			res.status(500).json({ error: 'Internal server error ' });
		}
	},
};

module.exports = UserController;
