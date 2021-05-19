module.exports = (app) => {
    const owners = require('../controllers/owner.controller.js');

    // Create a new owner
    app.post('/owners', owners.create);

    // Retrieve all owners
    app.get('/owners', owners.findAll);

    // Retrieve a single owner with ownerId
    app.get('/owners/:ownerId', owners.findOne);

    // Update a owner with ownerId
    app.put('/owners/:ownerId', owners.update);

    // Delete a owner with ownerId
    app.delete('/owners/:ownerId', owners.delete);

}