import swaggerJsdoc from 'swagger-jsdoc'

const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'POS API',
      version: '1.0.0',
      description: 'Soloware POS API for Point of Sales Application',
      contact: {
        name: 'Soloware',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:8080',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
