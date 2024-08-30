require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET="lamodedkekw" ;

const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
