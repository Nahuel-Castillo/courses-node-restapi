
const { Router } = require('express');
const { check } = require('express-validator');
const { getCategories ,getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { existsCategoryByName, existsCategoryById } = require('../helpers/db-validators');
const { validateJWT, isAdmin } = require('../middlewares');

const { validateFields } = require('../middlewares/validate-field');

// {{url}}/api/categories
const router = Router();

//get all categories - public
router.get('/', getCategories );

//get category by id - public
router.get('/:id', [ 
    check('id', 'Id is required').notEmpty(),
    check('id', 'Id not valid format').isMongoId(),
    validateFields, 
    check('id').custom( existsCategoryById ), 
    validateFields, 
], getCategoryById );

router.use( validateJWT );

//Created category - only validate token
router.post('/', [ 
    check('name', 'name is required').notEmpty(),
    validateFields,
    check('name', 'Category already exists').not().custom( existsCategoryByName ),
    validateFields,
], addCategory );

//update category - only validate token
router.put('/:id', [ 
    check('id', 'Id is required').notEmpty(),
    check('id', 'Id not valid format').isMongoId(),
    validateFields,
    check('id').custom( existsCategoryById ),
    validateFields,
], updateCategory );

//delete category - Only ADMIN user
router.delete('/:id', [
    isAdmin,
    check('id', 'Id is required').notEmpty(),
    check('id', 'Id not valid format').isMongoId(),
    validateFields, 
    check('id').custom( existsCategoryById ),
    validateFields, 
], deleteCategory );

module.exports = router;