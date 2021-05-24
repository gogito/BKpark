module.exports = (app) => {
    const admin_register = require('../controllers/admin_register.controller.js');

    // Admin_register a new admin
    app.post('/admin_register', admin_register.create);
}