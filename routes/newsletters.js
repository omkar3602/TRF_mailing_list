const express = require('express')
const router = require('express').Router();
let Newsletter = require('../models/newsletter.model')
const Authenticate = require('./middleware');
router.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))

router.route('/').get(Authenticate, (req, res) => {
    Newsletter.find().then(newsletters => res.render('newsletters/newsletters', { newsletters: newsletters })).catch(err => res.status(400).json('Error: ' + err));

});

router.route('/add').get(Authenticate, (req, res) => {
    res.render('newsletters/newnewsletter');
});

router.route('/add').post(Authenticate, (req, res) => {
    const subject = req.body.subject;
    const content = req.body.content;

    const newnewsletter = new Newsletter({ subject, content });

    newnewsletter.save().then(() => res.redirect('/newsletters'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get(Authenticate, (req, res) => {
    Newsletter.findById(req.params.id).then(newsletter => res.render('newsletters/newsletter', { newsletter: newsletter })).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').post(Authenticate, (req, res) => {
    Newsletter.findByIdAndDelete(req.params.id).then(newsletter => res.redirect("/newsletters")).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').get(Authenticate, (req, res) => {
    Newsletter.findById(req.params.id).then(
        newsletter => res.render('newsletters/editnewsletter', { newsletter: newsletter })).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post(Authenticate, (req, res) => {
    Newsletter.findById(req.params.id).then(
        newsletter => {
            newsletter.subject = req.body.subject;
            newsletter.content = req.body.content;

            newsletter.save().then(
                (newsletter) => res.redirect(`/newsletters/${newsletter._id}`)).catch(err => res.status(400).json('Error: ' + err));
        }).catch(err => res.status(400).json('Error: ' + err));
});

let send_Mail = require('../utils/email_sender')
let Subscriber = require('../models/subscriber.model')

router.route('/send').post(Authenticate, (req, res) => {
    const email = req.body.email;
    const _id = req.body._id;

    Newsletter.findById(_id).then(newsletter => {
        send_Mail(null, newsletter.subject, newsletter.content, email);
        res.redirect(`/newsletters/${newsletter._id}`);
    }).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/sendtoall').post(Authenticate, (req, res) => {
    const _id = req.body._id;

    Newsletter.findById(_id).then(newsletter => Subscriber.find().distinct('email').then(subscribers => {

        send_Mail(subscribers, newsletter.subject, newsletter.content);
        res.redirect(`/newsletters/${newsletter._id}`);
    }).catch(err => res.status(400).json('Error: ' + err))).catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;