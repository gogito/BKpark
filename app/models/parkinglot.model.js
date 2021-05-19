const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ParkingLotSchema = new Schema({
    coordinate: {
        longitude: { type: String, required: true },
        latitude: { type: String, required: true }
    },
    address: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    status: { type: String, required: true },
    area: [],
    image: { type: String}
},
    {
        versionKey: false
    });
module.exports = mongoose.model('ParkingLot', ParkingLotSchema, "parkinglots");