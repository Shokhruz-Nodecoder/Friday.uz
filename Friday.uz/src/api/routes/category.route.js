const { Router } = require("express");
const {
  getCategory,
  getOne,
  categoryCreate,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { searchCategory } = require("../controllers/search.controller");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The category managing API
 */

/**
 * @swagger
 * /search/category:
 *   get:
 *     summary: Search categories by name
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the category to search for
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       // Define properties of the returned data here
 */
router.get("/search/category", searchCategory);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       // Define properties of the returned data here
 */
router.get("/category", getCategory);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                 data:
 *                   type: object
 *                   properties:
 *                     // Define properties of the returned data here
 *       404:
 *         description: Category not found
 */
router.get("/category/:id", getOne);

/**
 * @swagger
 * /admin/category:
 *   post:
 *     summary: Create a new category (admin)
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define properties of the request body here
 *     responses:
 *       201:
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                 data:
 *                   type: object
 *                   properties:
 *                     // Define properties of the returned data here
 *       401:
 *         description: Unauthorized, admin access required
 */
router.post("/admin/category", isAdmin, categoryCreate);

/**
 * @swagger
 * /admin/category/{id}:
 *   put:
 *     summary: Update a category by ID (admin)
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define properties of the request body here
 *     responses:
 *       200:
 *         description: Category successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                 data:
 *                   type: object
 *                   properties:
 *                     // Define properties of the returned data here
 *       401:
 *         description: Unauthorized, admin access required
 *       404:
 *         description: Category not found
 */
router.put("/admin/category/:id", isAdmin, updateCategory);

/**
 * @swagger
 * /admin/category/{id}:
 *   delete:
 *     summary: Delete a category by ID (admin)
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category successfully deleted
 *       401:
 *         description: Unauthorized, admin access required
 *       404:
 *         description: Category not found
 */
router.delete("/admin/category/:id", isAdmin, deleteCategory);

module.exports = router;