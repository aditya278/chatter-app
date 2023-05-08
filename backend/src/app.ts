import express, { Application, Request, Response, NextFunction } from 'express';
import userRouter from './routes/user.routes';
import { notFound, errorMiddleware } from './middlewares/error.middleware';
import connectDB from './config/db';
import cors from 'cors';

connectDB();
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);

app.use(notFound);

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: 'API is running'});
});

// Make sure to keep it at the last
app.use(errorMiddleware);

export default app;