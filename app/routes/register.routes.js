module.exports = (app) => {
    const register = require('../controllers/register.controller.js');

    // Register a new user
    app.post('/register', register.create);
}