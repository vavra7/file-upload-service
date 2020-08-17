import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDocs = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'File Upload Service',
      version: '1.0.0',
      description: 'Disk storage upload following the model of S3.'
    }
  },
  apis: ['./src/routes/**/*.ts']
});

export default [swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
