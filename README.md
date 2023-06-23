# Web Server Project with ExpressJS, TypeScript

## Features

- Basic Authentication with username, password
- Authenticating with Google, Github OAuth2
- Authorization with user token
- Basic CRUD and file uploading
- Validating request body

## Installation

```bash
    # Start development server
    npm run start

    # Build
    npm run build

    # Run the build server
    node ./dist
```

## API Documentation

The default port for the server is 3001, access **/docs** to view the API documentation.

## Packages using

- ServerSide: [ExpressJS](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/)
- NoSQL Database Mongodb: [moongose](https://mongoosejs.com/)
- Google OAuth2 authorization: [googleapis](https://www.npmjs.com/package/googleapis)
- Request body validator: [express-validator](https://express-validator.github.io/docs)
- API Documentation: [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express), [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)