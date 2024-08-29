const jwt = require('jsonwebtoken');
const JWT_SECRET = 'lamodedkekw';

// Simulate generating a token for a user
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
console.log('Generated Token:', token);
