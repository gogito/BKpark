module.exports = (app) => {
    const others = require('../controllers/other.controller.js');

    // Retrieve routing
    app.get('/other/routing/:curLong/:curLat/:desLong/:desLat', others.routing);

    app.get('/other/search/:keyword', others.search);

  
}