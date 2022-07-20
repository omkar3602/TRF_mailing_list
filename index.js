const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

global.__basedir = __dirname;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.set('view engine', 'ejs');


const fileUpload = require('express-fileupload');
app.use(fileUpload());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.get('/', (req, res) => {
    res.render('index');
});

const newslettersRouter = require('./routes/newsletters');
const subscribersRouter = require('./routes/subscribers');
const subscriptionsRouter = require('./routes/subscriptions');

app.use('/newsletters', newslettersRouter);
app.use('/subscribers', subscribersRouter);
app.use('/subscriptions', subscriptionsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})