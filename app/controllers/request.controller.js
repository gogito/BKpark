const Request = require('../models/request.model.js');
const Parkinglot = require('../models/parkinglot.model.js');
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

    var parkinglot_array = [];

    var request_array = [];

    var total_edge_id_array = [];

    var total_parkinglot_array = [];

    var promise1 = Request.find().lean().exec();
    var promise2 = Parkinglot.find({}, { name: 1 }).lean().exec();

    await Promise.all([promise1, promise2]).then(function (value) {

        request_array = value[0];
        parkinglot_array = value[1];


        for (let i = 0; i < request_array.length; i++) {
            edge_id_array[i] = request_array[i].edge_id;
        }



        const uniqueset = new Set(edge_id_array)


        edge_id_array = [...uniqueset];




        for (let j = 0; j < edge_id_array.length; j++) {

            var count = request_array.filter((obj) => obj.edge_id === edge_id_array[j]).length;
            total_edge_id_array.push(
                {
                    "edge_id": edge_id_array[j],
                    "count": count
                }
            )
        }


        for (let j = 0; j < parkinglot_array.length; j++) {

            var count = request_array.filter((obj) => obj.parkinglotID == parkinglot_array[j]._id).length;
            total_parkinglot_array.push(
                {
                    "parkinglotID": parkinglot_array[j]._id,
                    "name": parkinglot_array[j].name,
                    "count": count
                }
            )
        }

        res.send(
            {
                total_edge_id_array,

                total_parkinglot_array

            }
        )

    });



};

// Return count of request for specific owner
exports.getCountOwner = async (req, res) => {
    console.log(req.params.ownerID);
    var edge_id_array = [];

    var parkinglot_array = [];

    var request_array = [];

    var total_edge_id_array = [];

    var total_parkinglot_array = [];

    var parkinglot_id_array = [];

    let promise2 = await Parkinglot.find({ ownerID: req.params.ownerID }, { name: 1 }).lean().exec();

    for (i = 0; i < promise2.length; i++) {

        parkinglot_id_array[i] = promise2[i]._id

    }

    let promise1 = await Request.find({ parkinglotID: { $in: parkinglot_id_array } }).lean().exec();

    request_array = promise1;
    parkinglot_array = promise2;

    for (let i = 0; i < request_array.length; i++) {
        edge_id_array[i] = request_array[i].edge_id;

    }

    const uniqueset = new Set(edge_id_array)

    edge_id_array = [...uniqueset];

    for (let j = 0; j < edge_id_array.length; j++) {

        var count = request_array.filter((obj) => obj.edge_id === edge_id_array[j]).length;
        total_edge_id_array.push(
            {
                "edge_id": edge_id_array[j],
                "count": count
            }
        )
    }
    for (let j = 0; j < parkinglot_array.length; j++) {

        var count = request_array.filter((obj) => obj.parkinglotID == parkinglot_array[j]._id).length;
        total_parkinglot_array.push(
            {
                "parkinglotID": parkinglot_array[j]._id,
                "name": parkinglot_array[j].name,
                "count": count
            }
        )
    }
    res.send(
        {
            total_edge_id_array,

            total_parkinglot_array

        }
    )
};
