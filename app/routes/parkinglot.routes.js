module.exports = (app) => {
    const parkinglots = require('../controllers/parkinglot.controller.js');
    const cal_coor = require('../function/coordinate.function.js');


    // Register a new ParkingLot
    app.post('/parkinglots', parkinglots.create);

    // Retrieve all Parkinglots
    app.get('/parkinglots', parkinglots.findAll);

    // Calculate Distance
    app.post('/cal_coor', cal_coor.cal_distance);

    // Update a Parking with ParkingId
    app.put('/parkinglots/:parkingId', parkinglots.update);

     // Retrieve a single Parking Lot with parkingId
     app.get('/parkinglots/:parkingId', parkinglots.findOne);
}