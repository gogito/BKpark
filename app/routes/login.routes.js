module.exports = (app) => {
    const login = require('../controllers/login.controller.js');

    // Retrieve a single User with username and password
    app.post('/login', login.findOne);


  
}