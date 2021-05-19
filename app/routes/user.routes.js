module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - username
     *         - password
     *         - userType
     *         - personalID
     *       properties:
     *         _id:
     *           type: string
     *           description: The auto-generated id of the user
     *         name:
     *           type: object
     *           description: The user Name
     *           properties:
     *              FName:
     *                  type: string
     *              LName:
     *                  type: string
     *         email:
     *           type: string
     *           description: The user Email
     *         username:
     *           type: string
     *           description: The user Username
     *         password:
     *           type: string
     *           description: The user Password
     *         userType:
     *           type: string
     *           description: The user userType
     *         personalID:
     *           type: string
     *           description: The user personalID
     *         carplateNumber:
     *           type: array
     *           items:
     *              type: string
     *           uniqueItems: true
     *           description: The user carplate Number
     *         successBooking:
     *           type: array
     *           items:
     *              type: string
     *           uniqueItems: true
     *           description: The user Success Booking
     *         failBooking:
     *           type: array
     *           items:
     *              type: string
     *           uniqueItems: true
     *           description: The user Fail Booking
     *         currentBooking:
     *           type: string
     *           description: The user currentBooking      
     */

    // Retrieve all Users


 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */



/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */


    app.get('/users', users.findAll);

    // Retrieve a single User with userId

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */


    app.get('/users/:userId', users.findOne);

    // Update a User with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);
}