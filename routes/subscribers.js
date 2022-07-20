const express = require('express')
const router = require('express').Router();
let Subscriber = require('../models/subscriber.model')
router.use(express.urlencoded({
    extended: true
}))

router.route('/').get((req, res) => {
    Subscriber.find().then(subscribers => res.render('subscribers/subscribers', { subscribers: subscribers })).catch(err => res.status(400).json('Error: ' + err));

});

router.route('/add').get((req, res) => {
    res.render('subscribers/newsubscriber');
});

router.route('/add').post((req, res) => {
    const email = req.body.email;

    const newsubscriber = new Subscriber({ email });

    newsubscriber.save().then(() => res.redirect('/subscribers'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addfromfile').get((req, res) => {
    res.render('subscribers/importsubscribers');
});

router.route('/addfromfile').post((req, res) => {

    res.redirect('/subscribers');
});

router.route('/:id').get((req, res) => {
    Subscriber.findById(req.params.id).then(subscriber => res.render('subscribers/subscriber', { subscriber: subscriber })).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').post((req, res) => {
    Subscriber.findByIdAndDelete(req.params.id).then(subscriber => res.redirect("/subscribers")).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').get((req, res) => {
    Subscriber.findById(req.params.id).then(
        subscriber => res.render('subscribers/editsubscriber', { subscriber: subscriber })).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {
    Subscriber.findById(req.params.id).then(
        subscriber => {
            subscriber.email = req.body.email;

            subscriber.save().then(
                (subscriber) => res.redirect(`/subscribers/${subscriber._id}`)).catch(err => res.status(400).json('Error: ' + err));
        }).catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;