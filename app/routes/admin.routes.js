module.exports = (app) => {
    const admins = require('../controllers/admin.controller.js');

    // Retrieve all Admins
    app.get('/admins', admins.findAll);

    // Retrieve a single Admin with adminId
    app.get('/admins/:adminId', admins.findOne);

    // Update a Admin with adminId
    app.put('/admins/:adminId', admins.update);

    // Delete a Admin with adminId
    app.delete('/admins/:adminId', admins.delete);
}