require('dotenv').config();
require('express-async-errors');
const express=require('express')
const cors=require('cors');
const app=express();
//db
const connectDB = require('./db/connect');

const productRouter = require('./routes/productRoutes.js');
//error
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use('/api', productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
