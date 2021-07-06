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

    if (booking_data.status == "Booked") {

        let parkingID = booking_data.parkinglotID;
        let areaName = booking_data.areaName;
        let slot_id = booking_data.slot_id;

        data = await ParkingLot.findById(parkingID).lean();

        for (let i = 0; i < data.area.length; i++) {

            if (data.area[i].name == areaName) {

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

                ParkingLot.findOneAndUpdate({ _id: parkingID },
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
    let areaArray = [];
    for (let i = 0; i < bookingArray.length; i++) {

        parkinglotIDArray.push(bookingArray[i].parkinglotID);
        userIDArray.push(bookingArray[i].userID);
        areaArray.push(bookingArray[i].areaName);
    }

    var promise1 = ParkingLot.find({ _id: { $in: parkinglotIDArray } }).exec();
    var promise2 = User.find({ _id: { $in: userIDArray } }).exec();

    await Promise.all([promise1, promise2]).then(function (value) {
        console.log("Called");
        let arrayOfParkinglot = value[0];
        let arrayOfUser = value[1];
        for (let i = 0; i < bookingArray.length; i++) {
            let flag = 0;
            for (let j = 0; j < arrayOfParkinglot.length; j++) {
                if (flag == 1) { break; }
                for (let k = 0; k < arrayOfParkinglot[j].area.length; k++) {
                    if (flag == 1) { break; }
                    for (let z = 0; z < arrayOfUser.length; z++) {
                        if (flag == 1) { break; }
                        if (bookingArray[i].parkinglotID == arrayOfParkinglot[j]._id && bookingArray[i].userID == arrayOfUser[z]._id && bookingArray[i].areaName == arrayOfParkinglot[j].area[k].name) {
                            bookingArray[i].parkinglotName = arrayOfParkinglot[j].name;
                            bookingArray[i].parkinglotAddress = arrayOfParkinglot[j].address;
                            bookingArray[i].userName = arrayOfUser[z].name;
                            bookingArray[i].price = arrayOfParkinglot[j].area[k].price;
                            // console.log(count);
                            // count++;
                            flag = 1;

                        }

                    }

                }

            }
        }

    });

    completeArray = bookingArray;

    return completeArray;
}

exports.findBookingByParking = async (parkingID) => {
    var bookingID_array;
    var promise1 = Booking.find({ parkinglotID: parkingID }).exec();
    await Promise.all([promise1]).then(function (value) {
        bookingID_array = value[0];
    });

    return bookingID_array;
}

exports.findBookingByParking_all = async (parkingID) => {
    // console.log(parking)
    var bookingID_array;
    var promise1 = Booking.find({ parkinglotID: parkingID }).lean().exec();
    await Promise.all([promise1]).then(function (value) {
        bookingID_array = value[0];
    });

    return bookingID_array;
}

exports.findBookingByParking_all_array = async (parkingID_array) => {
    var bookingID_array;
    var promise1 = Booking.find({ 'parkinglotID': { $in: parkingID_array } }).lean().exec();
    await Promise.all([promise1]).then(function (value) {
        bookingID_array = value[0];
    });

    return bookingID_array;
}

exports.findBookingByUser = async (userID) => {

    var bookingID_array;
    var promise1 = Booking.find({ userID: userID }).exec();
    await Promise.all([promise1]).then(function (value) {
        bookingID_array = value[0];
    });

    return bookingID_array;

}

exports.unbook_slot_multi = async (bookingID_array) => {

    for (let i = 0; i < bookingID_array.length; i++) {

        this.unbook_slot(bookingID_array[i])

    }
}

exports.getTime = () => {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return time;
    // // prints date in YYYY-MM-DD format
    // console.log(year + "-" + month + "-" + date);

    // // prints date & time in YYYY-MM-DD HH:MM:SS format
    // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    // // prints time in HH:MM format
    // console.log(hours + ":" + minutes);

}

exports.getTimeMS = () => {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // current seconds
    let ms = date_ob.getMilliseconds();

    let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "." + ms;

    return time;
    // // prints date in YYYY-MM-DD format
    // console.log(year + "-" + month + "-" + date);

    // // prints date & time in YYYY-MM-DD HH:MM:SS format
    // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    // // prints time in HH:MM format
    // console.log(hours + ":" + minutes);

}

exports.clearBookingfromUser = async (booking_id_array) => {
    var current_booking = [];

    current_booking = await User.find({ 'currentBooking': { $in: booking_id_array } }, { currentBooking: 1 }).lean().exec();

    for (let g = 0; g < current_booking.length; g++) {

        await this.cancel_booking(current_booking[g].currentBooking);
    }



    let content = {
        $pull: {
            "failBooking": { $in: booking_id_array }, "successBooking": { $in: booking_id_array }
        }
    }


    await User.updateMany({},
        content, { multi: true })


}

exports.cancel_booking = async (bookingID) => {

    let check_unbook = await this.unbook_slot(bookingID);

    if (check_unbook) {

        await Booking.findOneAndUpdate({ _id: bookingID },
            { $set: { "status": "Failed" } }, { new: true })

        let booking_data = await Booking.findById(bookingID);

        let booked_user_data = await User.findById(booking_data.userID);

        booked_user_data.failBooking.push(booked_user_data.currentBooking);
        booked_user_data.currentBooking = '';

        await User.findOneAndUpdate({ _id: booking_data.userID },
            { $set: { "currentBooking": booked_user_data.currentBooking, "failBooking": booked_user_data.failBooking } }, { new: true })

    }
}

exports.findCurrentBookingByParkingandArea = async (parkingID, areaName) => {
    var bookingID_array;
    var promise1 = Booking.find({ parkinglotID: parkingID, areaName: areaName, status: "Booked" }).exec();
    await Promise.all([promise1]).then(function (value) {
        bookingID_array = value[0];
    });

    return bookingID_array;
}