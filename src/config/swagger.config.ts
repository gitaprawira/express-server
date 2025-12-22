import swaggerJsdoc from 'swagger-jsdoc'

/**
 * Swagger options for API documentation
 */
const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'express-api API Documentation',
      version: '1.0.0',
      description: 'API documentation for the express-api application',
      contact: {
        name: 'github.com/gitaprawira',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
