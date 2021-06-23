module.exports = (app) => {
    const requests = require('../controllers/request.controller.js');
 /**
     * @swagger
     * components:
     *   schemas:
     *     Request:
     *       type: object
     *       required:
     *         - areaName
     *         - edge_id
     *         - parkinglotID
     *         - time
     *         - slots
     *       properties:
     *         _id:
     *           type: string
     *           description: The auto-generated id of the request
     *         time:
     *           type: object
     *           description: The request time
     *           properties:
     *              sent:
     *                  type: string
     *              received:
     *                  type: string
     *         parkinglotID:
     *           type: string
     *           description: The request Parkinglot ID
     *         areName:
     *           type: string
     *           description: The request Area
     *         slots:
     *           type: array
     *           item: 
     *              type: integer       
     *           description: The admin Password
     *          
     *        
     */

/**
  * @swagger
  * tags:
  *   name: Requests
  *   description: The Requests managing API
  */
    // Retrieve all Requests

    /**
 * @swagger
 * /requests:
 *   get:
 *     summary: Returns the list of all the requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: The list of the requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 */
    app.get('/requests', requests.findAll);
}