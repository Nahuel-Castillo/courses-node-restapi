
const {  request, response } = require('express');
const { User } = require('../models');
const { compare, googleVerify, generateJWT } = require('../helpers');

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

const googleSignin = async( req, res = response ) => {

    const { id_token } = req.body;
    
    try {
        const { email, name, img } = await googleVerify( id_token );
        
        let user = await User.findOne( { email } );
        
        if ( !user ) {
            const data = {
                name,
                email,
                img,
                password: ':)',
                google: true
            }
            
            user = new User( data );
            await user.save();
        } 
        else if ( !user.state ) {
            return res.status(401).json({
                msg: 'Blocked user. Contact to administrator' 
            });
        }
        
        const token = await generateJWT( user.id );
        
        res.json({ user, token });
        
    } catch (error) {
        console.log( error );

        return res.status(400).json({
            msg: 'Google token is not valid'
        });
    }


}

module.exports = {
    login,
    googleSignin
}