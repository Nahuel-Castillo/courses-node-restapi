
const { Router } = require('express');
const { check } = require('express-validator');
const { loadFiles, getImage, updateImageCloudinary } = require('../controllers');
const { validateJWT, validateFields, existsFile } = require('../middlewares');
const { validCollections } = require('../helpers');

const router = Router();

router.get('/:collection/:id',[
    check('id', 'Id format no valid').isMongoId(),
    check('collection').custom( c => validCollections( c, ['users', 'products']) ),
    validateFields,
], getImage );

router.use( validateJWT );

router.use( existsFile );

// router.post('/', loadFiles );

router.put('/:collection/:id', [
    check('id', 'Id format no valid').isMongoId(),
    check('collection').custom( c => validCollections( c, ['users', 'products']) ),
    validateFields,
], updateImageCloudinary );


module.exports = router;