const express = require('express')
const router = require('express').Router();
let Newsletter = require('../models/newsletter.model')
const Authenticate = require('./middleware');
let send_Mail = require('../utils/email_sender')
let custom_send_Mail = require('../utils/custom_email_sender')
let Subscriber = require('../models/subscriber.model')
const fs = require('fs');
const xlsx = require('xlsx');
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

router.route('/addfromfile').get(Authenticate, (req, res) => {
    res.render('newsletters/importnewsletter');
});

router.route('/addfromfile').post(Authenticate, (req, res) => {
    if (req.files)
        newsletterFile = req.files.newsletter;
    else
        return res.status(400).json('No file uploaded');

    uploadPath = __basedir + '/uploads/' + newsletterFile.name;
    newsletterFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        else {
            const subject = req.body.subject;
            fs.readFile(uploadPath, "utf-8", function (err, content) {
                if (err)
                    throw err;
                else {
                    try {
                        fs.unlinkSync(uploadPath);
                    }
                    catch (err) {
                        res.status(400).json('Error: ' + err)
                    };

                    const newnewsletter = new Newsletter({ subject, content });

                    newnewsletter.save().then(() => res.redirect('/newsletters'))
                        .catch(err => res.status(400).json('Error: ' + err));
                }
            });

        }
    });
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

// JS format string (utility function)
String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if the related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};


router.route('/custom_sendtoall').post(Authenticate, (req, res) => {
    const subject = req.body.subject;
    const content = req.body.content;
    var email_subject;
    var email_content;
    var first_name;
    var last_name;
    var email;

    if (req.files)
        emailsFile = req.files.custom_data;
    else
        return res.status(400).json('No file uploaded');

    uploadPath = __basedir + '/uploads/' + emailsFile.name;

    emailsFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        else {
            workbook = xlsx.readFile(uploadPath);
            worksheet = workbook.Sheets[workbook.SheetNames[0]];

            for (let cell in worksheet) {
                const cellAsString = cell.toString();
                if (cellAsString[0] === 'A') {
                    first_name = worksheet[cell].v;
                }
                else if (cellAsString[0] === 'B') {
                    last_name = worksheet[cell].v;
                }
                else if (cellAsString[0] === 'C') {
                    email = worksheet[cell].v;
                    // console.log(first_name + " " + last_name + " " + email);
                    // console.log(subject);

                    email_subject = subject.format(first_name);
                    email_content = content.format(first_name, last_name);

                    // console.log(email_content);
                    custom_send_Mail(email, email_subject, email_content);
                }
            }

            try {
                fs.unlinkSync(uploadPath);
                res.redirect('/');

            }
            catch (err) {
                res.status(400).json('Error: ' + err)
            };
        }
    });


});

module.exports = router;