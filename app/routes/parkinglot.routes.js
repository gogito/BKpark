module.exports = (app) => {
    const parkinglots = require('../controllers/parkinglot.controller.js');
    const cal_coor = require('../function/coordinate.function.js');

        /**
     * @swagger
     * components:
     *   schemas:
     *     Parkinglot:
     *       type: object
     *       required:
     *         - name
     *         - coordinate
     *         - address
     *       properties:
     *         _id:
     *           type: string
     *           description: The auto-generated id of the parkinglot
     *         coordinate:
     *           type: object
     *           description: The Parkinglot Coordinate
     *           properties:
     *              latitude:
     *                  type: string
     *              longitude:
     *                  type: string
     *         name:
     *           type: string
     *           description: The Parkinglot Name
     *         address:
     *           type: string
     *           description: The Parkinglot Address
     *         status:
     *           type: string
     *           description: The Parkinglot Status
     *         image:
     *           type: string
     *           description: The Parkinglot Image
     *         area:
     *           type: array
     *           items:
     *              type: object
     *              properties:
     *                name:
     *                  type: string
     *                price:
     *                  type: string
     *                fullslot:
     *                  type: string
     *                freeslot:
     *                  type: string
     *                slots:
     *                  type: array
     *                  items:
     *                    type: integer
     *           description: The Parkinglot Area Info
     *   
     */




 /**
  * @swagger
  * tags:
  *   name: Parkinglots
  *   description: The Parkinglots managing API
  */

    // Register a new ParkingLot


/**
 * @swagger
 * /parkinglots:
 *   post:
 *     summary: Add a new Parkinglot
 *     tags: [Parkinglots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parkinglot'
 *     responses:
 *       200:
 *         description: The parkinglot description by id after created
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parkinglot'
 *       404:
 *         description: Could not create Parkinglot
 */        


    app.post('/parkinglots', parkinglots.create);

    // Retrieve all Parkinglots

/**
 * @swagger
 * /parkinglots:
 *   get:
 *     summary: Returns the list of all the parkinglots
 *     tags: [Parkinglots]
 *     responses:
 *       200:
 *         description: The list of the parkinglots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parkinglot'
 */

    app.get('/parkinglots', parkinglots.findAll);

    // Calculate Distance


/**
 * @swagger
 * /cal_coor:
 *   post:
 *     summary: Find parkinglot near specified coordinate
 *     tags: [Parkinglots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:            
 *              current:
 *                type: object
 *                properties:
 *                  latitude:
 *                    type: string
 *                  longitude:
 *                    type: string
 *              radius:
 *                type: string
 *     responses:
 *       200:
 *         description: The parkinglots matching conditions
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parkinglot'
 *       404:
 *         description: Could not find Parkinglot in radius
 */   

    app.post('/cal_coor', cal_coor.cal_distance);

    // Update a Parking with ParkingId

/**
 * @swagger
 * /parkinglots/{id}:
 *   put:
 *     summary: Update the Parkinglot by id
 *     tags: [Parkinglots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Parkinglot id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *              info:
 *                type: object
 *                description: Data NOT in an Array
 *                properties:
 *                  name:
 *                    type: string
 *                  address:
 *                    type: string
 *                  coordinate:
 *                    type: object
 *                    properties:
 *                      latitude:
 *                        type: string
 *                      longitude:
 *                        type: string
 *                  area:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        name:
 *                          type: string
 *                        price:
 *                          type: string
 *                        slots:
 *                          type: array
 *                          items:
 *                            type: integer
 *                 
 *     responses:
 *       200:
 *         description: The Parkinglot description by id after update
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parkinglot'
 *       404:
 *         description: The Parkinglot was not found
 */


    app.put('/parkinglots/:parkingId', parkinglots.update);

    // Retrieve a single Parking Lot with parkingId

/**
 * @swagger
 * /parkinglots/{id}:
 *   get:
 *     summary: Get the parkinglot by id
 *     tags: [Parkinglots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The parkinglot id
 *     responses:
 *       200:
 *         description: The parkinglot description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parkinglot'
 *       404:
 *         description: The parkinglot was not found
 */

    app.get('/parkinglots/:parkingId', parkinglots.findOne);


    // Delete a single Parking Lot with parkingId

/**
 * @swagger
 * /parkinglots/{id}:
 *   delete:
 *     summary: Delete the parkinglot by id
 *     tags: [Parkinglots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The parkinglot id
 *     responses:
 *       200:
 *         description: The parkinglot description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parkinglot'
 *       404:
 *         description: The parkinglot was not found
 */


app.delete('/parkinglots/:parkingId', parkinglots.delete);
}