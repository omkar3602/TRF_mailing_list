const express = require('express')
const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/admin.model')
router.use(express.urlencoded({
    extended: true
}))


router.route('/').post(async (req, res) => {
    res.cookie("jwtoken", "", { maxAge: 1 });
    res.redirect('/login');
});

module.exports = router;