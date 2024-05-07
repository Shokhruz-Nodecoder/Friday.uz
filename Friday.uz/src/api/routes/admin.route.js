const { Router } = require("express");
const { register, login } = require("../controllers/admin.controller");
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: The admin managing API
 */
/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin's username
 *               password:
 *                 type: string
 *                 description: The admin's password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Successfully registered admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */
router.post("/admin/signup", register);

/**
 * @swagger
 * /admin/signin:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin's username
 *               password:
 *                 type: string
 *                 description: The admin's password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */
router.post("/admin/signin", login);

module.exports = router;