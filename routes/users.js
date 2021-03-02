
const { Router } = require('express');
const { getUser, postUser, putUser, patchUser, deleteUser } = require('../controllers/users');

const router = Router();

router.get('/', getUser );

router.post('/', postUser );

router.put('/:id', putUser );

router.patch('/', patchUser );

router.delete('/:id', deleteUser );

module.exports = router;