const ParkingLot = require('../models/parkinglot.model.js');
const plfunc = require('../function/parkinglots.function.js');

   // Find Parking Lot and update it with the request body
exports.test = async (req, res) => {
 
    

    let content =  await plfunc.check_slot(req.body.info, req.params.parkingId);



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
    
    res.send(content);
};