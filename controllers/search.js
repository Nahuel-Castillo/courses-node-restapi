const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Product, Category } = require('../models');

const collections = [
    'categories',
    'products',
    'roles',
    'users',
];

const searchUsers = async( term = '', limit = 5, res = response ) => {
    
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const user = await User.findById( term );

        return res.json( { results: user ? [ user ] : [] } );
    }

    const regex = new RegExp( term, 'i');

    const users = await User.find( { 
        $or: [ { name: regex }, { email: regex },  ],//condition or
        state: true,
    }).limit( limit );

    res.json( { results: users });

}

const searchCategories = async( term = '', limit = 5, res = response ) => {
    
    const isMongoId = ObjectId.isValid( term );
    
    if ( isMongoId ) {
        const category = await Category.findById( term );
        
        return res.json( { results: category ? [ category ] : [] } );
    }

    const regex = new RegExp( term, 'i');

    const categories = await Category.find( { 
        name: regex,
        state: true,
    }).limit( limit );

    res.json( { results: categories });
}

const searchProducts = async( term = '', limit = 5, res = response ) => {
    
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const category = await Category.findById( term ).populate('category', 'name');

        return res.json( { results: category ? [ category ] : [] } );
    }

    const regex = new RegExp( term, 'i');

    if ( regex.test( 'available' ) ) {
        const products = await Product.find({
            
            $or: [ { name: regex }, { description: regex }, { available: true } ],
            state:true

        }).populate('category', 'name').limit( limit );
        return res.json({ results: products });
    } 

    const products = await Product.find( { 
        $or: [ { name: regex }, { description: regex },  ],
        state: true,
    }).populate('category', 'name').limit( limit );

    res.json( { results: products });

}

const search = ( req = request, res = response ) => {

    const { collection, term } = req.params;
    const { limit = 5 } = req.query;

    if ( !collections.includes( collection ) ) {
        return res.status(400).json({ msg: `Not valid collection - Valid collections ${ collections }`});
    }

    switch ( collection ) {
        case 'categories':
            return searchCategories( term, Number(limit), res);

        case 'products':
            return searchProducts( term,  Number(limit), res );

        case 'users':
            return searchUsers( term,  Number(limit), res );
    
        default:
            return res.status(500).json({ msg: 'Search not performered' });
    }
}



module.exports = {
    search
}