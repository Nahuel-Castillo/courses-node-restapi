
const { response, request } = require('express');
const { body } = require('express-validator');
const { Product, Category } = require('../models');

const getProducts = async( req = request, res = response ) => {

    const { page = 1, limit = 5 } = req.query;

    const query = { state: true };

    try {
        
        const [ total, products ]  = await Promise.all([
            Product.countDocuments(  query ),
            Product.find( query ).populate('user', 'name').populate('category', 'name')
                .skip( Number( page - 1 ) ).limit( Number( limit ) )
        ]); 
    
        res.json( { total, products } );

    } catch (error) {
        console.log( error );
        res.status(500).json({ msg: 'Cant get products' });
    }

}

const getProductById = async( req = request, res = response ) => {

    const { id } = req.params;

    try {
        
        const product = await Product.findById( id ).populate( 'user', 'name' ).populate('category', 'name');

        res.json( product );

    } catch (error) {
        console.log( error );
        res.status(500).json({ msg: 'Cant get product'});
    }

}

const addProduct = async( req = request, res = response ) => {

    const { state, user, ...body } = req.body;

    const name = body.name.toUpperCase();
    
    try {
        const productDB = await Product.findOne( { name, state: false });

        if ( productDB ) {

            productDB.state = true;
            await productDB.save();

            return res.status(201).json( productDB );
        }
        
        const product = new Product( { ...body, name, user: req.user._id } );
    
        await product.save();
    
        res.status(201).json( product );

    } catch (error) {
        console.log( error );
        res.status(500).json( { msg: 'Cant add product' });
    }
}

const updateProduct = async( req = request, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;
    
    if ( data.name ) {
        data.name = data.name.toUpperCase();
    }

    try {
        
        const product = await Product.findByIdAndUpdate( id, { ...data }, { new: true } )
            .populate('user', 'name').populate('category', 'name');

        res.json( product );

    } catch (error) {
        console.log( error );
        res.status(500).json({ msg: 'Cant update product '});
    }

}

const deleteProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    try {
        
        const product = await Product.findByIdAndUpdate( id, { state: false } )
            .populate('user', 'name').populate('category', 'name');
    
        res.json( product );

    } catch (error) {
        console.log( error );
        res.status(500).json( { msg: 'Cant delete product ' } );
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
}