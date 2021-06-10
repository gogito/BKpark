const ParkingLot = require('../models/parkinglot.model.js');
const plfunc = require('../function/parkinglots.function.js');
const bookingfunc = require('../function/booking.function.js');


// Create and Save a new ParkingLot
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Parking Lot Name can not be empty"
        });
    }

    if (!req.body.coordinate.latitude) {
        return res.status(400).send({
            message: "Parking Lot Latitude can not be empty"
        });
    }
    if (!req.body.coordinate.longitude) {
        return res.status(400).send({
            message: "Parking Lot Longitude can not be empty"
        });
    }

    if (!req.body.address) {
        return res.status(400).send({
            message: "Parking Lot Address can not be empty"
        });
    }

    if (!req.body.status) {
        return res.status(400).send({
            message: "Parking Lot Status can not be empty"
        });
    }

    if (!req.body.ownerID) {
        return res.status(400).send({
            message: "Parking Lot OwnerID can not be empty"
        });
    }

    // Create a Parking Lot
    const parkinglot = new ParkingLot({
        name: req.body.name,
        address: req.body.address,
        coordinate: {
            latitude: req.body.coordinate.latitude,
            longitude: req.body.coordinate.longitude
        },
        status: req.body.status,
        area: req.body.area,
        ownerID: req.body.ownerID
    });




    // Save ParkingLot in the database
    parkinglot.save()
        .then(data => {
            plfunc.link_parkinglot_owner(parkinglot._id, req.body.ownerID);
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the ParkingLot."
            });
        });

        

};

// Retrieve and return all Parking from the database.
exports.findAll = (req, res) => {
    ParkingLot.find( { deleted: { $exists: false } } )
        .then(parkinglots => {
        res.send(parkinglots);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Parking Lots."
        });
    });
};

// Update a ParkingLot identified by the parkingId in the request and status
exports.update = async (req, res) => {
    // Find Parking Lot and update it with the request body
    let content = await plfunc.check_slot(req.body.info, req.params.parkingId);

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

    await ParkingLot.findOneAndUpdate({ _id: req.params.parkingId },
        content, { new: true })
        .then(parking => {
            if (!parking) {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            // res.send(parkinglot);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            return res.status(500).send({
                message: "Error updating Parking Lot with id " + req.params.parkingId
            });
        });


    var slotResult = await plfunc.cal_slot_id_func(req.params.parkingId)
    slotResult = '[' + slotResult + ']';

    const jsonResult = JSON.parse(slotResult);

    content = {
        $set: { "area": jsonResult }
    }



    await ParkingLot.findOneAndUpdate({ _id: req.params.parkingId },
        content, { new: true })
        .then(parkinglot => {
            if (!parkinglot) {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            return res.status(500).send({
                message: "Error updating Parking Lot with id " + req.params.parkingId
            });
        });



    const result = await plfunc.cal_status_func(req.params.parkingId)

    content = {
        $set: { "status": result }
    }

    ParkingLot.findOneAndUpdate({ _id: req.params.parkingId },
        content, { new: true })
        .then(parkinglot => {
            if (!parkinglot) {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            res.send(parkinglot);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            return res.status(500).send({
                message: "Error updating Parking Lot with id " + req.params.parkingId
            });
        });
};

// Find a single Parking Lot with a parkingId
exports.findOne = (req, res) => {
    ParkingLot.findById(req.params.parkingId)
        .then(parkinglot => {
            if (!parkinglot) {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            res.send(parkinglot);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Parking Lot with id " + req.params.parkingId
            });
        });
};

// Delete a single Parking Lot with a parkingId
exports.delete = async (req, res) => {
    var bookingID_array = [];


    let booking_array = await bookingfunc.findBookingByParking(req.params.parkingId);

    for (let i = 0; i < booking_array.length; i++) {
        bookingID_array[i] = booking_array[i]._id;
    }

    await bookingfunc.unbook_slot_multi(bookingID_array);

    let content = {
        $set: { "deleted": "true" }
    }

    await ParkingLot.findOneAndUpdate({ _id: req.params.parkingId },
        content, { new: true })
        .then(parkinglot => {
            if (!parkinglot) {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            res.send(parkinglot);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Parking Lot not found with id " + req.params.parkingId
                });
            }
            return res.status(500).send({
                message: "Error updating Parking Lot with id " + req.params.parkingId
            });
        });


};


// Find all Booking from a Parking Lot with parkingId
exports.get_booking_from_parking = async (req, res) => {

    let booking_array = await bookingfunc.findBookingByParking_all(req.params.parkingId);
    let result_array = await bookingfunc.getName(booking_array);
    
    // console.log(result_array);
    res.send(result_array);

};