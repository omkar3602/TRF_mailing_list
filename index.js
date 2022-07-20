const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.get('/', (req, res) => {
    res.render('index', { text: "World" });
});

const newslettersRouter = require('./routes/newsletters');
const subscribersRouter = require('./routes/subscribers');

app.use('/newsletters', newslettersRouter);
app.use('/subscribers', subscribersRouter);

app.listen(port, () => {
    console.log(`Serevr is running on port: ${port}`);
})