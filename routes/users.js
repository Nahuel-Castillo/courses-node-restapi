
const { Router } = require('express');
const { check } = require('express-validator');

const { getUser, postUser, putUser, patchUser, deleteUser } = require('../controllers/users');
const { validateFields } = require('../middlewares/validateField');
const { validateUserRole, validateUserEmail, existsUserById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getUser );

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is not valid').isEmail().custom( validateUserEmail ),
    check('password', 'Password is required and have more than 6 letters').isLength({ min: 6 }),
    // check('role', 'Role is not valid').isIn( [ 'USER', 'ADMIN' ] ),
    check('role').custom( validateUserRole ), 
    validateFields
], postUser );

router.put('/:id', [
    check('id', 'User ID is not valid').isMongoId().custom( existsUserById ),
    check('role').custom( validateUserRole ), 
    validateFields
], putUser );

router.patch('/', patchUser );

router.delete('/:id', [
    check('id', 'User ID is not valid').isMongoId().custom( existsUserById ),
],  deleteUser );

module.exports = router;