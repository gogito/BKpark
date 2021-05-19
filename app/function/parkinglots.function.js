const ParkingLot = require('../models/parkinglot.model.js');


exports.cal_status_func = async (id) => {

    var full_num = 0;
    var total_num = 0;
    var status = 5;

    data = await ParkingLot.findById(id)

    data.area.forEach(Melement => {
        Melement.slots.forEach(element => {
            if (element != 0) {
                full_num = full_num + 1;
            }
            total_num = total_num + 1;
        }
        )
    }
    )
    status = full_num / total_num;
    return status;
}


exports.cal_single_slot_func = (array, name, price) => {

    var fullslot = 0;
    var freeslot = 0;
    var resultObject;
    array.forEach(element => {

        if (element == 0) {
            freeslot = freeslot + 1;
        }

        else {
            fullslot = fullslot + 1;
        }
    }
    )
    resultObject = {
        name: name,
        slots: array,
        price: price,
        fullslot: fullslot,
        freeslot: freeslot
    };
    return resultObject;

}

exports.cal_slot_func = async (id) => {

    var resultArray = [];
    var resultObjecta = 'a';
    var resultObject;

    data = await ParkingLot.findById(id)

    data.area.forEach(Melement => {

        const result = this.cal_single_slot_func(Melement.slots, Melement.name, Melement.price);
        resultArray.push(result);

    }
    )

    resultArray.forEach(element => {
        resultObjecta = resultObjecta + JSON.stringify(element) + ','
    }
    )

    resultObject = resultObjecta.slice(0, -1);

    resultObject = resultObject.substring(1);

    return resultObject;
}

exports.cal_slot_id_func = async (id) => {
    var Object;
    Object = await this.cal_slot_func(id);

    return Object;
}


exports.check_slot = async (content, parkingID) => {

    let areaArray = content.area;

    let currentPL = await ParkingLot.findById(parkingID).lean();
    let currentArray = currentPL.area;


    console.log(areaArray);


    for (i = 0; i < areaArray.length; i++) {
        
        for (j = 0; j < areaArray[i].slots.length; j++) {

            if (areaArray[i].slots[j] != 2 && currentArray[i].slots[j] == 2) {
                areaArray[i].slots[j] = 2;
            }

            
        }

    }
    content.area = areaArray;
    console.log(content.area)

    return content;
}