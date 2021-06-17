const User = require('../models/user.model.js');
const bookingfunc = require('../function/booking.function.js');
const Booking = require('../models/booking.model.js');

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with a UserId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId
            });
        });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    // Find user and update it with the request body
    let content = "400";
    if (req.body.infoArray !== undefined && req.body.info !== undefined) {
        content = {
            $set: req.body.info,
            $addToSet: req.body.infoArray
        }
    }
    else if (req.body.info !== undefined) {
        content = {
            $set: req.body.info
        }
    }

    else {
        content = {
            $addToSet: req.body.infoArray
        }
    }

    User.findOneAndUpdate({ _id: req.params.userId },
        content, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
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

// Delete a user with the specified userId in the request
exports.delete = async (req, res) => {


    let cur_user = await User.findById(req.params.userId);
    if (cur_user.currentBooking != null && cur_user.currentBooking != '') {

        bookingfunc.unbook_slot(cur_user.currentBooking);
    }

    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });





    var bookingID_array = [];
    var return_array = [];

    let booking_array = await bookingfunc.findBookingByUser(req.params.userId);

    if (booking_array.length > 0) {
        for (let i = 0; i < booking_array.length; i++) {
            bookingID_array[i] = booking_array[i]._id;
        }

        var promise1 = Booking.deleteMany({ _id: { $in: bookingID_array } }).exec();

        await Promise.all([promise1]).then(function (value) {
            return_array = value[0];
        });

    }
    res.send( {message: "Deleted User and Booking"});
};

// Find Booking by User ID
exports.find_booking_by_userID = async (req, res) => {
    var booking_array = [];
    var complete_array = [];
    let result = await User.findById(req.params.userId).lean();

    let successArray = result.successBooking;
    let failArray = result.failBooking;

    if (result.currentBooking != null && result.currentBooking != '') {
        booking_array.push(result.currentBooking)
    }

    booking_array = booking_array.concat(successArray);
    booking_array = booking_array.concat(failArray);

    let booking_array_full = await Booking.find({ _id: { $in: booking_array } }).lean().exec();

    let new_array = await bookingfunc.getName(booking_array_full);

    complete_array = new_array;

    res.send(complete_array);
}