require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = require('./routes/index');
// const expressListEndpoints = require('express-list-endpoints');

// const { forgotPasswordJob } = require('./utils/cron');

// Konfigurasi CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081', 'http://ag40o08cgg4ksookcoc84wko.195.110.58.17.sslip.io', 'https://www.iom-itb.id', 'https://iom-admin.vercel.app', 'https://admin.iom-itb.id'], // Daftar domain yang diizinkan
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Metode HTTP yang diizinkan
  credentials: true // Jika kamu ingin mengirim cookies atau kredensial lainnya
};

const app = express();

const swaggerOption = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API IOM',
      version: '1.0.0',
      description: 'Description of API IOM',
    },
    server: [
      {
        uri: process.env.BASE_URL,
      },
    ],
  },
  apis: ['./src/routes/swagger/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOption);
app.use(
  '/api',
  swaggerUi.serveFiles(swaggerSpec),
  swaggerUi.setup(swaggerSpec),
);

app.use(morgan('dev'));
// app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

const path = require('path');
app.use('/', express.static(path.join(__dirname, '')), (req, res, next) => {
  console.log(`Serving static file: ${req.path}`);
  next();
});

app.use(router);


app.get('/', (req, res) => {
  res.json({
    message: 'SELAMAT DATANG DI API IOM',
  });
});

// forgotPasswordJob.start();

app.use(router);

// const endpoints = expressListEndpoints(app);
// console.log(endpoints);

module.exports = app;
