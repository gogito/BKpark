const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
		info: {
			title: "BKPark API",
			version: "1.0.0",
			description: "BKPark Smart Parking API",
		},
		servers: [
			{
				url: "http://gogito.duckdns.org:3002",
			},
		],
	},
	apis: ["./app/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



require('./app/routes/note.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/register.routes.js')(app);
require('./app/routes/login.routes.js')(app);
require('./app/routes/ownerlogin.routes.js')(app);
require('./app/routes/owner.routes.js')(app);
require('./app/routes/parkinglot.routes.js')(app);
require('./app/routes/booking.routes.js')(app);
require('./app/routes/other.routes.js')(app);
require('./app/routes/test.routes.js')(app);

// listen for requests
app.listen(3002, () => {
    console.log("Server is listening on port 3002");
});
