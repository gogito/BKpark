const Request = require('../models/request.model.js');

// Retrieve and return all requests from the database.
exports.findAll = (req, res) => {
    Request.find().lean()
        .then(requests => {
            res.send(requests);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving requests."
            });
        });
};

// Return total number of request
exports.getTotal = (req, res) => {
    Request.find().lean()
        .then(requests => {
            res.send({ total_request: requests.length });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving requests."
            });
        });
};

// Return count of request
exports.getCount = async (req, res) => {
    var edge_id_array = [];
    // var area_array = [];
    var parkinglot_array = [];

    var total_edge_id_array = [];
    // var total_area_array = [];
    var total_parkinglot_array = [];

    let request_array = await Request.find().lean();
    for (let i = 0; i < request_array.length; i++) {
        edge_id_array[i] = request_array[i].edge_id;
        // area_array[i] = request_array[i].areaName;
        parkinglot_array[i] = request_array[i].parkinglotID;
    }

    const uniqueset = new Set(edge_id_array)
    // const uniqueset1 = new Set(area_array)
    const uniqueset2 = new Set(parkinglot_array)

    edge_id_array = [...uniqueset];
    // area_array = [...uniqueset1];
    parkinglot_array = [...uniqueset2];




    for (let j = 0; j < edge_id_array.length; j++) {

        var count = request_array.filter((obj) => obj.edge_id === edge_id_array[j]).length;
        total_edge_id_array.push(
            {
                "edge_id": edge_id_array[j],
                "count": count
            }
        )
    }

    // for (let j = 0; j < area_array.length; j++) {

    //     var count = request_array.filter((obj) => obj.areaName === area_array[j]).length;
    //     total_area_array.push(
    //         {
    //             "areaName": area_array[j],
    //             "count": count
    //         }
    //     )
    // }

    for (let j = 0; j < parkinglot_array.length; j++) {

        var count = request_array.filter((obj) => obj.parkinglotID === parkinglot_array[j]).length;
        total_parkinglot_array.push(
            {
                "parkinglotID": parkinglot_array[j],
                "count": count
            }
        )
    }

    res.send(
        {
            total_edge_id_array,
            // total_area_array,
            total_parkinglot_array

        }
    )

};