/**
 * @swagger
 * /users:
 *      get:
 *          summary: Get list of users
 *          tags:
 *              - Users
 *          description: Get list of users with optional query parameters
 *          parameters:
 *          - in: query
 *            name: username
 *            schema:
 *                type: string
 *            description: Find users which have the username matches the username
 *          - in: query
 *            name: name
 *            schema:
 *                type: string
 *            description: Find users which have the name matches the name
 *          - in: query
 *            name: date
 *            schema:
 *                type: string
 *                enum: [desc, asc]
 *                default: desc
 *            description: Sort the list of users by time created
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
 *          responses:
 *              200:
 *                  description: Return list of users.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          $ref: "#/components/schemas/user"
 *              500:
 *                  description: Internal server error
 * /users/{username}:
 *      get:
 *          summary: Get public informations of a user by username
 *          tags:
 *              - Users
 *          description: Get public informations of a user by username
 *          parameters:
 *          - in: path
 *            name: username
 *            schema:
 *                type: string
 *            description: Username to find a user
 *          responses:
 *              200:
 *                  description: Return public informations of a user.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/user"
 *              404:
 *                  description: User not found.
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
 *          summary: Update user informations
 *          tags:
 *              - Users
 *          description: Update user informations
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: "#/components/schemas/updateUserInformations"
 *          responses:
 *              200:
 *                  description: Update user information successfully
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
 *                                      example: userId
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
 *          summary: Delete a user
 *          tags:
 *              - Users
 *          description: Delete a user
 *          parameters:
 *          - in: header
 *            name: token
 *            schema: string
 *            description: Require authorized token of admin account to delete a user
 *          - in: path
 *            name: username
 *            schema:
 *              type: string
 *            description: Username to delete a user
 *          response:
 *              200:
 *                  description: Account deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Account deleted
 *                                  data:
 *                                      type: string
 *                                      example: userId
 *              403:
 *                  description: Unauthorized action
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/unauthorizedaction"
 *              500:
 *                  description: Internal server error
 * /users/profile:
 *      get:
 *          summary: Get private information of a user with authorization
 *          tags:
 *              - Users
 *          description: Get private information of a user with authorization
 *          parameters:
 *          - in: header
 *            name: token
 *            schema:
 *                type: string
 *            description: Require user token to access private informations
 *          responses:
 *              200:
 *                  description: Return private informations of a user.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/user"
 *              403:
 *                  description: Unauthorized action.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/unauthorizedaction"
 *              500:
 *                  description: Internal server error
 * /users/{username}/changepw:
 *      patch:
 *          summary: Change user password
 *          tags:
 *              - Users
 *          description: Change user password
 *          parameters:
 *          - in: header
 *            name: token
 *            schema:
 *                type: string
 *            description: Require user token to change user password
 *          responses:
 *              200:
 *                  description: User password changed.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Password changed
 *                                  data:
 *                                      type: string
 *                                      example: userId
 *              401:
 *                  description: Validation failed.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              #ref: "#/components/schemas/validationerror"
 *              403:
 *                  description: Unauthorized action.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/unauthorizedaction"
 *              500:
 *                  description: Internal server error
 */
