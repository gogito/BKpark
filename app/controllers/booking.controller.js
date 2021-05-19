const Booking = require('../models/booking.model.js');
const bookingfunc = require('../function/booking.function.js');
const User = require('../models/user.model.js');
// Create and Save a new ParkingLot
exports.create = async (req, res) => {
    var bookingID;
    // Validate request
    if (!req.body.userID) {
        return res.status(400).send({
            message: "Booking UserID can not be empty"
        });
    }

    if (!req.body.parkinglotID) {
        return res.status(400).send({
            message: "Booking parkinglotID can not be empty"
        });
    }

    if (!req.body.areaName) {
        return res.status(400).send({
            message: "Booking areaName can not be empty"
        });
    }

   
    let check_avail = await bookingfunc.check_avail(req.body.parkinglotID, req.body.areaName);

    if (check_avail > -1){
    
        // Create a Booking
        const booking = new Booking({
            userID: req.body.userID,
            parkinglotID: req.body.parkinglotID,
            areaName: req.body.areaName,
            slot_id: check_avail,
            status: "Booked"
        });

        // Save Booking in the database
        await booking.save()
            .then(data => {
                
                bookingID = data._id;
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Booking."
                });
            });

    }
    else {
        res.status(500).send({
            message: "No booking slots available !!!"
        });
    }
    
    User.findOneAndUpdate({ _id: req.body.userID },
        { $set: { "currentBooking": bookingID } }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
};

// Retrieve and return all Booking from the database.
exports.findAll = (req, res) => {
    Booking.find()
        .then(bookings => {
            res.send(bookings);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Bookings."
            });
        });
};

// Find a single booking with a UserId
exports.findOne = (req, res) => {
    Booking.findById(req.params.bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            res.send(booking);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Booking with id " + req.params.bookingId
            });
        });
};

// Cancel Booking.
exports.delete = async (req, res) => {

    let check_unbook = await bookingfunc.unbook_slot(req.params.bookingID);

    if (check_unbook) {

        await Booking.findOneAndUpdate({ _id: req.params.bookingID },
            { $set: { "status": "Failed" } }, { new: true })
            .then(booking => {
                if (!booking) {
                    return res.status(404).send({
                        message: "Booking not found with id " + req.params.bookingID
                    });
                }
                
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Booking not found with id " + req.params.bookingID
                    });
                }
                return res.status(500).send({
                    message: "Error updating Booking with id " + req.params.bookingID
                });
            });

        let booking_data = await Booking.findById(req.params.bookingID);

        let booked_user_data = await User.findById(booking_data.userID);

        booked_user_data.failBooking.push(booked_user_data.currentBooking);
        booked_user_data.currentBooking = '';

        User.findOneAndUpdate({ _id: booking_data.userID },
            { $set: {"currentBooking": booked_user_data.currentBooking, "failBooking": booked_user_data.failBooking} }, { new: true })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User not found with id " + booking_data.userID
                    });
                }
                res.send(user);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with id " + booking_data.userID
                    });
                }
                return res.status(500).send({
                    message: "Error updating user with id " + booking_data.userID
                });
            });
    }
    
};

// Complete Booking.
exports.put = async (req, res) => {

    let check_unbook = await bookingfunc.unbook_slot(req.params.bookingID);

    if (check_unbook) {

        await Booking.findOneAndUpdate({ _id: req.params.bookingID },
            { $set: { "status": "Success" } }, { new: true })
            .then(booking => {
                if (!booking) {
                    return res.status(404).send({
                        message: "Booking not found with id " + req.params.bookingID
                    });
                }
                
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Booking not found with id " + req.params.bookingID
                    });
                }
                return res.status(500).send({
                    message: "Error updating Booking with id " + req.params.bookingID
                });
            });

        let booking_data = await Booking.findById(req.params.bookingID);

        let booked_user_data = await User.findById(booking_data.userID);

        booked_user_data.successBooking.push(booked_user_data.currentBooking);
        booked_user_data.currentBooking = '';

        User.findOneAndUpdate({ _id: booking_data.userID },
            { $set: {"currentBooking": booked_user_data.currentBooking, "successBooking": booked_user_data.successBooking} }, { new: true })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User not found with id " + booking_data.userID
                    });
                }
                res.send(user);s
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with id " + booking_data.userID
                    });
                }
                return res.status(500).send({
                    message: "Error updating user with id " + booking_data.userID
                });
            });
    }
    
};