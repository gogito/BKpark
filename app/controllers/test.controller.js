const ParkingLot = require('../models/parkinglot.model.js');
const plfunc = require('../function/parkinglots.function.js');

exports.getAreainfo = async (req, res) => {
    var finalArray = [];
    let parkinglotArray = await ParkingLot.find().lean().exec();
    for (let n = 0; n < parkinglotArray.length; n++) {
    finalArray =  finalArray.concat( plfunc.extract_area_from_parkinglot(parkinglotArray[n]));
    }
    res.send(finalArray);
        
};