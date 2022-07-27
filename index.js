const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const toastr = require('express-toastr');

require('dotenv').config();

global.__basedir = __dirname;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(toastr());

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const Authenticate = require('./routes/middleware');
app.get('/', Authenticate, (req, res) => {
    res.render('index');
});

const newslettersRouter = require('./routes/newsletters');
const subscribersRouter = require('./routes/subscribers');
const subscriptionsRouter = require('./routes/subscriptions');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

app.use('/newsletters', newslettersRouter);
app.use('/subscribers', subscribersRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})