/**
 * @swagger
 * /products:
 *      get:
 *          summary: Get list of products
 *          tags:
 *              - Products
 *          description: Get list of products with optional query parameters
 *          parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            description: If a user session is presented, mark the products which the user has liked.
 *          - in: query
 *            name: name
 *            schema:
 *                type: string
 *            description: Find products which have the name matches the name parameter
 *          - in: query
 *            name: price
 *            schema:
 *                type: string
 *                enum: [desc, asc]
 *            description: Sort the list of products by price
 *          - in: query
 *            name: minPrice
 *            schema:
 *                type: number
 *            description: Filtering the list of products to find the products with price greater than *minPrice*
 *          - in: query
 *            name: maxPrice
 *            schema:
 *                type: number
 *            description: Filtering the list of products to find the products with price less than *maxPrice*
 *          - in: query
 *            name: date
 *            schema:
 *                type: string
 *                enum: [desc, asc]
 *                default: desc
 *            description: Sort the list of products by time created
 *          - in: query
 *            name: rating
 *            schema:
 *                type: string
 *                enum: [desc, asc]
 *                default: desc
 *            description: Sort the list of products by number of ratings
 *          - in: query
 *            name: limit
 *            schema:
 *                type: string
 *                default: 20
 *            description: Limit the number of users returned
 *          - in: query
 *            name: page
 *            schema:
 *                type: string
 *                default: 1
 *            description: To defined the number of items are skipped to return
 *          - in: query
 *            name: status
 *            schema:
 *                type: string
 *                enum: [invisible, visible]
 *                default: desc
 *            description: Filtering the list of products by status
 *          responses:
 *              200:
 *                  description: Return list of products.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          $ref: "#/components/schemas/product"
 *              500:
 *                  description: Internal server error
 *      post:
 *          summary: Create a product
 *          tags:
 *              - Products
 *          descriptions: Create a product
 *          parameters:
 *              - in: header
 *                name: token
 *                schema:
 *                  type: string
 *                description: Require user session with admin role to create product
 *          requestBody:
 *              require: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/product"
 *              200:
 *                  description: Product created.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Product created
 *                                  data:
 *                                      type: string
 *                                      example: productId
 *              401:
 *                  description: Validation error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schema/validationerror"
 *              403:
 *                  description: Unauthorized action.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schema/unauthorizedaction"
 *              500:
 *                  description: Internal server error
 * /products/{slug}:
 *      get:
 *          summary: Get public informations of a product by slug
 *          tags:
 *              - Products
 *          description: Get public informations of a product by slug
 *          parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            description: If a user session is presented, mark the products which user liked.
 *          - in: path
 *            name: slug
 *            schema:
 *                type: string
 *            description: Slug string to find a product
 *          responses:
 *              200:
 *                  description: Return public informations of a product.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/product"
 *              404:
 *                  description: Product not found.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      example: User not found
 *              500:
 *                  description: Internal server error
 *      put:
 *          summary: Update product detail
 *          tags:
 *              - Products
 *          description: Update product detail
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/updateProductDetail"
 *          responses:
 *              200:
 *                  description: Update product detail successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Updated
 *                                  data:
 *                                      type: string
 *                                      example: productId
 *              401:
 *                  description: Validaton error
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/validationerror"
 *              403:
 *                  description: Unauthorized action
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/unauthorizedaction"
 *              500:
 *                  description: Internal server error
 *      delete:
 *          summary: Delete a product
 *          tags:
 *              - Products
 *          description: Delete a product
 *          parameters:
 *          - in: header
 *            name: token
 *            schema: string
 *            description: Require authorized token of admin account to delete a product
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            description: Slug string of the product to delete
 *          response:
 *              200:
 *                  description: Product deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Product deleted
 *                                  data:
 *                                      type: string
 *                                      example: productId
 *              403:
 *                  description: Unauthorized action
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/unauthorizedaction"
 *              500:
 *                  description: Internal server error
 * /products/{slug}/like:
 *      patch:
 *          summary: Like a product
 *          tags:
 *              - Products
 *          description: Like a product with the given slug
 *          parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            description: Slug string of the product
 *          - in: header
 *            name: token
 *            schema:
 *              type: string
 *            description: Require user session
 *          responses:
 *              200:
 *                  description: Product liked successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Liked
 *                                  data:
 *                                      type: string
 *                                      example: productId
 * /products/{slug}/promotion:
 *      patch:
 *          summary: Add the promotion to the product
 *          tags:
 *              - Products
 *          description: Add the promotion to the product with the given slug and promotionId
 *          requestBody:
 *              require: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            promotionId:
 *                              type: string
 *          parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            description: Slug string of the product
 *          - in: header
 *            name: token
 *            schema:
 *              type: string
 *            description: Require user session with admin role
 *          responses:
 *              200:
 *                  description: Adding promotion to the product successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Product updated
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          product:
 *                                              type: string
 *                                              example: productId
 *                                          promotion:
 *                                              type: string
 *                                              example: promotionId
 */
