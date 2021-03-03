
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-field');

const router = Router();

router.post('/login', [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
] , login );

router.post( '/google', [
    check('id_token', 'Id token is required').not().isEmpty(),
    validateFields
], googleSignin );


module.exports = router;