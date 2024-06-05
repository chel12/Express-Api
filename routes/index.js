const express = require('express');
const router = express.Router();

//пакет для мульти загрузки
const multer = require('multer');
const UserController = require('../controllers/user-controller');
const authenticateToken = require('../controllers/middleware/auth');
const PostController = require('../controllers/post-controller');
const CommentController = require('../controllers/comment-controller');
const { LikeController, FollowController } = require('../controllers');

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
router.put(
	'/users/:id',
	authenticateToken,
	uploads.single('avatar'),
	UserController.updateUser
);

//Роуты Постов
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

//Роуты комментов
router.post('/comments', authenticateToken, CommentController.createComment);
router.delete(
	'/comments/:id',
	authenticateToken,
	CommentController.deleteComment
);
//Роуты лайков
router.post('/likes', authenticateToken, LikeController.likePost);
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost);
//Роуты подписок
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete(
	'/unfollow/:id',
	authenticateToken,
	FollowController.unfollowUser
);

module.exports = router;
