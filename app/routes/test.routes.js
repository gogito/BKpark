module.exports = (app) => {
    const test = require('../controllers/test.controller.js');





    // Test
    app.post('/test/:parkingId', test.test);


}