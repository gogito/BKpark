const Owner = require('../models/owner.model.js');
const Parkinglot = require('../models/parkinglot.model.js');
const Parkinglot_control = require('../controllers/parkinglot.controller');
const bookingfunc = require('../function/booking.function.js');
// Create and Save a new owner
exports.create = (req, res) => {
    // Validate request
    if (!req.body.password) {
        return res.status(400).send({
            message: "Password can not be empty"
        });
    }

    if (!req.body.name.FName) {
        return res.status(400).send({
            message: "First Name can not be empty"
        });
    }
    if (!req.body.name.LName) {
        return res.status(400).send({
            message: "Last Name can not be empty"
        });
    }

    if (!req.body.email) {
        return res.status(400).send({
            message: "Email can not be empty"
        });
    }

    if (!req.body.username) {
        return res.status(400).send({
            message: "Username can not be empty"
        });
    }

    if (!req.body.personalID) {
        return res.status(400).send({
            message: "PersonalID can not be empty"
        });
    }

    // Create an owner
    const owner = new Owner({
        username: req.body.username,
        password: req.body.password,
        name: {
            FName: req.body.name.FName,
            LName: req.body.name.LName
        },
        email: req.body.email,
        personalID: { type: String, required: true, unique: true },
        userType: "Owner",
        ownedParking: []
    });

    // Save owner in the database
    owner.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the owner."
            });
        });
};

// Retrieve and return all owners from the database.
exports.findAll = (req, res) => {
    Owner.find()
        .then(owners => {
            res.send(owners);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving owners."
            });
        });
};


// Find a single owner with a UserId
exports.findOne = (req, res) => {
    Owner.findById(req.params.ownerId)
        .then(owner => {
            if (!owner) {
                return res.status(404).send({
                    message: "Owner not found with id " + req.params.ownerId
                });
            }
            res.send(owner);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Owner not found with id " + req.params.ownerId
                });
            }
            return res.status(500).send({
                message: "Error retrieving owner with id " + req.params.ownerId
            });
        });
};

// Update a owner identified by the ownerId in the request
exports.update = (req, res) => {
    // Find owner and update it with the request body
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

    Owner.findOneAndUpdate({ _id: req.params.ownerId },
        content, { new: true })
        .then(owner => {
            if (!owner) {
                return res.status(404).send({
                    message: "Owner not found with id " + req.params.ownerId
                });
            }
            res.send(owner);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Owner not found with id " + req.params.ownerId
                });
            }
            return res.status(500).send({
                message: "Error updating owner with id " + req.params.ownerId
            });
        });
};

// Delete an owner with the specified ownerId in the request
exports.delete = (req, res) => {
    Owner.findByIdAndRemove(req.params.ownerId)
        .then(owner => {
            if (!owner) {
                return res.status(404).send({
                    message: "Owner not found with id " + req.params.ownerId
                });
            }
            res.send({ message: "Owner deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Owner not found with id " + req.params.ownerId
                });
            }
            return res.status(500).send({
                message: "Could not delete owner with id " + req.params.ownerId
            });
        });
};

// Find Booking by Owner ID old
// exports.find_booking_by_ownerID = async (req, res) => {

    
//     var complete_array = [];
//     let result = await Owner.findById(req.params.ownerId).lean();
//     let parking_array = result.ownedParking;

//     for (let i = 0; i < parking_array.length; i++) {

//         let booking_array = await bookingfunc.findBookingByParking_all(parking_array[i]);
        
//         let new_array = await bookingfunc.getName(booking_array);
        
//         complete_array = complete_array.concat(new_array);
       
//     }

   

//     res.send(complete_array);
// };

exports.find_booking_by_ownerID = async (req, res) => {

    var complete_array = [];
    let result = await Owner.findById(req.params.ownerId).lean();
    let parking_array = result.ownedParking;

        let booking_array = await bookingfunc.findBookingByParking_all_array(parking_array);
        
        let new_array = await bookingfunc.getName(booking_array);
        
        complete_array = new_array;
       
    res.send(complete_array);
};

// Find Parkinglot by Owner ID
exports.find_parking_by_ownerID = async (req, res) => {

    var complete_array = [];
    let result = await Owner.findById(req.params.ownerId).lean();
    let parking_array = result.ownedParking;

    complete_array = await Parkinglot.find({ '_id': { $in:parking_array} }).lean().exec();

    res.send(complete_array);
}