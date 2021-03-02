const Role = require('../models/role');
const User = require('../models/user');

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

module.exports = {
    validateUserRole,
    validateUserEmail,
    existsUserById
}