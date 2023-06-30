const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/routes.js']; // Modify the path to your route file(s)

const doc = {
  info: {
    title: 'Your API Name',
    description: 'API documentation using Swagger',
    version: '1.0.0',
  },
  host: 'localhost:3000', // Modify the host and port to match your server configuration
  basePath: '/',
  schemes: ['http'], // Modify the schemes based on your setup (e.g., 'http', 'https')
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app'); // Replace './app' with the path to your Express.js app entry file
});
