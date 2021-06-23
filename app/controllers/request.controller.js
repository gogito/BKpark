const Request = require('../models/request.model.js');

// Retrieve and return all admins from the database.
exports.findAll = (req, res) => {
    Request.find()
        .then(requests => {
            res.send(requests);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving requests."
            });
        });
};

