const express = require('express')
const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/admin.model')
router.use(express.urlencoded({
    extended: true
}))


router.route('/').post(async (req, res) => {
    res.clearCookie('jwtoken', { path: '/'});
    res.redirect('/login');
});

module.exports = router;
