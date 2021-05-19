const ParkingLot = require('../models/parkinglot.model.js');
const User = require('../models/user.model.js');
const Booking = require('../models/booking.model.js');
const parkinglot = require('../controllers/parkinglot.controller.js');
const parkingfunc = require('../function/parkinglots.function');
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

            return true;

        }



    }







}

exports.check_currentBooking = async (userID) => {

 currentUser = await User.findById(userID);
 if (currentUser.currentBooking == ""){

    return 0;

 }

else return 1;

}
