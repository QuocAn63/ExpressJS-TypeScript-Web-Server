/**
 * @swagger
 * /auth/login:
 *      post:
 *          summary: Login to server
 *          tags:
 *              - Authentication
 *          description: Login with username and password
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  example: caoquocan
 *                              password:
 *                                  type: string
 *                                  example: 123123
 *          responses:
 *              200:
 *                  description: Authenticate success.
 *                  headers:
 *                      token:
 *                          schema:
 *                              type: string
 *                              description: User token to request server resources with authorized
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          accessToken:
 *                                               type: string
 *                                               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                                          refreshToken:
 *                                               type: string
 *                                               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *              401:
 *                  description: Authenticate failed.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/validationerror"
 *              403:
 *                  description: User can not access because the account has been disactived
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/userdisactived"
 *              500:
 *                  description: Internal server error
 * /auth/register:
 *      post:
 *          summary: Register to server
 *          tags:
 *              - Authentication
 *          description: Register with username, password
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  example: caoquocan
 *                              password:
 *                                  type: string
 *                                  example: 123123
 *                              passwordconfirm:
 *                                  type: string
 *                                  example: 123123
 *          responses:
 *              200:
 *                  description: Registering success.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: string
 *                                      example: 1234567890
 *              401:
 *                  description: Authenticate failed.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/validationerror"
 *              500:
 *                  description: Internal server error
 * /auth/logout:
 *      post:
 *          summary: Logout from server
 *          tags:
 *              - Authentication
 *          description: Logout and remove user session
 *          responses:
 *              200:
 *                  description: Logout success.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Logout success
 *              500:
 *                  description: Internal server error
 * /login/github:
 *      get:
 *          summary: OAuth2 with Github
 *          tags:
 *              - Authentication
 *              - OAuth2
 *          description: OAuth2 authorization to login
 *          security:
 *              - githubOAuth2: [read]
 *          callbacks:
 *              getToken:
 *                  /github/callback:
 *                     get:
 *                         summary: Callback URI to get token from Github
 *                         tags:
 *                             - Authentication
 *                             - OAuth2
 *                         description: Callback URI to get token from Github
 *                         security:
 *                             - githubOAuth2: [read]
 * /login/google:
 *      get:
 *          summary: OAuth2 with Google
 *          tags:
 *              - Authentication
 *              - OAuth2
 *          description: OAuth2 authorization to login
 *          security:
 *              - googleOAuth2: [read]
 *          callbacks:
 *              getToken:
 *                  /google/callback:
 *                       get:
 *                           summary: Callback URI to get token from Google
 *                           tags:
 *                               - Authentication
 *                               - OAuth2
 *                           description: Callback URI to get token from Google
 *                           security:
 *                               - googleOAuth2: [read]
 * /token:
 *      get:
 *          summary: URL to refresh user session
 *          tags:
 *              - Authentication
 *          description: Get refreshToken from request body, checking the validation of refreshToken then return new accessToken for user
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *          responses:
 *              200:
 *                  description: Token refreshed.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: Token refreshed
 *                                  data:
 *                                      type: string
 *                                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *              401:
 *                  description: User not provide the token or the token is invalid.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      field:
 *                                          type: string
 *                                          example: token
 *                                      message:
 *                                          type: string
 *                                          example: There is no token provided
 *              403:
 *                  description: User can not access because the account has been disactived
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/userdisactived"
 *              500:
 *                  description: Internal server error

 */
