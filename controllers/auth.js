
const {  request, response } = require('express');
const User = require('../models/user');
const { compare } = require('../helpers/bcrypt');
const { generateJWT } = require('../helpers/jwt');

const login = async( req = request, res = response ) => {

    try {
        const { email, password } = req.body;

        //validate email exits
        const user = await User.findOne( { email } );

        if ( !user ) {
            return res.status(400).json({ msg: 'User is not registered'});

        } else if ( !user.state ) { // validate if user is active
            return res.status( 400 ).json({ msg: 'Incorrect email or password - state: false' });
        }

        //validate user password
        const validPassword = compare( password, user.password );
        
        if ( !validPassword ) {
            return res.status( 400 ).json({ msg: 'Incorrect email or password' });
        }
    
        //generate JWT
        const token = await generateJWT( user.id );

        res.json({ 
            user,
            token
        });

    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            msg: error.message
        });
    }

}

module.exports = {
    login
}