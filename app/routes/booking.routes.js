module.exports = (app) => {
    const bookings = require('../controllers/booking.controller.js');
    const rateLimit = require("express-rate-limit");

    const bookingLimiter = rateLimit({
        windowMs: 10 * 1000, // 1 hour window
        max: 1, // start blocking after 5 requests
        message:
          "Too many accounts created from this IP, please try again after an hour"
      });


    // Retrieve all Booking
    app.get('/bookings', bookings.findAll);

    // Retrieve One Booking
    app.get('/bookings/:bookingId', bookings.findOne);

    // Add new Booking
    app.post('/bookings', bookingLimiter,  bookings.create);

    // Cancel Booking
    app.delete('/bookings/:bookingID', bookings.delete);

    // Complete Booking
    app.put('/bookings/:bookingID', bookings.put);

}