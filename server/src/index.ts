import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import profileRouter from './routes/profiles';
import paymentRouter from './routes/payments';
import userRouter from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/users', userRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
