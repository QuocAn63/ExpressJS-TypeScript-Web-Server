/**
 * @swagger
 * /promotions:
 *      get:
 *          summary: Get list of promotions
 *          tags:
 *              - Promotions
 *          description: Get list of promotions with optional query parameters
 *          parameters:
 *          - in: query
 *            name: date
 *            schema:
 *                type: string
 *                enum: ["desc", "asc"]
 *            description: Sort the list of promotions by created time
 *          - in: query
 *            name: type
 *            schema:
 *                type: string
 *                enum: ["percentage", "amount"]
 *            description: Filtering the list of promotions to get the promotions match the type
 *          - in: query
 *            name: percentage
 *            schema:
 *                type: string
 *                enum: [desc, asc]
 *            description: Sort the list of promotions which has percentage field by value
 *          - in: query
 *            name: amount
 *            schema:
 *                type: string
 *                enum: [desc, asc]
 *            description: Sort the list of promotions which has amount field by value
 *          - in: query
 *            name: limit
 *            schema:
 *                type: string
 *                default: 20
 *            description: Limit the number of promotions returned
 *          - in: query
 *            name: page
 *            schema:
 *                type: string
 *                default: 1
 *            description: To defined the number of items are skipped to return
 *          - in: query
 *            name: expired
 *            schema:
 *                type: boolean
 *            description: Filtering the list of promotions to get the expired promotions
 *          responses:
 *              200:
 *                  description: Return list of promotions.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          $ref: "#/components/schemas/promotion"
 *              500:
 *                  description: Internal server error
 * /promotions/{promotionId}:
 *      get:
 *          summary: Get public informations of a promotion by promotionId
 *          tags:
 *              - Promotions
 *          description: Get public informations of a promotion by promotionId
 *          parameters:
 *          - in: path
 *            name: promotionId
 *            schema:
 *                type: string
 *            description: promotionId to find a promotion
 *          responses:
 *              200:
 *                  description: Return public informations of a promotion.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/promotion"
 *              404:
 *                  description: promotion not found.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      example: promotion not found
 *              500:
 *                  description: Internal server error
 */
