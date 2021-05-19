module.exports = (app) => {
    const bookings = require('../controllers/booking.controller.js');

    // Retrieve all Booking
    app.get('/bookings', bookings.findAll);

    // Retrieve One Booking
    app.get('/bookings/:bookingId', bookings.findOne);

    // Add new Booking
    app.post('/bookings', bookings.create);

    // Cancel Booking
    app.delete('/bookings/:bookingID', bookings.delete);

    // Complete Booking
    app.put('/bookings/:bookingID', bookings.put);

}