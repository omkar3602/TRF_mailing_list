const express = require('express')
const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/admin.model')
router.use(express.urlencoded({
    extended: true
}))

router.route('/').get((req, res) => {
    res.render('admin/login')
});

// router.route('/').post(async (req, res) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const pass = req.body.password;

//     const userExist = await User.findOne({ email: email })
//     if (userExist) {
//         return res.status(400).json({ error: "User already exists" });
//     }
//     else {
//         const user = new User({ name, email, pass });
//         user.save().then(() => res.status(200).json("registered successfully"))
//             .catch(err => res.status(400).json('Error: ' + err));
//     }
// });

router.route('/').post(async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    try {
        let token;
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(pass, userLogin.pass);
            token = await userLogin.generateAuthToken();
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 3000000),
                httpOnly: true
            });
            if (!isMatch) {
                res.status(400).json({ error: "user login unsuccessful" });
            } else {
                res.status(200).redirect('/');
            }
        } else {
            res.status(400).json({ error: "user login unsuccessful" });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;