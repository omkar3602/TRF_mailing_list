const express = require('express')
const router = require('express').Router();
let Subscriber = require('../models/subscriber.model')
router.use(express.urlencoded({
    extended: true
}))

router.route('/').get((req, res) => {
    res.redirect('/subscriptions/subscribe')
});

router.route('/subscribe').get((req, res) => {
    res.render('subscriptions/subscribe');
});

router.route('/subscribe').post((req, res) => {
    const email = req.body.email;

    const newsubscriber = new Subscriber({ email });

    newsubscriber.save().then(() => res.redirect('/subscriptions/subscribe'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/unsubscribe').get((req, res) => {
    res.render('subscriptions/unsubscribe');
});

router.route('/unsubscribe').post((req, res) => {
    Subscriber.deleteOne({ email: req.body.email }).then(() => res.redirect("/subscriptions/unsubscribe")).catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;