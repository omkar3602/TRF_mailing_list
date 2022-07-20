const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
    email: { type: String, required: true },
}, { timestamps: true, });

const Subscriber = new mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;