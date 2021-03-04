
const { Router } = require('express');
const { check } = require('express-validator');

const { getUser, postUser, putUser, deleteUser } = require('../controllers/users');
const { validateFields, isAdmin, haveRole, validateJWT } = require('../middlewares');
const { validateUserRole, validateUserEmail, existsUserById } = require('../helpers/db-validators');

const router = Router();

router.use( validateJWT );

router.get('/', getUser );

router.post('/', [
    check('name', 'Name is required').notEmpty(),
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

// router.patch('/', patchUser );

router.delete('/:id', [
    isAdmin,
    haveRole('ADMIN'),
    check('id', 'User ID is not valid').isMongoId().custom( existsUserById ),
],  deleteUser );

module.exports = router;