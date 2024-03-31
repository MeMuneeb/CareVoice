const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const userRouter = require('./routes/userRoutes');
const visitRouter = require('./routes/visitRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const surveyRouter = require('./routes/surveyRoutes');
const responseRouter = require('./routes/responseRoutes');
const app = express();

// Middlewares
app.use(helmet());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
  app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
} else {
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour',
  });
  app.use('/api', limiter);
}
app.use(compression());
app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/visits', visitRouter);
app.use('/api/v1/surveys', surveyRouter);
app.use('/api/v1/responses', responseRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
