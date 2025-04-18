import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './authentication/JwtStrategy';
import env from './env';
import router from './routes';
import { logger } from './logger/logger';
import promClient from 'prom-client'

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

const app = express();

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  '*'
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    /* if (env.isDevelopment) {
      // Allow all origins in non-production environments
      return callback(null, true);
    }

    // Production CORS restrictions
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false); // Reject the request
    } */

    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api', router);
app.use("/", (req, res) => {
	res.send("pong");
});
app.use('/metrics', async (req, res)=>{
  res.setHeader('Content-Type', promClient.register.contentType);
  const metrics = await promClient.register.metrics()
  res.send(metrics);
  // console.log(metrics);
})

// Catch-all route for handling unknown endpoints
app.use((req, res) => {
  res.status(404).send({ message: 'API not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
