const jwt = require('jsonwebtoken');

//проверка токена
const authenticateToken = (req, res, next) => {
	//достать хедер из запроса
	const authHeader = req.headers['authorization'];
	//проверка есть ли вообще и если есть го сплит
	const token = authHeader && authHeader.split(' ')[1];
	//если токена нет
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	//расшифруй токен и проверь секретный ключ
	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Invalid token' });
		}
		//в каждом запросе был пользователь и был к нему доступ
		req.user = user;
		//след запрос
		next();
	});
};
module.exports = authenticateToken;
