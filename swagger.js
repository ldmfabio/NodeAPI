const swaggerAutogen = require('swagger-autogen')();

const outputFile = 'swagger/swagger_output.json';

const endPointsFiles = ['index.js'];

swaggerAutogen(outputFile, endPointsFiles);