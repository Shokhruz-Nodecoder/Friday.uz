const { Router } = require("express");
const { create, getAllproducts, getOne, updatedProduct, deleteProduct,  } = require("../controllers/product.controller");
const isSeller = require("../middlewares/isSeller.middleware");
const { searchProduct, paginateProduct } = require("../controllers/search.controller");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The product managing API
 */



/**
 * @swagger
 * /product/{id}:
 *   post:
 *     summary: Create a new product (seller)
 *     tags: [Products]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               info:
 *                 type: string
 *                 description: Additional information about the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *               brand:
 *                 type: string
 *                 description: The brand of the product.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the product.
 *     responses:
 *       200:
 *         description: Product successfully created
 *       400:
 *         description: Bad request. Check the request parameters and data format.
 *       401:
 *         description: Unauthorized, seller access required
 */

router.post("/product/:id", isSeller, create);

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *       401:
 *         description: Unauthorized
 */

router.get("/product", getAllproducts);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *       404:
 *         description: Product not found
 */
router.get("/product/:id", getOne)

/**
 * @swagger
 * /product/{id}/{pro_id}:
 *   put:
 *     summary: Update a product by ID (seller)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: path
 *         name: pro_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the product.
 *               info:
 *                 type: string
 *                 description: The updated additional information about the product.
 *               price:
 *                 type: number
 *                 description: The updated price of the product.
 *               brand:
 *                 type: string
 *                 description: The updated brand of the product.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated image of the product.
 *     responses:
 *       200:
 *         description: Product successfully updated
 *       400:
 *         description: Bad request. Check the request parameters and data format.
 *       401:
 *         description: Unauthorized, seller access required
 *       404:
 *         description: Product not found
 */

router.put("/product/:id/:pro_id", isSeller, updatedProduct)

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID (seller)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product successfully deleted
 *       401:
 *         description: Unauthorized, seller access required
 *       404:
 *         description: Product not found
 */
router.delete("/product/:id", isSeller, deleteProduct)




/**
 * @swagger
 * tags:
 *   name: Search
 *   description: The search managing API
 */


/**
 * @swagger
 * /search/product:
 *   get:
 *     summary: Search products by name
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the product to search for
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *       401:
 *         description: Unauthorized
 */

router.get("/search/product", searchProduct);


/**
 * @swagger
 * tags:
 *   name: Pagination
 *   description: The pagination managing API
 */



/**
 * @swagger
 * /pagination/product:
 *   get:
 *     summary: Paginate through products
 *     tags: [Pagination]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of products to return per page (default is 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated products
 *       400:
 *         description: Bad request. Check the query parameters.
 *       401:
 *         description: Unauthorized
 */

router.get("/pagination/product", paginateProduct);

module.exports = router;