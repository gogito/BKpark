module.exports = (app) => {
    const ownerlogin = require('../controllers/ownerlogin.controller.js');

    // Retrieve a single User with username and password
    app.post('/ownerlogin', ownerlogin.findOne);


  
}