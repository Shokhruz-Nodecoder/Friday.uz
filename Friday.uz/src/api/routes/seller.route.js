const { Router } = require("express");
const { register, login, verify, getSellers, getOneSeller } = require("../controllers/seller.controller");
const router = new Router();



/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: The seller managing API
 */
/**
 * @swagger
 * /seller/signup:
 *   post:
 *     summary: Register a new seller
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               company_name:
 *                 type: string
 *               INN:
 *                 type: string
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - phone_number
 *               - company_name
 *               - INN
 *     responses:
 *       201:
 *         description: Seller registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the registration.
 *                 token:
 *                   type: string
 *                   description: JWT token for the newly registered seller.
 *       400:
 *         description: Bad request, invalid input or seller with the same INN already exists.
 */
router.post("/seller/signup", register);



/**
 * @swagger
 * /seller/signin:
 *   post:
 *     summary: Seller login
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Seller logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the login.
 *                 token:
 *                   type: string
 *                   description: JWT token for the logged-in seller.
 *       400:
 *         description: Bad request, invalid input or seller not found.
 *       404:
 *         description: Invalid username or password provided for login.
 */
router.post("/seller/signin", login);


/**
 * @swagger
 * /seller/signup/verify:
 *   post:
 *     summary: Verify seller registration
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verification:
 *                 type: string
 *             required:
 *               - verification
 *     responses:
 *       201:
 *         description: Seller registration verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the verification.
 *                 token:
 *                   type: string
 *                   description: JWT token for the verified seller.
 *       400:
 *         description: Bad request, invalid input or verification code.
 *       404:
 *         description: Invalid code for verification.
 */

router.post("/seller/signup/verify", verify);



/**
 * @swagger
 * /seller:
 *   get:
 *     summary: Get all sellers
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of all sellers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                 seller:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seller'
 *       404:
 *         description: No sellers found in the database.
 */
router.get("/seller", getSellers);


/**
 * @swagger
 * /seller/{id}:
 *   get:
 *     summary: Get a seller by ID
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seller to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the seller by ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       404:
 *         description: Seller with the specified ID not found.
 */
router.get("/seller/:id", getOneSeller);

module.exports = router;
