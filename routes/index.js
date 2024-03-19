const express = require('express');
const router = express.Router();

//пакет для мульти загрузки
const multer = require('multer');

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
router.get('/register', (req, res) => {
	res.send('register');
});

module.exports = router;
