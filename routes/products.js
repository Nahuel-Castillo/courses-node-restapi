

const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts , getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existsProductByName, existsProductById, existsCategoryById } = require('../helpers/db-validators');
const { validateJWT, isAdmin, validateFields } = require('../middlewares');

// {{url}}/api/products
const router = Router();

//get all products - public
router.get('/', getProducts );

//get products by id - public
router.get('/:id', [ 
    check('id', 'Id is required').notEmpty(),
    check('id', 'Id not valid format').isMongoId(),
    validateFields, 
    check('id').custom( existsProductById ), 
    validateFields, 
], getProductById );

router.use( validateJWT );

//Created products - only validate token
router.post('/', [ 
    check('name', 'name is required').notEmpty(),
    check('category', 'category is required').notEmpty(),
    check('category', 'category not valid').isMongoId(),
    validateFields,
    check('name', 'Product already exists').not().custom( existsProductByName ),
    check('category').custom( existsCategoryById ),
    validateFields,
], addProduct );

//update products - only validate token
router.put('/:id', [ 
    check('id', 'Id is required').notEmpty(),
    check('id', 'Id not valid format').isMongoId(),
    validateFields,
    check('id').custom( existsProductById ),
    validateFields,
], updateProduct );

//delete products - Only ADMIN user
router.delete('/:id', [
    isAdmin,
    check('id', 'Id is required').notEmpty(),
    check('id', 'Id not valid format').isMongoId(),
    validateFields, 
    check('id').custom( existsProductById ),
    validateFields, 
], deleteProduct );

module.exports = router;