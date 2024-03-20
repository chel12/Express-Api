const express = require('express');
const router = express.Router();

//пакет для мульти загрузки
const multer = require('multer');
const UserController = require('../controllers/user-controller');
const authenticateToken = require('../controllers/middleware/auth');
const PostController = require('../controllers/post-controller');

const uploadDestination = 'uploads';

// Показываем, где хранить файлы
const storage = multer.diskStorage({
	//указ путь на папку uploads, который сервак использует для хранения
	destination: uploadDestination,

	//req что пришло и сам файл
	//cb коллбек который возвращает file
	//file имя файла с которым было всё создано
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

//переменная где создалось хранилище через storage конфиг  выше
const uploads = multer({ storage: storage });

//роуты Пользователя
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.put('/users/:id', authenticateToken, UserController.updateUser);

//Роуты Постов
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

module.exports = router;
