const express = require('express');
const router = express.Router();

//пакет для мульти загрузки
const multer = require('multer');
const UserController = require('../controllers/user-controller');

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

//роуты
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', UserController.current);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);

module.exports = router;
