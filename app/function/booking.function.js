const ParkingLot = require('../models/parkinglot.model.js');
const User = require('../models/user.model.js');
const Booking = require('../models/booking.model.js');
const parkinglot = require('../controllers/parkinglot.controller.js');
const plfunc = require('../function/parkinglots.function.js');
exports.check_avail = async (parkingID, areaName) => {

    var data;
    var slot_id;
    data = await ParkingLot.findById(parkingID);

    for (let i = 0; i < data.area.length; i++) {

        if (data.area[i].name === areaName && data.area[i].freeslot > 0) {

            for (let j = 0; j < data.area[i].slots.length; j++) {
                if (data.area[i].slots[j] == 0) {
                    slot_id = j;
                    data.area[i].slots[j] = 2;

                    data.area[i].fullslot += 1;

                    data.area[i].freeslot -= 1;

                    await ParkingLot.findOneAndUpdate({ _id: parkingID },
                        { $set: { "area": data.area } }, { new: true })
                        .then(parking => {
                            if (!parking) {
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

                    return j;

                }

            }

        }

    }

    return -1;
}

exports.unbook_slot = async (bookingID) => {


    booking_data = await Booking.findById(bookingID);

    let parkingID = booking_data.parkinglotID;
    let areaName = booking_data.areaName;
    let slot_id = booking_data.slot_id;

    data = await ParkingLot.findById(parkingID);

    for (let i = 0; i < data.area.length; i++) {

        if (data.area[i].name === areaName) {


            data.area[i].slots[slot_id] = 0;
            data.area[i].fullslot -= 1;
            data.area[i].freeslot += 1;

            await ParkingLot.findOneAndUpdate({ _id: parkingID },
                { $set: { "area": data.area } }, { new: true })
                .then(parking => {
                    if (!parking) {
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


            const result = await plfunc.cal_status_func(parkingID)

            content = {
                $set: { "status": result }
            }

            await ParkingLot.findOneAndUpdate({ _id: parkingID },
                content, { new: true })
                .then(parkinglot => {
                    if (!parkinglot) {
                        return res.status(404).send({
                            message: "Parking Lot not found with id " + parkingID
                        });
                    }


                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Parking Lot not found with id " + parkingID
                        });
                    }
                    return res.status(500).send({
                        message: "Error updating Parking Lot with id " + parkingID
                    });
                });
            return true;

        }

    }

}

exports.unbook_slot_done = async (bookingID) => {


    booking_data = await Booking.findById(bookingID);

    let parkingID = booking_data.parkinglotID;
    let areaName = booking_data.areaName;
    let slot_id = booking_data.slot_id;

    data = await ParkingLot.findById(parkingID);

    for (let i = 0; i < data.area.length; i++) {

        if (data.area[i].name === areaName) {


            data.area[i].slots[slot_id] = 1;


            await ParkingLot.findOneAndUpdate({ _id: parkingID },
                { $set: { "area": data.area } }, { new: true })
                .then(parking => {
                    if (!parking) {
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


            const result = await plfunc.cal_status_func(parkingID)

            content = {
                $set: { "status": result }
            }

            await ParkingLot.findOneAndUpdate({ _id: parkingID },
                content, { new: true })
                .then(parkinglot => {
                    if (!parkinglot) {
                        return res.status(404).send({
                            message: "Parking Lot not found with id " + parkingID
                        });
                    }


                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Parking Lot not found with id " + parkingID
                        });
                    }
                    return res.status(500).send({
                        message: "Error updating Parking Lot with id " + parkingID
                    });
                });
            return true;

        }

    }

}


exports.check_currentBooking = async (userID) => {

    currentUser = await User.findById(userID);
    if (currentUser.currentBooking == "") {

        return 0;

    }

    else return 1;

}

exports.getName = async (bookingArray) => {

    var completeArray;
    let parkinglotIDArray = [];
    let userIDArray = [];
    for (let i = 0; i < bookingArray.length; i++) {

        parkinglotIDArray.push(bookingArray[i].parkinglotID);
        userIDArray.push(bookingArray[i].userID);

    }

    var promise1 = ParkingLot.find({ _id: { $in: parkinglotIDArray } }).exec();
    var promise2 = User.find({ _id: { $in: userIDArray } }).exec();

    await Promise.all([promise1, promise2]).then(function (value) {

        let arrayOfParkinglot = value[0];
        let arrayOfUser = value[1];
        for (let i = 0; i < bookingArray.length; i++) {
            for (let j = 0; j < arrayOfParkinglot.length; j++) {
                for (let z = 0; z < arrayOfUser.length; z++) {
                    if (bookingArray[i].parkinglotID == arrayOfParkinglot[j]._id) {
                        bookingArray[i].parkinglotName = arrayOfParkinglot[j].name;
                    }
                    if (bookingArray[i].userID == arrayOfUser[z]._id) {
                        bookingArray[i].userName = arrayOfUser[z].name;
                    }
                }
            }
        }

        
    });

    completeArray = bookingArray;
        // console.log(completeArray);
        return completeArray;
}

