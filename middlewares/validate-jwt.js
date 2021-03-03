const { verify } = require('jsonwebtoken');
const { request, response } = require('express');

const User = require('../models/user');
const { use } = require('../routes/auth');

const validateJWT = async( req = request, res = response, next ) => {
    
    
    const token  = req.header('x-token');

    if ( !token ) {
        return res.status( 401 ).json( { msg: 'Token is not valid - Token is not in request'} );
    }

    try {
    
        const { uid } = verify( token, process.env.SECRET_OR_PRIVATE_KEY );

        user = await User.findById( uid );

        if ( !user ) {
            res.status( 401 ).json({ msg: 'Token is not valid - User not exists in DB' });
        }

        if ( !user.state ) {
            return res.status(401).json({ msg: 'Token is not valid - User not active' });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json( { msg:'Token is not valid' } );
    }    
}

module.exports = {
    validateJWT
}