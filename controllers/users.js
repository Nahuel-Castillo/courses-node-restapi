const { response, request } = require('express');
const { encrypt } = require('../helpers/bcrypt');

const User = require('../models/user');

const getUser = async( req = request, res = response ) => {

    const { page = 1, limit = 5 } = req.query;
    const query = { state: true };

    //Bloking
    // const users = await User.find( { state: true } )
    //     .skip( Number( page - 1 ) )
    //     .limit( Number( limit ) );

    // const total = await User.countDocuments( { state: true } );

    //No bloking
    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query ).skip( Number( page - 1 ) ).limit( Number( limit ) ),
    ]);

    res.json({
        total,
        users
    });
}

const postUser = async( req, res = response ) => {
    
    try {
        const { name, email, password, role } = req.body;

        const user = new User( { name, email, password, role } );

        user.password = encrypt( password );
        
        await user.save();
    
        res.json( user );

    } catch (error) {
        console.error(error);

        res.status( 400 ).json({
            msg: error.message
        });
    }
}

const putUser = async( req, res = response ) => {

    try {
        
        const { id } = req.params;
    
        const { password, google, ...rest } = req.body;
    
        if ( password ) {
            rest.password = encrypt( password );
        }
    
        const user = await User.findByIdAndUpdate( id, rest , { new: true });
    
        res.json( user );

    } catch (error) {
        console.log(error);
        res.json({ msg: error.message });
    }
}

const patchUser = ( req, res = response ) => {

    res.json({
        msg: 'patch User'
    });
}

const deleteUser = async ( req, res = response ) => {

    try {
        const { id } = req.params;
    
        const user = await User.findByIdAndUpdate( id, { state: false }, { new: true } );
    
        res.json( user );
        
    } catch (error) {
        console.log( error );
        res.status(400).json({ msg: error.message });
    }
}

module.exports = {
    getUser,
    postUser,
    putUser,
    patchUser,
    deleteUser
}