require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db/connectDB');
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
const customerRouter = require('./routers/customerRouter');
const orderRouter = require('./routers/orderRouter');
const paymentRouter = require('./routers/paymentRouter');
const messageRouter = require('./routers/messageRouter');
const salesRouter = require('./routers/salesRouter');
const dashboardRouter = require('./routers/dashboardRouter');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/customers', customerRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/messages', messageRouter);
app.use('/api/sales', salesRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

start();