/**
 * @swagger
 * components:
 *  securitySchemes:
 *      BasicAuth:
 *        type: http
 *        scheme: basic
 *      BearerAuth:
 *        type: http
 *        scheme: bearer
 *      cookieAuth:
 *        type: apiKey
 *        in: header
 *        name: token
 *      OpenID:
 *        type: openIdConnect
 *        openIdConnectUrl: https://example.com/.well-known/openid-configuration
 *      githubOAuth2:
 *        type: oauth2
 *        flows:
 *          authorizationCode:
 *            authorizationUrl: /api/auth/login/github
 *            tokenUrl: https://github.com/login/oauth/access_token
 *            scopes:
 *              read: Grants read access
 *      googleOAuth2:
 *        type: oauth2
 *        flows:
 *          authorizationCode:
 *            authorizationUrl: /api/auth/login/github
 *            tokenUrl: /api/auth/google/callback
 *            scopes:
 *              read: Grants read access
 *  schemas:
 *      unauthorizedaction:
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *                  example: Unauthorized action
 *      userdisactived:
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *                  example: Access denied
 *      validationerror:
 *          type: array
 *          items:
 *              type: object
 *              properties:
 *                  field:
 *                      type: string
 *                      example: password
 *                  message:
 *                      type: string
 *                      example: password incorrect
 *      user:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  example: caoquocan
 *              isActived:
 *                  type: boolean
 *                  example: true
 *              name:
 *                  type: string
 *                  example: Cao Quoc An
 *              avatar:
 *                  type: string
 *                  example: /uploads/avatar/default.png
 *      updateUserInformations:
 *          type: object
 *          properties:
 *              dob:
 *                  type: string
 *                  example: 2002/03/06
 *              address:
 *                  type: string
 *                  example: Ho Chi Minh city
 *              gender:
 *                  type: string
 *                  enum: [male, female]
 *              name:
 *                  type: string
 *                  example: Cao Quoc An
 *              roles:
 *                  type: array
 *                  items:
 *                      type: string
 *                      enum:
 *                          - user
 *                          - admin
 *              status:
 *                  type: boolean
 *              phonenumber:
 *                  type: string
 *                  example: 0901231231
 *              avatar:
 *                  type: string
 *                  format: binary
 *      product:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example: Example Product Name
 *              slug:
 *                  type: string
 *                  example: example_product_name
 *              theme:
 *                  type: string
 *                  example: /uploads/avatar/default.png
 *              images:
 *                  type: array
 *                  items:
 *                      - /uploads/avatar/default1.png
 *                      - /uploads/avatar/default2.png
 *                      - /uploads/avatar/default3.png
 *              price:
 *                  type: number
 *                  example: 10000
 *              stocks:
 *                  type: number
 *                  example: 10000
 *              solds:
 *                  type: number
 *                  example: 10000
 *              promotion:
 *                  type: string
 *                  example: promotionId
 *              ratingCounts:
 *                  type: number
 *                  example: 0
 *              isLiked:
 *                  type: boolean
 *                  example: true
 *              comments:
 *                  type: array
 *      updateProductDetail:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example: Example Product Name
 *              theme:
 *                  type: string
 *                  example: /uploads/avatar/default.png
 *              images:
 *                  type: array
 *                  items:
 *                      - /uploads/avatar/default1.png
 *                      - /uploads/avatar/default2.png
 *                      - /uploads/avatar/default3.png
 *              price:
 *                  type: number
 *                  example: 10000
 *              stocks:
 *                  type: number
 *                  example: 10000
 *              ratingCounts:
 *                  type: number
 *                  example: 0
 *      promotion:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *                  example: Promotion 1
 *              description:
 *                  type: string
 *                  example: Promotion 1 description
 *              percentage:
 *                  type: number
 *                  example: 30
 *              expiredIn:
 *                  type: date
 *                  example: 2023.07.20T00:00:00
 *  security:
 *    - cookieAuth:: []
 *    - githubOAuth2:
 *        - read
 */
