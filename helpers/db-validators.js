const { Category, Role, User, Product } = require('../models');

const validateUserRole = async ( role = '' ) => { 
    const roleExist = await Role.findOne( { role } );

    if ( !roleExist ) {
        throw new Error( `Role: ${ role } not registered` );
    }
}

const validateUserEmail = async( email = '') => {
    const emailExits = await User.findOne( { email } );
        
    if ( emailExits ) {
        throw new Error( 'Email is already registered');
    }
}

const existsUserById = async( id = '' ) => {

    const userExits = await User.findById( id );

    if ( !userExits ) {
        throw new Error( 'User not register with that ID');
    }
}

const existsCategoryById = async( id = '' ) => {

    const existsCategory = await Category.findById( id );
    
    if ( !existsCategory ) {
        throw new Error( 'Category not exists' );
    }
}

const existsCategoryByName = async( name = '' ) => {

    name = name.toUpperCase();

    const existsCategory = await Category.findOne( { name, state: true } );

    if ( !existsCategory ) {
        throw new Error( `Category ${ name } not exists` );
    }

}

const existsProductById = async( id = '' ) => {

    const existsProduct = await Product.findById( id );
    
    if ( !existsProduct ) {
        throw new Error( 'Product not exists' );
    }
}

const existsProductByName = async( name = '' ) => {

    name = name.toUpperCase();

    const existsProduct = await Product.findOne( { name, state: true } );

    if ( !existsProduct ) {
        throw new Error( `Product ${ name } not exists` );
    }

}

module.exports = {
    validateUserRole,
    validateUserEmail,
    existsUserById,
    existsCategoryById,
    existsCategoryByName,
    existsProductById,
    existsProductByName,
}